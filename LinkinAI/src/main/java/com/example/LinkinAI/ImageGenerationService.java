package com.example.LinkinAI;

import nu.pattern.OpenCV;
import org.opencv.core.*;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.*;
import java.nio.file.*;
import java.util.*;

/**
 * Image Generation Service.
 * Background removal: tries rembg (neural net) first, falls back to GrabCut.
 * Composites the cut-out person onto all 4 professional template backgrounds.
 */
@Service
public class ImageGenerationService {

    @PostConstruct
    public void initOpenCV() {
        OpenCV.loadShared();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Public API
    // ─────────────────────────────────────────────────────────────────────────

    public Map<String, byte[]> generateAllProfilePictures(MultipartFile profileImage,
            MultipartFile backgroundImage)
            throws IOException {

        Map<String, byte[]> outputImages = new HashMap<>();
        if (profileImage == null || profileImage.isEmpty())
            return outputImages;

        byte[] pfpBytes = profileImage.getBytes();

        // ── 1. Remove background → get RGBA bytes ─────────────────────────────
        byte[] rgbaBytes = removeBackground(pfpBytes);

        // ── 2. Decode RGBA, split into BGR + alpha mask ───────────────────────
        Mat encoded = new MatOfByte(rgbaBytes);
        Mat rgba = Imgcodecs.imdecode(encoded, Imgcodecs.IMREAD_UNCHANGED);
        encoded.release();

        if (rgba.empty())
            throw new IOException("Failed to decode background-removed image.");

        List<Mat> channels = new ArrayList<>();
        Core.split(rgba, channels);

        Mat personBGR = new Mat();
        Core.merge(channels.subList(0, 3), personBGR);
        Mat alphaMask = channels.get(3);

        // Smooth alpha edges
        Mat smoothAlpha = new Mat();
        Imgproc.GaussianBlur(alphaMask, smoothAlpha, new Size(5, 5), 1.5);
        alphaMask.release();
        for (int i = 0; i < 3; i++)
            channels.get(i).release();
        rgba.release();

        // ── 3. Tight-crop to person bounding box ─────────────────────────────
        MatOfPoint nonZero = new MatOfPoint();
        Core.findNonZero(smoothAlpha, nonZero);
        Rect bbox = null;
        if (!nonZero.empty())
            bbox = Imgproc.boundingRect(nonZero);
        nonZero.release();

        Mat croppedPerson = new Mat();
        Mat croppedMask = new Mat();
        if (bbox != null && bbox.width > 10 && bbox.height > 10) {
            personBGR.submat(bbox).copyTo(croppedPerson);
            smoothAlpha.submat(bbox).copyTo(croppedMask);
        } else {
            personBGR.copyTo(croppedPerson);
            smoothAlpha.copyTo(croppedMask);
        }
        personBGR.release();
        smoothAlpha.release();

        // ── 4. Composite onto each template ───────────────────────────────────
        String[] templates = {"office", "inferno", "mirage", "dust2", "anubis", "nuke"};
        for (String tmpl : templates) {
            try {
                byte[] result = compositeOnBackground(tmpl, null, croppedPerson, croppedMask);
                if (result != null && result.length > 0)
                    outputImages.put(tmpl, result);
            } catch (Exception e) {
                System.err.println("[WARN] Template '" + tmpl + "' failed: " + e.getMessage());
            }
        }

        // ── 5. Optional custom background ─────────────────────────────────────
        if (backgroundImage != null && !backgroundImage.isEmpty()) {
            try {
                byte[] result = compositeOnBackground("custom", backgroundImage, croppedPerson, croppedMask);
                if (result != null && result.length > 0)
                    outputImages.put("custom", result);
            } catch (Exception e) {
                System.err.println("[WARN] Custom background failed: " + e.getMessage());
            }
        }

        croppedPerson.release();
        croppedMask.release();
        return outputImages;
    }

    /**
     * Assembles a 2×2 grid. Missing panels become dark placeholders.
     */
    public byte[] generateProfilePicturesGrid(Map<String, byte[]> imagesMap) throws IOException {
        String[] order = {"office", "inferno", "mirage", "dust2", "anubis", "nuke"};
        int panelSize = 400;
        Mat[] panels = new Mat[6];

        for (int i = 0; i < 6; i++) {
            byte[] raw = imagesMap.get(order[i]);
            Mat decoded = (raw != null && raw.length > 0)
                    ? Imgcodecs.imdecode(new MatOfByte(raw), Imgcodecs.IMREAD_COLOR)
                    : new Mat(panelSize, panelSize, CvType.CV_8UC3, new Scalar(20, 20, 20));
            if (decoded.empty())
                decoded = new Mat(panelSize, panelSize, CvType.CV_8UC3, new Scalar(20, 20, 20));
            Mat resized = new Mat();
            Imgproc.resize(decoded, resized, new Size(panelSize, panelSize), 0, 0, Imgproc.INTER_AREA);
            decoded.release();
            panels[i] = resized;
        }

        Mat row1 = new Mat(), row2 = new Mat(), row3 = new Mat(), grid = new Mat();
        Core.hconcat(Arrays.asList(panels[0], panels[1]), row1);
        Core.hconcat(Arrays.asList(panels[2], panels[3]), row2);
        Core.hconcat(Arrays.asList(panels[4], panels[5]), row3);
        Core.vconcat(Arrays.asList(row1, row2, row3), grid);

        MatOfByte buf = new MatOfByte();
        MatOfInt cp = new MatOfInt(Imgcodecs.IMWRITE_PNG_COMPRESSION, 4);
        Imgcodecs.imencode(".png", grid, buf, cp);
        byte[] bytes = buf.toArray();

        for (Mat p : panels)
            p.release();
        row1.release();
        row2.release();
        row3.release();
        grid.release();
        buf.release();
        cp.release();
        return bytes;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Background Removal
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Removes the background from an image.
     * Priority: rembg (neural net) → GrabCut (fallback)
     */
    private byte[] removeBackground(byte[] inputBytes) throws IOException {
        // Try rembg first (much more accurate)
        try {
            return removeWithRembg(inputBytes);
        } catch (Exception e) {
            System.err.println("[INFO] rembg unavailable (" + e.getMessage() + "), falling back to GrabCut.");
            return removeWithGrabCut(inputBytes);
        }
    }

    /**
     * Uses Python rembg (U²-Net neural network) — writes to temp files and reads
     * back.
     */
    private byte[] removeWithRembg(byte[] inputBytes) throws IOException, InterruptedException {
        Path tempDir = Files.createTempDirectory("linkin_rembg_");
        Path inFile = tempDir.resolve("input.jpg");
        Path outFile = tempDir.resolve("output.png");

        try {
            Files.write(inFile, inputBytes);

            String pythonScript = "from rembg import remove\n" +
                    "from PIL import Image\n" +
                    "import sys\n" +
                    "img = Image.open(sys.argv[1])\n" +
                    "out = remove(img)\n" +
                    "out.save(sys.argv[2])\n";

            Path scriptFile = tempDir.resolve("rembg_run.py");
            Files.writeString(scriptFile, pythonScript);

            ProcessBuilder pb = new ProcessBuilder(
                    "python", scriptFile.toString(),
                    inFile.toString(), outFile.toString());
            pb.redirectErrorStream(true);
            Process proc = pb.start();

            // Drain output
            try (BufferedReader br = new BufferedReader(new InputStreamReader(proc.getInputStream()))) {
                while (br.readLine() != null) {
                }
            }

            int exitCode = proc.waitFor();
            if (exitCode != 0 || !Files.exists(outFile)) {
                throw new IOException("rembg exited with code " + exitCode);
            }

            return Files.readAllBytes(outFile);
        } finally {
            // Cleanup temp files
            try {
                Files.deleteIfExists(inFile);
            } catch (Exception ignored) {
            }
            try {
                Files.deleteIfExists(outFile);
            } catch (Exception ignored) {
            }
            try {
                Files.deleteIfExists(tempDir);
            } catch (Exception ignored) {
            }
        }
    }

    /**
     * GrabCut-based fallback with RECT initialization (more reliable than mask
     * init).
     * Returns RGBA PNG bytes.
     */
    private byte[] removeWithGrabCut(byte[] inputBytes) throws IOException {
        Mat encoded = new MatOfByte(inputBytes);
        Mat img = Imgcodecs.imdecode(encoded, Imgcodecs.IMREAD_COLOR);
        encoded.release();

        if (img.empty())
            throw new IOException("Failed to decode input image for GrabCut.");

        // Downscale for speed
        int maxDim = 600;
        double scale = 1.0;
        Mat small = new Mat();
        int srcMax = Math.max(img.rows(), img.cols());
        if (srcMax > maxDim) {
            scale = (double) maxDim / srcMax;
            Imgproc.resize(img, small,
                    new Size((int) (img.cols() * scale), (int) (img.rows() * scale)),
                    0, 0, Imgproc.INTER_AREA);
        } else {
            img.copyTo(small);
        }

        int W = small.cols(), H = small.rows();

        // ── RECT init: leave ~5% border as definite background ────────────────
        int rx = Math.max(5, (int) (W * 0.05));
        int ry = Math.max(5, (int) (H * 0.03));
        int rw = W - 2 * rx;
        int rh = H - ry - Math.max(3, (int) (H * 0.02));
        if (rw <= 0)
            rw = W / 2;
        if (rh <= 0)
            rh = H / 2;

        Rect grabRect = new Rect(rx, ry, rw, rh);
        Mat mask = new Mat(small.size(), CvType.CV_8UC1, new Scalar(Imgproc.GC_BGD));
        Mat bgdModel = new Mat();
        Mat fgdModel = new Mat();

        // First pass with RECT
        Imgproc.grabCut(small, mask, grabRect, bgdModel, fgdModel, 5, Imgproc.GC_INIT_WITH_RECT);

        // Second pass: hint center face + torso as definite FGD
        Imgproc.rectangle(mask,
                new Point((int) (W * 0.30), (int) (H * 0.08)),
                new Point((int) (W * 0.70), (int) (H * 0.50)),
                new Scalar(Imgproc.GC_FGD), -1);
        Imgproc.rectangle(mask,
                new Point((int) (W * 0.20), (int) (H * 0.50)),
                new Point((int) (W * 0.80), (int) (H * 0.90)),
                new Scalar(Imgproc.GC_FGD), -1);
        Imgproc.grabCut(small, mask, new Rect(), bgdModel, fgdModel, 3, Imgproc.GC_INIT_WITH_MASK);

        // Build binary alpha mask
        Mat alpha = new Mat(small.size(), CvType.CV_8UC1, new Scalar(0));
        for (int r = 0; r < mask.rows(); r++) {
            for (int c = 0; c < mask.cols(); c++) {
                double v = mask.get(r, c)[0];
                if (v == Imgproc.GC_FGD || v == Imgproc.GC_PR_FGD) {
                    alpha.put(r, c, 255);
                }
            }
        }

        // Upscale mask to original size if we downscaled
        Mat finalAlpha = new Mat();
        if (scale < 1.0) {
            Imgproc.resize(alpha, finalAlpha,
                    new Size(img.cols(), img.rows()), 0, 0, Imgproc.INTER_LINEAR);
            alpha.release();
        } else {
            finalAlpha = alpha;
        }

        // Smooth the mask
        Mat smoothedAlpha = new Mat();
        Imgproc.GaussianBlur(finalAlpha, smoothedAlpha, new Size(5, 5), 1.0);
        finalAlpha.release();

        // Merge BGR + alpha into RGBA
        List<Mat> bgrChannels = new ArrayList<>();
        Core.split(img, bgrChannels);
        bgrChannels.add(smoothedAlpha);
        Mat rgba = new Mat();
        Core.merge(bgrChannels, rgba);
        for (Mat c : bgrChannels)
            c.release();
        img.release();
        small.release();
        mask.release();
        bgdModel.release();
        fgdModel.release();

        // Encode to PNG (preserves alpha)
        MatOfByte outBuf = new MatOfByte();
        Imgcodecs.imencode(".png", rgba, outBuf);
        byte[] result = outBuf.toArray();
        rgba.release();
        outBuf.release();

        return result;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Compositing
    // ─────────────────────────────────────────────────────────────────────────

    private byte[] compositeOnBackground(String templateName,
            MultipartFile bgFile,
            Mat croppedPerson,
            Mat croppedMask) throws IOException {
        if (templateName != null)
            templateName = templateName.replace("_", "-").trim();

        // Load background
        Mat background = null;
        if (bgFile != null && !bgFile.isEmpty()) {
            Mat enc = new MatOfByte(bgFile.getBytes());
            background = Imgcodecs.imdecode(enc, Imgcodecs.IMREAD_COLOR);
            enc.release();
        }
        if (background == null || background.empty()) {
            String[] exts = { ".png", ".jpg", ".jpeg" };
            for (String ext : exts) {
                ClassPathResource res = new ClassPathResource("static/background/" + templateName + ext);
                if (res.exists()) {
                    try (InputStream is = res.getInputStream()) {
                        Mat enc = new MatOfByte(is.readAllBytes());
                        background = Imgcodecs.imdecode(enc, Imgcodecs.IMREAD_COLOR);
                        enc.release();
                        if (!background.empty())
                            break;
                    }
                }
            }
        }
        if (background == null || background.empty()) {
            throw new IOException("Background not found: " + templateName);
        }

        // Crop bg to square → resize 800×800
        Mat bgSq = cropToSquare(background);
        background.release();
        Mat canvas = new Mat();
        Imgproc.resize(bgSq, canvas, new Size(800, 800), 0, 0, Imgproc.INTER_LINEAR);
        bgSq.release();

        // Scale person to fill full canvas width (100%) to match original photo framing
        int targetW = 800;
        double sp = (double) targetW / croppedPerson.cols();
        int targetH = (int) (croppedPerson.rows() * sp);
        // Safety cap: if height exceeds canvas, scale down to fit height instead
        if (targetH > 800) {
            targetH = 800;
            sp = (double) targetH / croppedPerson.rows();
            targetW = (int) (croppedPerson.cols() * sp);
        }

        Mat personR = new Mat(), maskR = new Mat();
        Imgproc.resize(croppedPerson, personR, new Size(targetW, targetH), 0, 0, Imgproc.INTER_LINEAR);
        Imgproc.resize(croppedMask, maskR, new Size(targetW, targetH), 0, 0, Imgproc.INTER_LINEAR);

        // Position: center horizontally, center vertically
        int startX = (800 - targetW) / 2;
        int startY = (800 - targetH) / 2;

        int roiX1 = Math.max(0, startX), roiY1 = Math.max(0, startY);
        int roiX2 = Math.min(800, startX + targetW);
        int roiY2 = Math.min(800, startY + targetH);
        int pX1 = startX < 0 ? -startX : 0;
        int pY1 = startY < 0 ? -startY : 0;
        int roiW = roiX2 - roiX1, roiH = roiY2 - roiY1;

        if (roiW > 0 && roiH > 0) {
            Mat bgRoi = canvas.submat(new Rect(roiX1, roiY1, roiW, roiH));
            Mat fgRoi = personR.submat(new Rect(pX1, pY1, roiW, roiH));
            Mat maskRoi = maskR.submat(new Rect(pX1, pY1, roiW, roiH));

            for (int y = 0; y < roiH; y++) {
                for (int x = 0; x < roiW; x++) {
                    double a = maskRoi.get(y, x)[0] / 255.0;
                    if (a > 0.01) {
                        double[] fg = fgRoi.get(y, x);
                        double[] bg = bgRoi.get(y, x);
                        bgRoi.put(y, x,
                                fg[0] * a + bg[0] * (1 - a),
                                fg[1] * a + bg[1] * (1 - a),
                                fg[2] * a + bg[2] * (1 - a));
                    }
                }
            }
            bgRoi.release();
            fgRoi.release();
            maskRoi.release();
        }

        personR.release();
        maskR.release();

        MatOfByte buf = new MatOfByte();
        MatOfInt cp = new MatOfInt(Imgcodecs.IMWRITE_PNG_COMPRESSION, 4);
        Imgcodecs.imencode(".png", canvas, buf, cp);
        byte[] result = buf.toArray();
        canvas.release();
        buf.release();
        cp.release();
        return result;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Utility
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Public method: returns the RGBA PNG bytes of the person with background
     * removed.
     */
    public byte[] extractPersonRGBA(MultipartFile profileImage) throws IOException {
        return removeBackground(profileImage.getBytes());
    }

    private Mat cropToSquare(Mat src) {
        int w = src.cols();
        int h = src.rows();
        int size = Math.min(w, h);
        int x = (w - size) / 2;
        int y = (h - size) / 2;
        return src.submat(new Rect(x, y, size, size)).clone();
    }
}
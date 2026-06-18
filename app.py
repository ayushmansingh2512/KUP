import io
import traceback  # Added: for printing full error details in terminal
from fastapi import FastAPI, HTTPException, Request  # Changed: use Request instead of UploadFile/File
from fastapi.responses import Response
from PIL import Image  # Fixed: capitalized 'Image'
from rembg import remove, new_session
import uvicorn
#1 Initalize the fastAPI applcaation instance
app = FastAPI(title="LinkinAI Background removal service")
#  Decalre a global varaible to hold the neural network session
#  Placing this outside of the API fucntion ensure it stays loaded in ram
session = None
try:
    # Fixed indentation for the whole try block
    print("Loading U2Net Neural Network model into meomory...")
    # new_session() loads the actual PyTorch U2Net model weights.
    # This takes 2-3 seconds but runs ONLY ONCE when app.py starts up.
    session = new_session("u2net")
    print("Model loaded succesfully and is warm is RAM!")
except Exception as e:
    print(f"Error loading model: {e}")
    session = None
# defing the post endpoint for background removeal
@app.post("/remove-bg")
async def remove_background(request: Request):  # Changed: now reads raw bytes from request body
    """
    Recursive an image vin a multipart/form-data upload ,
    remove the background using the pre-loaded neural network session,
    and return the transparent PNG bytes directly.
    """
    #safety check . if the model failed to load startup  return an error

    if session is None:
        raise HTTPException(status_code=500, detail="Neural network Model not initiated.")

    try:
        #read the binary file assyncronally
        # Changed: read raw bytes from body directly instead of multipart
        contents = await request.body()

        # DEBUG: Print how many bytes we received and what format they appear to be
        print(f"[DEBUG] Received {len(contents)} bytes. First 10 bytes: {contents[:10]}")

        # step b convert the raw bytes into an in-memory byte straem  (io.byte)
        # and open it as a pillow image object . No files are written to disk
        input_image = Image.open(io.BytesIO(contents))  # Fixed: BytesIO instead of BytesID, and contents instead of contest

        # Step C : run the backgorund removal function
        # critical optimaization  we pass 'session=session' so that it uses
        # the model already loaded in RAM , avaoiding re-uploading overlaod
        output_image = remove(input_image, session=session)
        byte_arr = io.BytesIO()  # Fixed: BytesIO instead of BytesID
        output_image.save(byte_arr, format="PNG")
        byte_arr.seek(0)
        #Step E : Return the raw byte as image png mime Type
        return Response(content=byte_arr.getvalue(), media_type="image/png")  # Fixed: getvalue() instead of getValue()
    except Exception as e:
        # Print the full error details to the Python terminal so we can debug it
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Background removeal failed: {str(e)}")
# 4. standard python entry point  to launch  the Uvicorn on server prot 8000
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)

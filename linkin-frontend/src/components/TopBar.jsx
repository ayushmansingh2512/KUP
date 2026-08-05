import _Lottie from 'lottie-react'
import dashLottie from '../lottie/dashboredLogo.json'
import compassLottie from '../lottie/my_compass.json'
import './TopBar.css'

const Lottie = _Lottie.default ?? _Lottie

export default function TopBar() {
  return (
    <header className="top-bar">
      <div className="top-bar-title" data-cursor="WELCOME">
        <div className="tb-title-lottie-wrap">
          <Lottie animationData={compassLottie} loop autoplay className="tb-title-lottie" />
        </div>
        <span className="tb-title-brand">LinkedIn Navigator</span>
      </div>
      <div className="top-bar-spacer" />
      <div className="top-bar-actions">
        <div className="top-bar-brand" data-cursor="WELCOME">
          <div className="top-bar-lottie-wrap">
            <Lottie animationData={dashLottie} loop autoplay className="top-bar-brand-lottie" />
          </div>
        </div>
      </div>
    </header>
  )
}

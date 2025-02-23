import {VscGithubAlt} from 'react-icons/vsc'
import {FiInstagram} from 'react-icons/fi'
import {FaTwitter} from 'react-icons/fa'
import StateItem from '../../context/StateItem'
import './index.css'

export default function Footer() {
  return (
    <StateItem.Consumer>
      {value => {
        const {isDark} = value
        const bgColor = isDark ? 'darkbg' : 'brightbg'
        return (
          <footer className={`footer-container  ${bgColor}`}>
            <h1 className={`${!isDark && 'dark'} footer-header`}>
              COVID19<span className="footer-head">INDIA</span>
            </h1>
            <p className="footer-paragraph">
              we stand with everyone fighting on the front lines
            </p>
            <div className="footer-logos">
              <VscGithubAlt className="footerMediaLogo" />
              <FiInstagram className="footerMediaLogo" />
              <FaTwitter className="footerMediaLogo" />
            </div>
          </footer>
        )
      }}
    </StateItem.Consumer>
  )
}

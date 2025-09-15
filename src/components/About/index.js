import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Footer from '../Footer'
import StateItem from '../../context/StateItem'

import './index.css'

class About extends Component {
  state = {
    isloading: true,

    aboutDetails: [],
  }

  componentDidMount() {
    this.fetchAboutApi()
  }

  fetchAboutApi = async () => {
    const url = 'https://apis.ccbp.in/covid19-faqs'
    const response = await fetch(url)

    if (response.ok) {
      const fetchData = await response.json()

      this.setState({aboutDetails: fetchData.faq, isloading: false})
    } else {
      this.setState({isloading: false})
    }
  }

  renderLoader = () => (
    <div testid="aboutRouteLoader" className="loader">
      <Loader color="#3276e3" type="TailSpin" width={50} height={50} />
    </div>
  )

  render() {
    const {aboutDetails, isloading} = this.state

    const {isDark} = this.context
    return (
      <div
        className={`about-container ${
          isDark ? 'page-container-dark' : 'page-container-light'
        } `}
      >
        <Header />
        <div className="about-description-section">
          <h1
            className={`about-heading ${
              isDark ? 'about-heading-dark' : 'about-heading-light'
            }`}
          >
            About
          </h1>
          <p className="updated-date">Last Updated on 28th March 2021</p>
          <h2 className="covid-head">
            COVID-19 vaccines be ready for distribution
          </h2>
          {isloading ? (
            this.renderLoader()
          ) : (
            <ul testid="faqsUnorderedList">
              {aboutDetails.map(eachFaqs => (
                <li key={eachFaqs.qno}>
                  <p className="about-question">{eachFaqs.question}</p>
                  <p className="about-answer">{eachFaqs.answer}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Footer />
      </div>
    )
  }
}

About.contextType = StateItem

export default About

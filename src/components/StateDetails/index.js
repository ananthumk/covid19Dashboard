import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Footer from '../Footer'
import StateItem from '../../context/StateItem'
import StateSpecificTimeline from '../StateSpecificTimeline'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

export default class StateDetails extends Component {
  state = {
    stateDetails: {},
    apiStatus: apiStatusConstants.initial,
    filterType: 'confirmed',
    stateImage: '',
  }

  componentDidMount() {
    this.getEachStateDetails()
  }

  onClickFilterType = type => {
    this.setState({filterType: type})
  }

  getEachStateDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})

    const {match} = this.props
    const {params} = match
    const {stateCode} = params

    const fetchApiUrl = 'https://apis.ccbp.in/covid19-state-wise-data'

    try {
      const response = await fetch(fetchApiUrl)
      if (response.ok) {
        const jsonResponse = await response.json()

        const {statesList} = this.context
        const {districts, meta, total: stateTotal} = jsonResponse[stateCode]

        const districtsList = Object.keys(districts).map(eachDistrict => {
          const {total: districtTotal} = districts[eachDistrict]
          return {
            districtName: eachDistrict,
            confirmed: districtTotal.confirmed || 0,
            active:
              districtTotal.confirmed -
                (districtTotal.recovered + districtTotal.deceased) || 0,
            recovered: districtTotal.recovered || 0,
            deceased: districtTotal.deceased || 0,
          }
        })

        const {last_updated: lastUpdated} = meta
        const monthsList = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ]
        const lastUpdatedDate = new Date(lastUpdated)
        const formattedDate = lastUpdatedDate.getDate()
        const formattedMonth = monthsList[lastUpdatedDate.getMonth()]
        const formattedYear = lastUpdatedDate.getFullYear()

        const stateObject = statesList.find(
          eachState => eachState.state_code === stateCode,
        )

        const stateDetails = {
          stateName: stateObject.state_name,
          stateImageUrl: stateObject.state_image_url,
          stateCode,
          districtsList,
          confirmedCasesCount: stateTotal.confirmed || 0,
          activeCasesCount:
            stateTotal.confirmed -
              (stateTotal.recovered + stateTotal.deceased) || 0,
          recoveredCasesCount: stateTotal.recovered || 0,
          deceasedCasesCount: stateTotal.deceased || 0,
          tested: stateTotal.tested || 0,
          population: meta.population,
          lastUpdated: `${formattedMonth} ${formattedDate}, ${formattedYear}`,
        }

        console.log(stateDetails)
        this.setState({
          stateDetails,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      console.error('Error in fetching state specific details', error)
      this.setState({apiStatus: apiStatusConstants.failure})
    }

    let stateImg
    switch (stateCode) {
      case 'AS':
        stateImg = 'https://i.ibb.co/1f2m8xHT/Assam.png'
        break
      case 'AP':
        stateImg = 'https://i.ibb.co/n8wm3M6f/Andra-Pradesh.png'
        break
      case 'AR':
        stateImg = 'https://i.ibb.co/Q3tYvTWw/Arunchal-pradesh.png'
        break
      case 'BR':
        stateImg = 'https://i.ibb.co/kgMHn5hd/Bihar.png'
        break
      case 'CT':
        stateImg = 'https://i.ibb.co/SDCvSB91/Chattigath.png'
        break
      case 'GA':
        stateImg = 'https://i.ibb.co/Y9vvdW8/Goa.png'
        break
      case 'GJ':
        stateImg = 'https://i.ibb.co/Cpyg1H5g/Gujarat.png'
        break
      case 'HR':
        stateImg = 'https://i.ibb.co/6Rc2SBkQ/Haryana.png'
        break
      case 'HP':
        stateImg = 'https://i.ibb.co/ynQd1J1H/HP.png'
        break
      case 'JK':
        stateImg = 'https://i.ibb.co/wrBttH7w/jk.png'
        break
      case 'JH':
        stateImg = 'https://i.ibb.co/r2SKzBbS/Jharkand.png'
        break
      case 'KA':
        stateImg = 'https://i.ibb.co/MDGc89zx/Karnataka.png'
        break
      case 'KL':
        stateImg = 'https://i.ibb.co/WvDgfGRz/Kerala.png'
        break
      case 'TN':
        stateImg = 'https://i.ibb.co/GQmhsPzN/Tamil-Nadu.png'
        break
      case 'MH':
        stateImg = 'https://i.ibb.co/Q3D2qYbL/Maharastra.png'
        break
      case 'MP':
        stateImg = 'https://i.ibb.co/Myr5pxBh/MP.png'
        break
      case 'MN':
        stateImg = 'https://i.ibb.co/Csw4XXbV/Manipur.png'
        break
      case 'ML':
        stateImg = 'https://i.ibb.co/wrzmHmgB/Megalaya.png'
        break
      case 'MZ':
        stateImg = 'https://i.ibb.co/67RSRm6f/Mizoram.png'
        break
      case 'NL':
        stateImg = 'https://i.ibb.co/yccyzQrX/Nagaland.png'
        break
      case 'OR':
        stateImg = 'https://i.ibb.co/Gj8V7yZ/orissa.png'
        break
      case 'PB':
        stateImg = 'https://i.ibb.co/Y7JYp5k2/punjab.png'
        break
      case 'RJ':
        stateImg = 'https://i.ibb.co/8gTR0nmh/Rajasthan.png'
        break
      case 'SK':
        stateImg = 'https://i.ibb.co/nMrbMQhJ/Sikkim.png'
        break
      case 'TG':
        stateImg = 'https://i.ibb.co/bRbz95zr/Telegana.png'
        break
      case 'TR':
        stateImg = 'https://i.ibb.co/9mRkHYbh/Tripura.png'
        break
      case 'UP':
        stateImg = 'https://i.ibb.co/SDJPp91B/up.png'
        break
      case 'UT':
        stateImg = 'https://i.ibb.co/wrjgjXNd/Uttar-Kand.png'
        break
      case 'WB':
        stateImg = 'https://i.ibb.co/GQy6bscM/West-Bengal.png'
        break
      case 'AN':
        stateImg = 'https://i.ibb.co/LzbDJW0b/AN.png'
        break
      case 'CH':
        stateImg = 'https://i.ibb.co/nqZ2Wzxm/CH.png'
        break
      case 'DN':
        stateImg = 'https://i.ibb.co/DfHMHQCZ/DN.png'
        break
      case 'DL':
        stateImg = 'https://i.ibb.co/Ngph2mdB/DL.png'
        break
      case 'LD':
        stateImg = 'https://i.ibb.co/wZmC9b8p/LD.png'
        break
      case 'PY':
        stateImg = 'https://i.ibb.co/LdCKS39h/PY.png'
        break
      case 'LA':
        stateImg = 'https://i.ibb.co/tPvtWHNK/LA.png'
        break
      default:
        stateImg = ''
        break
    }
    this.setState({stateImage: stateImg})
  }

  sortDistricts = () => {
    const {filterType, stateDetails} = this.state
    const {districtsList} = stateDetails
    return districtsList
      .map(district => ({
        districtName: district.districtName,
        casesCount: (() => {
          switch (filterType) {
            case 'active':
              return district.active
            case 'recovered':
              return district.recovered
            case 'deceased':
              return district.deceased
            default:
              return district.confirmed
          }
        })(),
      }))
      .sort((a, b) => b.casesCount - a.casesCount)
  }

  renderLoadingView = () => (
    <div className="loader" testid="stateDetailsLoader">
      <Loader color="#3276e3" type="TailSpin" width={50} height={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <p className="failure-head">Failed to load data</p>
      <button
        type="button"
        onClick={this.getEachStateDetails}
        className="retrybtn"
      >
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {stateDetails, filterType, stateImage} = this.state
    const {isDark} = this.context

    const {
      stateName,
      lastUpdated,
      tested,
      confirmedCasesCount,
      activeCasesCount,
      deceasedCasesCount,
      recoveredCasesCount,

      population,
    } = stateDetails

    const textColor = isDark ? 'text-dark' : 'text-light'
    const buttonsList = [
      {
        label: 'Confirmed',
        type: 'confirmed',
        count: confirmedCasesCount,
        imgUrl:
          'https://res.cloudinary.com/dt0d1rirt/image/upload/v1720755503/check-mark_1_atutdi.png',
        imgalt: 'state specific confirmed cases pic',
        testid: 'stateSpecificConfirmedCasesContainer',
      },
      {
        label: 'Active',
        type: 'active',
        count: activeCasesCount,
        imgUrl:
          'https://res.cloudinary.com/dt0d1rirt/image/upload/v1720755504/protection_1_swla7g.png',
        imgalt: 'state specific active cases pic',
        testid: 'stateSpecificActiveCasesContainer',
      },
      {
        label: 'Recovered',
        type: 'recovered',
        count: recoveredCasesCount,
        imgUrl:
          'https://res.cloudinary.com/dt0d1rirt/image/upload/v1720755504/recovered_1_itiybf.png',
        imgalt: 'state specific recovered cases pic',
        testid: 'stateSpecificRecoveredCasesContainer',
      },
      {
        label: 'Deceased',
        type: 'deceased',
        count: deceasedCasesCount,
        imgUrl:
          'https://res.cloudinary.com/dt0d1rirt/image/upload/v1720755503/breathing_1_o43ee0.png',
        imgalt: 'state specific deceased cases pic',
        testid: 'stateSpecificDeceasedCasesContainer',
      },
    ]

    let districtColor = 'confirmed'
    if (filterType === 'confirmed') {
      districtColor = 'confirmed'
    }
    if (filterType === 'active') {
      districtColor = 'active'
    }
    if (filterType === 'recovered') {
      districtColor = 'recovered'
    }
    if (filterType === 'deceased') {
      districtColor = 'deceased'
    }

    const sortedDistricts = this.sortDistricts()
    return (
      <div className="state-details-section-page">
        <div className="state-name-section">
          <div className="state-nameNupdate-section">
            <div
              className={`state-name-container ${
                isDark ? 'sndark' : 'snlight'
              } `}
            >
              <h1 className="state-name-heading">{stateName}</h1>
            </div>
            <p
              className={`state-updated-paragraph ${
                isDark ? 'sd-dark' : 'sd-light'
              }`}
            >{`Last update on ${lastUpdated}`}</p>
          </div>
          <div className="state-tested-details">
            <p className={`tested-heading ${isDark ? 'sd-dark' : 'sd-light'}`}>
              Tested
            </p>
            <p className={`tested-number ${textColor}`}>{tested}</p>
          </div>
        </div>
        <div className="state-stats-container">
          {buttonsList.map(eachButton => {
            const isSelected = filterType === eachButton.type
            return (
              <div
                key={eachButton.type}
                testid={eachButton.testid}
                className={`state-stats-btn state-stats-${eachButton.type} ${
                  isSelected ? `state-${eachButton.type}-active` : ''
                }`}
                onClick={() => this.onClickFilterType(eachButton.type)}
                role="button"
                tabIndex={0}
              >
                <p className="button-stats-paragraph">{eachButton.label}</p>
                <img
                  src={eachButton.imgUrl}
                  className="button-stats-image"
                  alt={eachButton.imgalt}
                />
                <p className="button-stats-number">{eachButton.count}</p>
              </div>
            )
          })}
        </div>
        <div className="state-image-container">
          <img src={stateImage} alt="state-img" className="stateImages" />
          <div className="state-ncp-details">
            <h2 className="ncp-title">NCP report</h2>
            <div className="ncp-details-container">
              <div>
                <p className={`ncp-subhead ${isDark ? 'spdark' : 'splight'}`}>
                  Population
                </p>
                <p className="ncp-details">{population}</p>
              </div>
              <div>
                <p className={`ncp-subhead ${isDark ? 'spdark' : 'splight'}`}>
                  Tested
                </p>
                <p className="ncp-details">{tested}</p>
              </div>
            </div>
          </div>
        </div>
        <h1
          className={`top-district-heading state-stats-${districtColor}`}
          testid="lineChartsContainer"
        >
          Top Districts
        </h1>

        <ul className="top-district-list" testid="topDistrictsUnorderedList">
          {sortedDistricts.map(eachDistrict => (
            <li className="district-container" key={eachDistrict.districtName}>
              <div className="district-details">
                <h1 className="cases-count-districts">
                  {eachDistrict.casesCount}
                </h1>
                <p className="districts-name">{eachDistrict.districtName}</p>
              </div>
            </li>
          ))}
        </ul>

        <StateSpecificTimeline
          filterType={filterType}
          stateDetails={stateDetails}
        />
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state
    const {isDark} = this.context
    return (
      <>
        <Header />
        <div
          className={` ${
            isDark ? 'page-container-dark' : 'page-container-light'
          } state-details-container`}
        >
          {apiStatus === apiStatusConstants.loading && this.renderLoadingView()}
          {apiStatus === apiStatusConstants.success && this.renderSuccessView()}
          {apiStatus === apiStatusConstants.failure && this.renderFailureView()}
          {(apiStatus === apiStatusConstants.success ||
            apiStatus === apiStatusConstants.failure) && (
            <Footer className="stateSpecific-footer" />
          )}
        </div>
      </>
    )
  }
}

StateDetails.contextType = StateItem

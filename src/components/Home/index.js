import {Component} from 'react'
import {Link} from 'react-router-dom'
import {BsSearch} from 'react-icons/bs'
import {FcGenericSortingAsc, FcGenericSortingDesc} from 'react-icons/fc'
import {BiChevronRightSquare} from 'react-icons/bi'
import Loader from 'react-loader-spinner'
import StateItem from '../../context/StateItem'
import Footer from '../Footer'
import Header from '../Header'
import './index.css'

const statesList = [
  {
    state_code: 'AN',
    state_name: 'Andaman and Nicobar Islands',
  },
  {
    state_code: 'AP',
    state_name: 'Andhra Pradesh',
  },
  {
    state_code: 'AR',
    state_name: 'Arunachal Pradesh',
  },
  {
    state_code: 'AS',
    state_name: 'Assam',
  },
  {
    state_code: 'BR',
    state_name: 'Bihar',
  },
  {
    state_code: 'CH',
    state_name: 'Chandigarh',
  },
  {
    state_code: 'CT',
    state_name: 'Chhattisgarh',
  },
  {
    state_code: 'DN',
    state_name: 'Dadra and Nagar Haveli and Daman and Diu',
  },
  {
    state_code: 'DL',
    state_name: 'Delhi',
  },
  {
    state_code: 'GA',
    state_name: 'Goa',
  },
  {
    state_code: 'GJ',
    state_name: 'Gujarat',
  },
  {
    state_code: 'HR',
    state_name: 'Haryana',
  },
  {
    state_code: 'HP',
    state_name: 'Himachal Pradesh',
  },
  {
    state_code: 'JK',
    state_name: 'Jammu and Kashmir',
  },
  {
    state_code: 'JH',
    state_name: 'Jharkhand',
  },
  {
    state_code: 'KA',
    state_name: 'Karnataka',
  },
  {
    state_code: 'KL',
    state_name: 'Kerala',
  },
  {
    state_code: 'LA',
    state_name: 'Ladakh',
  },
  {
    state_code: 'LD',
    state_name: 'Lakshadweep',
  },
  {
    state_code: 'MH',
    state_name: 'Maharashtra',
  },
  {
    state_code: 'MP',
    state_name: 'Madhya Pradesh',
  },
  {
    state_code: 'MN',
    state_name: 'Manipur',
  },
  {
    state_code: 'ML',
    state_name: 'Meghalaya',
  },
  {
    state_code: 'MZ',
    state_name: 'Mizoram',
  },
  {
    state_code: 'NL',
    state_name: 'Nagaland',
  },
  {
    state_code: 'OR',
    state_name: 'Odisha',
  },
  {
    state_code: 'PY',
    state_name: 'Puducherry',
  },
  {
    state_code: 'PB',
    state_name: 'Punjab',
  },
  {
    state_code: 'RJ',
    state_name: 'Rajasthan',
  },
  {
    state_code: 'SK',
    state_name: 'Sikkim',
  },
  {
    state_code: 'TN',
    state_name: 'Tamil Nadu',
  },
  {
    state_code: 'TG',
    state_name: 'Telangana',
  },
  {
    state_code: 'TR',
    state_name: 'Tripura',
  },
  {
    state_code: 'UP',
    state_name: 'Uttar Pradesh',
  },
  {
    state_code: 'UT',
    state_name: 'Uttarakhand',
  },
  {
    state_code: 'WB',
    state_name: 'West Bengal',
  },
]

export default class Home extends Component {
  state = {
    isLoading: true,
    resultList: [],
    searchInputs: '',
    totalConfirmed: 0,
    totalRecovery: 0,
    totalActive: 0,
    totalDeceased: 0,
    showSearchResult: false,
    isAscending: true,
  }

  componentDidMount() {
    this.getCovidDetails()
  }

  onAscending = () => this.setState({isAscending: true})

  onDescending = () => this.setState({isAscending: false})

  successResponse = data => {
    const resultList = []
    let totalConfirmed = 0
    let totalActive = 0
    let totalRecovery = 0
    let totalDeceased = 0

    const keyNames = Object.keys(data)

    keyNames.forEach(keyName => {
      if (data[keyName]) {
        const {total} = data[keyName]

        const confirmed = total.confirmed ? total.confirmed : 0
        const deceased = total.deceased ? total.deceased : 0
        const recovered = total.recovered ? total.recovered : 0
        const tested = total.tested ? total.tested : 0
        const population = data[keyName].meta.population
          ? data[keyName].meta.population
          : 0
        const stateObject = statesList.find(
          state => state.state_code === keyName,
        )

        if (stateObject) {
          const active = confirmed - (deceased + recovered)
          resultList.push({
            stateCode: keyName,
            name: stateObject.state_name,
            confirmed,
            deceased,
            recovered,
            tested,
            population,
            active,
          })

          totalConfirmed += confirmed
          totalActive += active
          totalDeceased += deceased
          totalRecovery += recovered
        }
      }
    })

    this.setState({
      resultList,
      totalConfirmed,
      totalActive,
      totalDeceased,
      totalRecovery,
      isLoading: false,
    })
  }

  getCovidDetails = async () => {
    const url = 'https://apis.ccbp.in/covid19-state-wise-data'
    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()
      this.successResponse(data)
    }
  }

  renderLoader = () => (
    <div testid="homeRouteLoader" className="loader">
      <Loader color="#3276e3" type="TailSpin" width={50} height={50} />
    </div>
  )

  renderSuccess = () => (
    <div>
      {this.renderTabList()}
      {this.renderHeading()}
    </div>
  )

  onChangeStateSearch = event => {
    this.setState({
      searchInputs: event.target.value,
      showSearchResult: event.target.value.length > 0,
    })
  }

  renderSearchItem = () => {
    const {searchInputs, showSearchResult} = this.state

    const filteredStateList =
      searchInputs.length === 0
        ? statesList
        : statesList.filter(eachState =>
            eachState.state_name
              .toLowerCase()
              .includes(searchInputs.toLowerCase()),
          )
    return (
      <ul className="searchs" testid="searchResultsUnorderedList">
        {filteredStateList.map(eachStateList => (
          <li key={eachStateList.state_code}>
            <Link
              to={`/state/${eachStateList.state_code}`}
              className="route-link"
            >
              <div
                key={eachStateList.state_code}
                className="state-list-container"
              >
                <p className="state-list-name">{eachStateList.state_name}</p>
                <button className="state-list-btn" type="button">
                  <p className="state-code">{eachStateList.state_code}</p>
                  <BiChevronRightSquare className="state-arrow" />
                </button>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  onHandleError = stateName => {
    this.setState({
      searchInputs: stateName,
      showSearchResult: false,
    })
  }

  renderHeading = () => {
    const {resultList, searchInputs, isAscending} = this.state
    const {isDark} = this.context
    const sortedResultList = [...resultList].sort((a, b) =>
      isAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
    )

    const filteredTableList = sortedResultList.filter(item =>
      item.name.toLowerCase().includes(searchInputs.toLowerCase()),
    )

    return (
      <div
        className={`CovidTable ${
          isDark ? 'CovidTable-dark' : 'CovidTable-light'
        } `}
        testid="stateWiseCovidDataTable"
      >
        <div
          className={`covHeading-container ${
            isDark ? 'CovidTable-dark' : 'CovidTable-light'
          }`}
        >
          <div className="states">
            <p className="items-in-column">States/UT</p>
            <button
              type="button"
              testid="ascendingSort"
              onClick={this.onAscending}
              className="btn-1"
            >
              <FcGenericSortingAsc className="generic-state" />
            </button>
            <button
              type="button"
              onClick={this.onDescending}
              testid="descendingSort"
              className="btn-1"
            >
              <FcGenericSortingDesc className="generic-state" />
            </button>
          </div>
          <p className="items-in-column">Confirmed</p>
          <p className="items-in-column">Active</p>
          <p className="items-in-column">Recovered</p>
          <p className="items-in-column">Deceased</p>
          <p className="items-in-column">Population</p>
        </div>
        <hr className={`separator ${isDark ? 'dark-b' : ''}`} />
        <ul
          data-testid="searchResultsUnorderedList"
          className="each-state-details-list"
        >
          {filteredTableList.map(eachItem => (
            <li className="state-stats-list" key={eachItem.stateCode}>
              <Link to={`/state/${eachItem.stateCode}`} className="route-link">
                <div
                  key={eachItem.stateCode}
                  className="mobile-covHeading-container"
                >
                  <p className="tables-lists">{eachItem.name}</p>
                  <p className="tables-list tconfirmed">{eachItem.confirmed}</p>
                  <p className="tables-list tactive">{eachItem.active}</p>
                  <p className="tables-list trecovered">{eachItem.recovered}</p>
                  <p className="tables-list">{eachItem.deceased}</p>
                  <p className="tables-list">{eachItem.population}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderTabList = () => {
    const {
      totalActive,
      totalConfirmed,
      totalDeceased,
      totalRecovery,
    } = this.state

    return (
      <div className="tabList-container">
        <div testid="countryWideConfirmedCases" className="tabItem">
          <p className="confirm tabh">Confirmed</p>
          <img
            src="https://res.cloudinary.com/dt0d1rirt/image/upload/v1720755503/check-mark_1_atutdi.png"
            alt="country wide confirmed cases pic"
            className="tab-image confirm"
          />
          <p className="total-count confirm">{totalConfirmed}</p>
        </div>
        <div testid="countryWideActiveCases" className="tabItem">
          <p className="active tabh">Active</p>
          <img
            src="https://res.cloudinary.com/dt0d1rirt/image/upload/v1720755504/protection_1_swla7g.png"
            className="tab-image active"
            alt="country wide active cases pic"
          />
          <p className="total-count active">{totalActive}</p>
        </div>
        <div testid="countryWideRecoveredCases" className="tabItem">
          <p className="recovered tabh">Recovered</p>
          <img
            src="https://res.cloudinary.com/dt0d1rirt/image/upload/v1720755504/recovered_1_itiybf.png"
            className="tab-image recovered"
            alt="country wide recovered cases pic"
          />
          <p className="total-count recovered">{totalRecovery}</p>
        </div>
        <div testid="countryWideDeceasedCases" className="tabItem">
          <p className="decease tabh">Deceased</p>
          <img
            src="https://res.cloudinary.com/dt0d1rirt/image/upload/v1720755503/breathing_1_o43ee0.png"
            className="tab-image decease"
            alt="country wide deceased cases pic"
          />

          <p className="total-count decease">{totalDeceased}</p>
        </div>
      </div>
    )
  }

  render() {
    const {isLoading, searchInputs, showSearchResult} = this.state
    const {isDark} = this.context

    return (
      <div
        className={`home-page-container ${
          isDark ? 'page-container-dark' : 'page-container-light'
        } `}
      >
        <Header />
        <div className="input-container">
          <BsSearch className="search-input-icon" />
          <input
            type="search"
            className="search-input"
            onChange={this.onChangeStateSearch}
            placeholder="Enter the State"
            value={searchInputs}
          />
        </div>

        {(() => {
          if (isLoading) {
            return this.renderLoader()
          }
          if (showSearchResult) {
            return this.renderSearchItem()
          }
          return <div className="sccess-section">{this.renderSuccess()}</div>
        })()}
        <Footer />
      </div>
    )
  }
}

Home.contextType = StateItem

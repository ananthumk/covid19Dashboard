import {Component} from 'react'
import Select from 'react-select'
import Loader from 'react-loader-spinner'
import {MdHome} from 'react-icons/md'
import StateItem from '../../context/StateItem'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

class Vaccination extends Component {
  state = {
    states: [],
    districts: [],
    currentState: '',
    currentDistrict: '',
    isLoading: true,
    error: null,
    vaccinationData: null,
    activeTab: 'doses',
  }

  componentDidMount() {
    this.fetchState()
  }

  fetchState = async () => {
    const {currentState} = this.state

    const url = 'https://apis.ccbp.in/covid19-state-ids'
    const responseData = await fetch(url)
    if (responseData.ok) {
      const fetchData = await responseData.json()
      const stateUpdatedData = fetchData.states.map(eachState => ({
        value: eachState.state_id,
        label: eachState.state_name,
      }))

      const intialState = currentState || stateUpdatedData[0]?.value

      this.setState({states: stateUpdatedData, currentState: intialState})

      if (intialState) {
        await Promise.all([
          this.fetchDistrictDetails(intialState),
          this.fetchVaccinationDetails(intialState),
        ])
      }
    }
  }

  fetchDistrictDetails = async stateId => {
    const url = `https://apis.ccbp.in/covid19-districts-data/${stateId}`
    const response = await fetch(url)
    if (response.ok) {
      const districtFetchedData = await response.json()
      const districtUpdatedData = districtFetchedData.districts.map(
        eachDistrict => ({
          value: eachDistrict.district_id,
          label: eachDistrict.district_name,
        }),
      )

      this.setState({
        districts: districtUpdatedData,
        currentDistrict: districtFetchedData[0]?.value || 0,
        isLoading: false,
      })
    }
  }

  fetchVaccinationDetails = async stateId => {
    const url = `https://apis.ccbp.in/covid19-vaccination-data/`
    const response = await fetch(url)

    /* if (response.ok) {
      const data = await response.json()
      console.log(data)
      const {
        sessionSiteData,
        topBlock,
        vaccinationByAge,
        getBeneficiariesGroupBy,
        last7DaysRegistration,
        vaccinationDoneByTime,
        vaccinationDoneByTimeAgeWise,
      } = data

      const stateData = getBeneficiariesGroupBy.find(
        state => state.id === stateId,
      )

      const trendsData = vaccinationDoneByTime.map(item => ({
        time: item.label,
        total: item.count,
        dose1: Math.floor(item.count * 0.6),
        dose2: Math.floor(item.count * 0.4),
      }))

      const ageTrendsData = vaccinationDoneByTimeAgeWise.map(item => ({
        time: item.label,
        '18-44': item.vac_18_45,
        '45-60': item.vac_45_60,
        above60: item.vac_60_above,
      }))

      const maleCount = last7DaysRegistration.reduce(
        (sum, day) => sum + day.male,
        0,
      )
      const femaleCount = last7DaysRegistration.reduce(
        (sum, day) => sum + day.female,
        0,
      )
      const othersCount = last7DaysRegistration.reduce(
        (sum, day) => sum + day.others,
        0,
      )
      const totalGender = maleCount + femaleCount + othersCount

      const genderData = [
        {name: 'Male', value: Math.round((maleCount / totalGender) * 100)},
        {name: 'Female', value: Math.round((femaleCount / totalGender) * 100)},
        {name: 'Others', value: Math.round((othersCount / totalGender) * 100)},
      ]

      const vaccineData = [
        {name: 'Covishield', value: 70},
        {name: 'Covaxin', value: 25},
        {name: 'Sputnik V', value: 5},
      ]

      const totalVaccinated = vaccinationByAge.total
      const ageData = [
        {
          name: '18-44',
          value: Math.round(
            (vaccinationByAge.vac_18_45 / totalVaccinated) * 100,
          ),
        },
        {
          name: '45-60',
          value: Math.round(
            (vaccinationByAge.vac_45_60 / totalVaccinated) * 100,
          ),
        },
        {
          name: 'Above 60',
          value: Math.round(
            (vaccinationByAge.above_60 / totalVaccinated) * 100,
          ),
        },
      ]

      const updatedData = {
        sites: {
          totalSites: sessionSiteData.total_sites,
          goverment: sessionSiteData.govt_sites,
          private: sessionSiteData.pvt_sites,
          todayActive: sessionSiteData.sites_today,
        },
        registration: {
          total: topBlock.registration.total,
          today: topBlock.registration.today,
          last7days: last7DaysRegistration.map(each7Days => ({
            date: each7Days.reg_date,
            count: each7Days.total,
            male: each7Days.male,
            female: each7Days.female,
            others: each7Days.others,
          })),
        },
        vaccination: {
          total: topBlock.vaccination.total,
          today: topBlock.vaccination.today,
          dose1: topBlock.vaccination.tot_dose_1,
          dose2: topBlock.vaccination.tot_dose_2,
          precaution: topBlock.vaccination.tot_pd,
        },
        agewise: {
          total: vaccinationByAge.total,
          age12to14: vaccinationByAge.vac_12_14,
          age15to17: vaccinationByAge.vac_15_17,
          age18to45: vaccinationByAge.vac_18_45,
          age45to60: vaccinationByAge.vac_45_60,
          above60: vaccinationByAge.above_60,
        },
        stateSpecificData: stateData
          ? {
              total: stateData.total,
              partialVaccinated: stateData.partial_vaccinated,
              totallyVaccinated: stateData.totally_vaccinated,
              precautionDose: stateData.precaution_dose,
              today: stateData.today,
            }
          : null,
        trends: {
          byDoses: trendsData,
          byAge: ageTrendsData,
        },
        charts: {
          genderData,
          vaccineData,
          ageData,
        },
      }

      console.log({vaccinationData: updatedData, isLoading: false})
    } */
  }

  onChangeState = selectionOption => {
    this.setState(
      {
        currentState: selectionOption.value,
        isLoading: true,
      },
      async () => {
        await Promise.all([
          this.fetchDistrictDetails(selectionOption.value),
          this.fetchVaccinationDetails(selectionOption.value),
        ])
      },
    )
  }

  onChangeDistrict = selectionOption => {
    this.setState({
      currentDistrict: selectionOption.value,
    })
  }

  renderLoadingView = () => (
    <div className="loading-container" testid="vaccinationDetailsLoader">
      <Loader color="#3276e3" type="TailSpin" width={50} height={50} />
    </div>
  )

  renderVaccination = () => {
    const {vaccinationData, activeTab} = this.state

    const data =
      activeTab === 'doses'
        ? vaccinationData.trends.byDoses
        : vaccinationData.trends.byAge

    console.log(data)
  }

  renderSuccessView = () => {
    const {
      states,
      districts,
      currentState,
      currentDistrict,
      isLoading,
      error,
    } = this.state
    const selectedState = states.find(state => state.value === currentState)
    const selectedDistrict = districts.find(
      district => district.value === currentDistrict,
    )
    const {isDark} = this.context
    return (
      <div className="vaccine-containers">
        <div className="select-state-container">
          <MdHome
            className={`home-icon ${isDark ? 'icon-dark' : 'icon-light'} `}
          />
          <h1 className={`stateName ${isDark ? 'icon-dark' : 'icon-light'} `}>
            India/{selectedState?.label || 'Select State'}
          </h1>
        </div>
        <div className="dropdown-container">
          <Select
            value={selectedState}
            onChange={this.onChangeState}
            options={states}
            className="dropdown"
            classNamePrefix="select"
            placeholder="State"
          />
          <Select
            value={selectedDistrict}
            onChange={this.onChangeDistrict}
            options={districts}
            className="dropdown"
            classNamePrefix="select"
            placeholder="District"
            isDisabled={!currentState}
          />
        </div>
      </div>
    )
  }

  render() {
    const {isLoading} = this.state
    const {isDark} = this.context

    return (
      <>
        <Header />

        <div
          className={`vaccine-page-container ${
            isDark ? 'vaccination-container-bgdark' : 'vaccination-container-bg'
          }`}
        >
          {isLoading && this.renderLoadingView()}
          {!isLoading && this.renderSuccessView()}
        </div>
        <Footer />
      </>
    )
  }
}

Vaccination.contextType = StateItem

export default Vaccination

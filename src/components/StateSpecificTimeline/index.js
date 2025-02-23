import {Component} from 'react'
import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  BarChart,
  Bar,
  ResponsiveContainer,
} from 'recharts'
import Loader from 'react-loader-spinner'
import StateItem from '../../context/StateItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  loading: 'LOADING',
  failure: 'FAILURE',
}

export default class StateSpecificTimeline extends Component {
  state = {
    stateDatesList: [],
    apiStatus: apiStatusConstants.initial,
    isMobile: window.innerWidth <= 576,
  }

  componentDidMount() {
    this.getStateSpecificTimeLine()
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => this.setState({isMobile: window.innerWidth <= 576})

  getStateSpecificTimeLine = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})
    const {stateDetails} = this.props
    const {stateCode} = stateDetails
    const fetchApiUrl = 'https://apis.ccbp.in/covid19-timelines-data'
    const option = {
      method: 'GET',
    }
    try {
      const response = await fetch(fetchApiUrl, option)
      if (response.ok) {
        const fetchData = await response.json()
        const {dates} = fetchData[stateCode]
        const monthList = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ]
        const stateDatesList = Object.keys(dates).map(eachDates => {
          const {total} = dates[eachDates]
          const newEachDate = new Date(eachDates)
          const formattedDate = newEachDate.getDate()
          const formattedMonth = monthList[newEachDate.getMonth()]
          const formattedYear = newEachDate.getFullYear()
          return {
            date: `${formattedDate} ${formattedMonth} ${formattedYear}`,
            confirmed: total.confirmed || 0,
            active: total.confirmed - (total.deceased + total.recovered) || 0,
            deceased: total.deceased || 0,
            recovered: total.recovered || 0,
            tested: total.tested || 0,
          }
        })

        this.setState({
          stateDatesList,
          apiStatus: apiStatusConstants.success,
        })
      }
    } catch (e) {
      console.log(`There is an error in fetched API: ${e.message}`)
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loading-container" testid="timelinesDataLoader">
      <Loader color="#3276e3" type="TailSpin" width={50} height={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view_container">
      <p className="failure-view-paragraph">
        Something went Wrong. Please try again later
      </p>
    </div>
  )

  renderLineChart = (filteredTypeStateDates, filterType, fillColor) => (
    <div className="ha-outer-container">
      <div className={`${filterType}-lineCharts chart-container`}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            className="line-chart"
            data={filteredTypeStateDates}
            margin={{top: 5, left: 20, right: 30, bottom: 5}}
          >
            <XAxis
              dataKey="date"
              axisLine={{stroke: fillColor, strokeWidth: 2}}
              tickLine={{stroke: fillColor, strokeWidth: 2}}
              tick={{
                fill: fillColor,
                fontSize: window.innerWidth <= 576 ? 10 : 12,
              }}
              tickSize={window.innerWidth <= 576 ? 5 : 10}
            />
            <YAxis
              dataKey={filterType}
              axisLine={{stroke: fillColor, strokeWidth: 2}}
              tickLine={{stroke: fillColor, strokeWidth: 2}}
              tick={{
                fill: fillColor,
                fontSize: window.innerWidth <= 576 ? 10 : 12,
              }}
              tickSize={window.innerWidth <= 576 ? 2.4 : 5}
            />
            <Tooltip
              contentStyle={{
                fontSize: window.innerWidth <= 576 ? '10px' : '12px',
                padding: window.innerWidth <= 576 ? '5px' : '8px',
              }}
            />
            <Legend align="right" verticalAlign="top" />
            <Line type="monotone" dataKey={filterType} stroke={fillColor} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )

  renderSuccessView = () => {
    const {filterType} = this.props
    const {stateDatesList, isMobile} = this.state
    const {isDark} = this.context
    console.log(stateDatesList)
    const filteredStateDatesList = stateDatesList.slice(-10).map(eachDate => ({
      date: eachDate.date,
      [filterType]: Number(eachDate[filterType]) || 0,
    }))
    let fillColor = '#9A0E31'
    if (filterType === 'confirmed') {
      fillColor = '#9A0E31'
    } else if (filterType === 'active') {
      fillColor = '#0A4FA0'
    } else if (filterType === 'recovered') {
      fillColor = '#216837'
    } else if (filterType === 'deceased') {
      fillColor = '#474C57'
    }

    const CustomLabel = ({x, y, value, fill, offset}) => {
      const formattedValue =
        value < 100000
          ? `${(value / 1000).toFixed(1)}K`
          : `${(value / 100000).toFixed(1)}L`
      return (
        <text
          x={x + 25}
          y={y - offset}
          fill={fill}
          fontSize={16}
          textAnchor="middle"
        >
          {formattedValue}
        </text>
      )
    }

    return (
      <div className="timeline-container">
        <div className="outer-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredStateDatesList}
              margin={{
                top: isMobile ? 5 : 10,
                left: isMobile ? 10 : 20,
                right: isMobile ? 15 : 30,
                bottom: isMobile ? 2.5 : 5,
              }}
            >
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                dy={10}
                fontSize={isMobile ? 10 : 12}
                textAnchor={isMobile ? 'end' : 'middle'}
                height={isMobile ? 60 : 30}
              />
              <Tooltip
                formatter={value =>
                  value < 100000
                    ? `${(value / 1000).toFixed(1)}K`
                    : `${(value / 100000).toFixed(1)}L`
                }
                contentStyle={{
                  fontSize: isMobile ? '10px' : '12px',
                  padding: isMobile ? '5px' : '8px',
                }}
              />
              <Bar
                dataKey={filterType}
                fill={fillColor}
                barSize={isMobile ? 20 : 50}
                label={
                  <CustomLabel
                    fill={fillColor}
                    position="top"
                    offset={isMobile ? 5 : 10}
                  />
                }
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="line-charts-container-section">
          <h1
            className={`daily-sprends-heading ${
              isDark ? 'sd-darks' : 'sd-light'
            } `}
          >
            Daily Spread Trends
          </h1>

          {['confirmed', 'active', 'recovered', 'deceased', 'tested'].map(
            type =>
              this.renderLineChart(
                stateDatesList.map(eachDate => ({
                  date: eachDate.date,
                  [type]: eachDate[type],
                })),
                type,
                (() => {
                  switch (type) {
                    case 'confirmed':
                      return '#FF073A'
                    case 'active':
                      return '#007BFF'
                    case 'recovered':
                      return '#27A243'
                    case 'deceased':
                      return '#6C757D'
                    default:
                      return '#9673B9'
                  }
                })(),
              ),
          )}
        </div>
      </div>
    )
  }

  renderContent = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.loading:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="stateSpecific-timeline-container">
        {this.renderContent()}
      </div>
    )
  }
}

StateSpecificTimeline.contextType = StateItem

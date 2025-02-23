import React from 'react'

const StateItem = React.createContext({
  statesList: [],
  navTabList: [],
  activeTab: '',
  isDark: '',
  handleTheme: () => {},
  handleActiveId: () => {},
})

export default StateItem

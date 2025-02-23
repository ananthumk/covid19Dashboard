import {Component} from 'react'
import {Link} from 'react-router-dom'
import {FaMoon} from 'react-icons/fa'
import {IoMdSunny, IoMdCloseCircle} from 'react-icons/io'
import {AiOutlineMenuUnfold} from 'react-icons/ai'

import StateItem from '../../context/StateItem'

import './index.css'

export default class Header extends Component {
  state = {showMobileNavBar: false}

  handleMobileView = () => {
    this.setState(prevState => ({
      showMobileNavBar: !prevState.showMobileNavBar,
    }))
  }

  render() {
    const {showMobileNavBar} = this.state
    return (
      <StateItem.Consumer>
        {value => {
          const {
            activeTab,
            navTabList,
            handleActiveId,
            isDark,
            handleTheme,
          } = value
          const bgColor = isDark ? 'darkbg' : 'brightbg'

          return (
            <>
              <header className={`${bgColor} header`}>
                <Link
                  to="/"
                  className="link-container"
                  onClick={() => handleActiveId('home')}
                >
                  <h1 className={`${!isDark && 'dark'} Header-header`}>
                    COVID19<span className="header-head">INDIA</span>
                  </h1>
                </Link>
                <div className="mobile-nav-menu-items">
                  {isDark ? (
                    <IoMdSunny
                      className={`${isDark && 'white-color'} mobile-theme-icon`}
                      onClick={handleTheme}
                    />
                  ) : (
                    <FaMoon
                      className={`${
                        !isDark && 'black-color'
                      } mobile-theme-icon`}
                      onClick={handleTheme}
                    />
                  )}
                  <button
                    type="button"
                    className="header-btn"
                    onClick={this.handleMobileView}
                  >
                    <AiOutlineMenuUnfold
                      className={`header-image ${
                        isDark ? 'micon-dark' : 'micon-light'
                      }`}
                    />
                  </button>
                </div>

                <ul className="header-links">
                  {isDark ? (
                    <IoMdSunny
                      className={`${isDark && 'white-color'} theme-icon`}
                      onClick={handleTheme}
                    />
                  ) : (
                    <FaMoon
                      className={`${!isDark && 'black-color'} theme-icon`}
                      onClick={handleTheme}
                    />
                  )}
                  {navTabList.map(tab => (
                    <Link
                      to={tab.navLink}
                      key={tab.navTabId}
                      className="link-container"
                      onClick={() => handleActiveId(tab.navTabId)}
                    >
                      <li
                        className={`link-name ${(() => {
                          if (tab.navTabId !== activeTab) return ''
                          return isDark ? 'active-btn' : 'd-active-btn'
                        })()}
                        `}
                      >
                        {tab.navTabDisplayText}
                      </li>
                    </Link>
                  ))}
                </ul>
              </header>

              {showMobileNavBar && (
                <div className={`show-mobile ${bgColor}`}>
                  <ul className="mobile-header-links">
                    {navTabList.map(tab => (
                      <Link
                        to={tab.navLink}
                        className="link-container"
                        key={tab.navTabId}
                        onClick={() => handleActiveId(tab.navTabId)}
                      >
                        <li
                          className={`link-name ${
                            tab.navTabId === activeTab ? 'active-btn' : ''
                          }`}
                        >
                          {tab.navTabDisplayText}
                        </li>
                      </Link>
                    ))}
                  </ul>
                  <button
                    className="header-btn"
                    type="button"
                    onClick={this.handleMobileView}
                  >
                    <IoMdCloseCircle
                      className={`header-image ${
                        isDark ? 'micon-dark' : 'micon-light'
                      }`}
                    />
                  </button>
                </div>
              )}
            </>
          )
        }}
      </StateItem.Consumer>
    )
  }
}

import React from "react"
import ButtonRight from "../assets/img/buttonNavRight.svg"
import ButtonLeft from "../assets/img/buttonNavLeft.svg"
import weatherElements from "../assets/img/weatherElements.svg"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"
import history from "../routing/history"
import "./weather.css"

/**
 * shows the difference between climate and weather
 * @param {function} props.setPageNr setter for navigation
 */

const WeatherClimate = props => {
  //translation
  const { t } = useTranslation()

  /**
   * adds next navigation button
   * @returns dom element
   */
  function navigationNext() {
    return (
      <CSSTransition in={true} timeout={2000} classNames="show-button" unmountOnExit appear>
        <div className="navigation-button navigation-next-button">
          <button
            onClick={() => {
              props.setPageNr(5)
              history.push("/End")
            }}>
            <img src={ButtonRight} alt="continue"></img>
          </button>
        </div>
      </CSSTransition>
    )
  }

  /**
   * adds back navigation button
   * @returns dom element
   */
  function navigationBack() {
    return (
      <CSSTransition in={true} timeout={2000} classNames="show-button" unmountOnExit appear>
        <div className="navigation-button navigation-back-button">
          <button
            onClick={() => {
              props.setPageNr(3)
              history.push("/Weather")
            }}>
            <img src={ButtonLeft} alt="continue"></img>
          </button>
        </div>
      </CSSTransition>
    )
  }

  /**
   * creates a weather timeline graph
   * @returns dom element
   */
  function createWeatherTimeline() {
    return (
      <React.Fragment>
        <CSSTransition in={true} timeout={4000} classNames="fade" unmountOnExit appear>
          <div className="graph-container">
            <CSSTransition in={true} timeout={6000} classNames="fade-weather-text" unmountOnExit appear>
              <div className="description-text-container-weather">
                <p className="description-text-weather">
                  {t("Weather_Climate_Graph.1")} <br></br> <span className="subtitle-description-text">{t("Weather_Climate_Graph.2")}</span>
                </p>
              </div>
            </CSSTransition>
            {createWeatherCells()}
          </div>
        </CSSTransition>

        <CSSTransition in={true} timeout={7100} classNames="fade-arrow" unmountOnExit appear>
          <div className="graph-container arrow-container">
            <svg className="arrow" width="902" height="23" viewBox="0 0 902 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M901.061 12.5607C901.646 11.9749 901.646 11.0251 901.061 10.4393L891.515 0.893398C890.929 0.307612 889.979 0.307612 889.393 0.893398C888.808 1.47918 888.808 2.42893 889.393 3.01472L897.879 11.5L889.393 19.9853C888.808 20.5711 888.808 21.5208 889.393 22.1066C889.979 22.6924 890.929 22.6924 891.515 22.1066L901.061 12.5607ZM0 13H900V10H0V13Z"
                fill="#BBB9B9"
              />
            </svg>
            <CSSTransition in={true} timeout={10100} classNames="fade-weather-text" unmountOnExit appear>
              <div className="description-text-container-climate">
                <p className="description-text-climate">
                  {t("Weather_Climate_Graph.3")}
                  <br></br> <span className="subtitle-description-text">{t("Weather_Climate_Graph.4")}</span>
                </p>
              </div>
            </CSSTransition>
          </div>
        </CSSTransition>
      </React.Fragment>
    )
  }

  /**
   * creates graph content
   * @returns {array}
   */
  function createWeatherCells() {
    let cells = []
    const amount = 30

    //create all weather cells
    for (let i = 0; i < amount; i++) {
      cells.push(
        <div key={i} className={"weather-cell-" + i + " weather-cell-container"}>
          <img src={weatherElements} alt="weather-elements"></img>
        </div>
      )
    }
    return cells
  }

  /**
   * adds speach bubble with info for explaining the difference between cliamte and weather
   * @returns dom element
   */
  function createInfoBubble() {
    return (
      <CSSTransition in={true} timeout={4000} classNames="fade" unmountOnExit appear>
        <div className="bubble-box elements-bubble">
          <p className="bubble-box-text">
            <b>{t("Weather_Climate_Bubble.1")}</b>
            {t("Weather_Climate_Bubble.2")}
          </p>
        </div>
      </CSSTransition>
    )
  }

  /**
   * creates the header
   * @returns dom element
   */
  function createHeader() {
    return (
      <CSSTransition in={true} timeout={4000} classNames="fade" unmountOnExit appear>
        <div>
          <h1> {t("Weather_Climate_Title.1")}</h1>
          <h2 className="subtitle">{t("Weather_Climate_Title.2")}</h2>
          <h6 className="source">{t("Weather_Source")}</h6>
        </div>
      </CSSTransition>
    )
  }

  return (
    <React.Fragment>
      {createHeader()}
      {createWeatherTimeline()}
      {createInfoBubble()}
      {navigationBack()}
      {navigationNext()}
    </React.Fragment>
  )
}

export default WeatherClimate

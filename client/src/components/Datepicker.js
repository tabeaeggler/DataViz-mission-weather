import React from "react"
import ButtonRight from "../assets/img/buttonNavRight.svg"
import ButtonLeft from "../assets/img/buttonNavLeft.svg"
import DatePicker from "react-date-picker"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"
import history from "../routing/history"
import "./weather.css"

const Datepicker = props => {
  //translation
  const { t, i18n } = useTranslation()
  //state
  const [birthdate, setBirthdate] = useState(window.birthdateGlobalState)

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
              props.setPageNr(3)
              history.push(process.env.PUBLIC_URL + "/weather")
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
              props.setPageNr(1)
              history.push(process.env.PUBLIC_URL + "/map")
            }}>
            <img src={ButtonLeft} alt="continue"></img>
          </button>
        </div>
      </CSSTransition>
    )
  }

  /**
   * adds speach bubble with demand to enter birth date
   * @returns dom element
   */
  function createInfoBubble() {
    return (
      <CSSTransition in={true} timeout={4000} classNames="fade" unmountOnExit appear>
        <div className="bubble-box input-bubble input-bubble-date">
          <div className="bubble-box-text">
            <p className="input-bubble-title">{t("Datepicker_Bubble.1")}</p>
            <span className="input-bubble-subtitle">{t("Datepicker_Bubble.2")}</span>
            <br></br>
            <span className="selected-date">
              {birthdate !== undefined ? birthdate.toLocaleString("de-DE").slice(0, -10) : "-- -- ----"}
            </span>
          </div>
        </div>
      </CSSTransition>
    )
  }

  /**
   * react lifecycle
   */
  useEffect(() => {
    window.birthdateGlobalState = birthdate
  }, [birthdate])

  return (
    <React.Fragment>
      {navigationNext()}
      {navigationBack()}
      {createInfoBubble()}
      <CSSTransition in={true} timeout={4000} classNames="fade" unmountOnExit appear>
        <div>
          <h1> {t("Map_Title.1")}</h1>
          <h2 className="subtitle">{t("Map_Title.3")}</h2>
        </div>
      </CSSTransition>
      <CSSTransition in={true} timeout={4000} classNames="fade" unmountOnExit appear>
        <div className="datepicker-container">
          <DatePicker
            locale={i18n.language}
            onChange={setBirthdate}
            value={birthdate}
            format="dd.MM.y"
            maxDate={new Date()}
            minDate={new Date(1939, 0, 1)}
            isOpen={true}
          />
        </div>
      </CSSTransition>
    </React.Fragment>
  )
}

export default Datepicker

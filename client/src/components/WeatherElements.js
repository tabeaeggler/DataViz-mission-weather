import React, { useState, useEffect } from "react"
import ButtonRight from "../assets/img/buttonNavRight.svg"
import ButtonLeft from "../assets/img/buttonNavLeft.svg"
import Element from "./Element"
import { Modal } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"
import history from "../routing/history"
import axios from "axios"
import "./weather.css"

/**
 * shows personalized weather elements
 * @param {function} props.setPageNr setter for navigation
 */

const WeatherElements = props => {
  //translation
  const { t } = useTranslation()

  //data
  const [data, setData] = useState({})

  //bootstrap modal (if server error)
  const [error, setError] = useState(false)
  const handleClose = () => {
    setError(false)
    props.setPageNr(2)
    history.push(process.env.PUBLIC_URL + "/datepicker")
  }

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
              props.setPageNr(4)
              history.push(process.env.PUBLIC_URL + "/climate")
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
              props.setPageNr(2)
              history.push(process.env.PUBLIC_URL + "/datepicker")
            }}>
            <img src={ButtonLeft} alt="continue"></img>
          </button>
        </div>
      </CSSTransition>
    )
  }

  /**
   * creates a container with all weather elements
   * @returns dom element
   */
  function createWeatherElements() {
    return (
      <CSSTransition in={true} timeout={4000} classNames="fade" unmountOnExit appear>
        <div className="element-wrapper">
          <Element identifier={"1"} value={data.heat_days} name={"heatdays"}></Element>
          <Element identifier={"2"} value={data.clear_days} name={"cleardays"}></Element>
          <Element identifier={"3"} value={data.snow_days} name={"snowdays"}></Element>
          <Element identifier={"4"} value={data.rain_days} name={"raindays"}></Element>
          <Element identifier={"5"} value={data.mean_temp} name={"mean"}></Element>
        </div>
      </CSSTransition>
    )
  }

  /**
   * adds speach bubble with info for weather elements
   * @returns dom element
   */
  function createInfoBubble() {
    return (
      <CSSTransition in={true} timeout={4000} classNames="fade" unmountOnExit appear>
        <div className="bubble-box elements-bubble">
          <p className="bubble-box-text">
            <b>{t("Weather_Elements_Bubble.1")}</b>
            {t("Weather_Elements_Bubble.2") + window.stationGlobalState + t("Weather_Elements_Bubble.3")}
            <b>{t("Weather_Elements_Bubble.4")}</b>
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
          <h1>{t("Weather_Title.3")}</h1>
          <h2 className="subtitle">
            {t("Weather_Title.1") + data.lived_days + t("Weather_Title.2")} "{window.regionReadableGlobalState}" -
          </h2>
          <h6 className="source">{t("Weather_Source")}</h6>
        </div>
      </CSSTransition>
    )
  }

  /**
   * creates a modal informing the user of a server error
   * @returns dom element
   */
  function createModal() {
    return (
      <Modal show={error} onHide={handleClose} keyboard={false}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="timeout-text">
          {t("Error.1")}
          <br></br>
          <button
            onClick={() => {
              handleClose()
            }}
            className="stay-button">
            {t("Error.2")}
          </button>
        </Modal.Body>
      </Modal>
    )
  }

  /**
   * react lifecycle
   */
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST}/data`, {
        params: { region: window.regionGlobalState, birthdate: window.birthdateGlobalState },
      })
      .then(res => {
        setData(res.data)
      })
      .catch(function (error) {
        console.log(error)
        setData({
          clear_days: "???",
          heat_days: "???",
          lived_days: "6054",
          mean_temp: "???",
          rain_days: "???",
          snow_days: "???",
        })
        setError(true)
      })
  }, [])

  return (
    <React.Fragment>
      <CSSTransition in={true} timeout={2000} classNames="fade-slow" unmountOnExit appear>
        <div>
          {createHeader()}
          {createWeatherElements()}
          {error ? null : createInfoBubble()}
          {navigationBack()}
          {navigationNext()}
          {createModal()}
        </div>
      </CSSTransition>
    </React.Fragment>
  )
}

export default WeatherElements

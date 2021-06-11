import React from "react"
import ButtonRight from "../assets/img/buttonNavRight.svg"
import ButtonLeft from "../assets/img/buttonNavLeft.svg"
import * as d3 from "d3"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"
import history from "../routing/history"
import "./weather.css"

/**
 * creates the end screen of the weather presentation
 * @param {function} props.setPageNr setter for navigation
 */
const Map = props => {
  //translation
  const { t } = useTranslation()
  //state
  const [region, setRegion] = useState(window.regionGlobalState)

  //station dictionary for translation
  var dictStations = {}
  dictStations["zentralschweiz"] = t("Map_Region_Stations.1")
  dictStations["ostschweiz"] = t("Map_Region_Stations.2")
  dictStations["ostschweiz_bergregion"] = t("Map_Region_Stations.3")
  dictStations["mittelland"] = t("Map_Region_Stations.4")
  dictStations["zürich"] = t("Map_Region_Stations.5")
  dictStations["nordwestschweiz"] = t("Map_Region_Stations.6")
  dictStations["genferseeregion"] = t("Map_Region_Stations.7")
  dictStations["tessin"] = t("Map_Region_Stations.8")

  //region dictionary for translation
  var dictRegions = {}
  dictRegions["zentralschweiz"] = t("Map_Region.1")
  dictRegions["ostschweiz"] = t("Map_Region.2")
  dictRegions["ostschweiz_bergregion"] = t("Map_Region.3")
  dictRegions["mittelland"] = t("Map_Region.4")
  dictRegions["zürich"] = t("Map_Region.5")
  dictRegions["nordwestschweiz"] = t("Map_Region.6")
  dictRegions["genferseeregion"] = t("Map_Region.7")
  dictRegions["tessin"] = t("Map_Region.8")

  /**
   * handles button click: change color of buttons and change state
   * @param {string} region region in german
   */
  function handleClick(region) {
    d3.selectAll(".canton-button").style("background-color", "#2d2d2e").style("color", "#bbb9b9")
    d3.selectAll("." + region.toLowerCase())
      .style("background-color", "#40B79B")
      .style("color", "#2D2D2E")
    setRegion(region)
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
              props.setPageNr(2)
              history.push("/Datepicker")
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
              props.setPageNr(0)
              history.push("/")
            }}>
            <img src={ButtonLeft} alt="continue"></img>
          </button>
        </div>
      </CSSTransition>
    )
  }

  /**
   * adds speach bubble with demand to enter birth region
   * @returns dom element
   */
  function createInfoBubble() {
    return (
      <CSSTransition in={true} timeout={4000} classNames="fade" unmountOnExit appear>
        <div className="bubble-box input-bubble">
          <div className="bubble-box-text">
            <p className="input-bubble-title">{t("Map_Bubble.1")}</p>
            <span className="input-bubble-subtitle">{t("Map_Bubble.2")}</span>
            <br></br>
            <span className="selected-region">{dictRegions[region]} </span>
          </div>
        </div>
      </CSSTransition>
    )
  }

  /**
   * creates a map with regions
   * @returns dom element
   */
  function createMap() {
    return (
      <CSSTransition in={true} timeout={4000} classNames="fade" unmountOnExit appear>
        <div>
          <h1> {t("Map_Title.1")}</h1>
          <h2 className="subtitle">{t("Map_Title.2")}</h2>
          <div className="map-container">
            <div className="button-container">
              <button
                className={
                  region === "ostschweiz" ? "canton-button ostschweiz init-selected" : "canton-button ostschweiz"
                }
                style={{ left: "calc(5*68px)", top: 0 }}
                onClick={() => handleClick("ostschweiz")}>
                SH
              </button>
              <button
                className={
                  region === "mittelland" ? "canton-button mittelland init-selected" : "canton-button mittelland"
                }
                style={{ left: "calc(2*68px)", top: "calc(1*68px)" }}
                onClick={() => handleClick("mittelland")}>
                JU
              </button>
              <button
                className={
                  region === "nordwestschweiz"
                    ? "canton-button nordwestschweiz init-selected"
                    : "canton-button nordwestschweiz"
                }
                style={{ left: "calc(3*68px)", top: "calc(1*68px)" }}
                onClick={() => handleClick("nordwestschweiz")}>
                BS/BL
              </button>
              <button
                className={
                  region === "nordwestschweiz"
                    ? "canton-button nordwestschweiz init-selected"
                    : "canton-button nordwestschweiz"
                }
                style={{ left: "calc(4*68px)", top: "calc(1*68px)" }}
                onClick={() => handleClick("nordwestschweiz")}>
                AG
              </button>
              <button
                className={region === "zürich" ? "canton-button zürich init-selected" : "canton-button zürich"}
                style={{ left: "calc(5*68px)", top: "calc(1*68px)" }}
                onClick={() => handleClick("zürich")}>
                ZH
              </button>
              <button
                className={
                  region === "ostschweiz" ? "canton-button ostschweiz init-selected" : "canton-button ostschweiz"
                }
                style={{ left: "calc(6*68px)", top: "calc(1*68px)" }}
                onClick={() => handleClick("ostschweiz")}>
                TG
              </button>
              <button
                className={
                  region === "ostschweiz" ? "canton-button ostschweiz init-selected" : "canton-button ostschweiz"
                }
                style={{ left: "calc(7*68px)", top: "calc(1.5*68px)" }}
                onClick={() => handleClick("ostschweiz")}>
                AR/AI
              </button>
              <button
                className={
                  region === "mittelland" ? "canton-button mittelland init-selected" : "canton-button mittelland"
                }
                style={{ left: "calc(2*68px)", top: "calc(2*68px)" }}
                onClick={() => handleClick("mittelland")}>
                NE
              </button>
              <button
                className={
                  region === "mittelland" ? "canton-button mittelland init-selected" : "canton-button mittelland"
                }
                style={{ left: "calc(3*68px)", top: "calc(2*68px)" }}
                onClick={() => handleClick("mittelland")}>
                SO
              </button>
              <button
                className={
                  region === "zentralschweiz"
                    ? "canton-button zentralschweiz init-selected"
                    : "canton-button zentralschweiz"
                }
                style={{ left: "calc(4*68px)", top: "calc(2*68px)" }}
                onClick={() => handleClick("zentralschweiz")}>
                LU
              </button>
              <button
                className={
                  region === "zentralschweiz"
                    ? "canton-button zentralschweiz init-selected"
                    : "canton-button zentralschweiz"
                }
                style={{ left: "calc(5*68px)", top: "calc(2*68px)" }}
                onClick={() => handleClick("zentralschweiz")}>
                ZG
              </button>
              <button
                className={
                  region === "ostschweiz" ? "canton-button ostschweiz init-selected" : "canton-button ostschweiz"
                }
                style={{ left: "calc(6*68px)", top: "calc(2*68px)" }}
                onClick={() => handleClick("ostschweiz")}>
                SG
              </button>
              <button
                className={
                  region === "genferseeregion"
                    ? "canton-button genferseeregion init-selected"
                    : "canton-button genferseeregion"
                }
                style={{ left: "calc(1*68px)", top: "calc(3*68px)" }}
                onClick={() => handleClick("genferseeregion")}>
                VD
              </button>
              <button
                className={
                  region === "mittelland" ? "canton-button mittelland init-selected" : "canton-button mittelland"
                }
                style={{ left: "calc(2*68px)", top: "calc(3*68px)" }}
                onClick={() => handleClick("mittelland")}>
                FR
              </button>
              <button
                className={
                  region === "mittelland" ? "canton-button mittelland init-selected" : "canton-button mittelland"
                }
                style={{ left: "calc(3*68px)", top: "calc(3*68px)" }}
                onClick={() => handleClick("mittelland")}>
                BE
              </button>
              <button
                className={
                  region === "zentralschweiz"
                    ? "canton-button zentralschweiz init-selected"
                    : "canton-button zentralschweiz"
                }
                style={{ left: "calc(4*68px)", top: "calc(3*68px)" }}
                onClick={() => handleClick("zentralschweiz")}>
                OW/NW
              </button>
              <button
                className={
                  region === "zentralschweiz"
                    ? "canton-button zentralschweiz init-selected"
                    : "canton-button zentralschweiz"
                }
                style={{ left: "calc(5*68px)", top: "calc(3*68px)" }}
                onClick={() => handleClick("zentralschweiz")}>
                SZ
              </button>
              <button
                className={
                  region === "ostschweiz_bergregion"
                    ? "canton-button ostschweiz_bergregion init-selected"
                    : "canton-button ostschweiz_bergregion"
                }
                style={{ left: "calc(6*68px)", top: "calc(3*68px)" }}
                onClick={() => handleClick("ostschweiz_bergregion")}>
                GL
              </button>
              <button
                className={
                  region === "ostschweiz_bergregion"
                    ? "canton-button ostschweiz_bergregion init-selected"
                    : "canton-button ostschweiz_bergregion"
                }
                style={{ left: "calc(7*68px)", top: "calc(3*68px)" }}
                onClick={() => handleClick("ostschweiz_bergregion")}>
                GR
              </button>
              <button
                className={
                  region === "genferseeregion"
                    ? "canton-button genferseeregion init-selected"
                    : "canton-button genferseeregion"
                }
                style={{ left: "calc(0.5*68px)", top: "calc(4*68px)" }}
                onClick={() => handleClick("genferseeregion")}>
                GE
              </button>
              <button
                className={
                  region === "genferseeregion"
                    ? "canton-button genferseeregion init-selected"
                    : "canton-button genferseeregion"
                }
                style={{ left: "calc(2.5*68px)", top: "calc(4*68px)" }}
                onClick={() => handleClick("genferseeregion")}>
                VS
              </button>
              <button
                className={
                  region === "zentralschweiz"
                    ? "canton-button zentralschweiz init-selected"
                    : "canton-button zentralschweiz"
                }
                style={{ left: "calc(5*68px)", top: "calc(4*68px)" }}
                onClick={() => handleClick("zentralschweiz")}>
                UR
              </button>
              <button
                className={region === "tessin" ? "canton-button tessin init-selected" : "canton-button tessin"}
                style={{ left: "calc(5*68px)", top: "calc(5*68px)" }}
                onClick={() => handleClick("tessin")}>
                TI
              </button>
            </div>
          </div>
        </div>
      </CSSTransition>
    )
  }

  /**
   * react lifecycle
   */
  useEffect(() => {
    window.regionGlobalState = region
    window.regionReadableGlobalState = dictRegions[region]
    window.stationGlobalState = dictStations[region]
  }, [region, dictRegions, dictStations])

  return (
    <React.Fragment>
      {navigationNext()}
      {navigationBack()}
      {createInfoBubble()}
      {createMap()}
    </React.Fragment>
  )
}

export default Map

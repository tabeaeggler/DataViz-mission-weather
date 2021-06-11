import React from "react"
import "./weather.css"
import { useTranslation } from "react-i18next"

/**
 * creates visual representation of a weather element
 * @param {number} props.identifier weather element identifier
 * @param {number} props.value value of weather element
 * @param {string} props.name name of weather element
 */
const Element = props => {
  //translation
  const { t } = useTranslation()

  return (
    <div className={props.name + " element-container"}>
      <img src={require("../assets/img/" + props.name + ".svg")} alt="weather-element-icon"></img>
      <p className="element-text-container">
        <span className="element-title">
          {props.identifier === "5" ? props.value + " °C" : props.value}
          <br></br>
          {t("Weather_Elements." + props.identifier)}
        </span>
        <br></br>
        <span className="element-description">{t("Weather_Description." + props.identifier)}</span>
      </p>
    </div>
  )
}

export default Element

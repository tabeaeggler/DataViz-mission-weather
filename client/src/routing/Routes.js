import React from "react"
import { Router, Switch, Route } from "react-router-dom"
import Map from "../components/Map"
import Start from "../components/Start"
import End from "../components/End"
import Datepicker from "../components/Datepicker"
import WeatherElements from "../components/WeatherElements"
import WeatherClimate from "../components/WeatherClimate"
import history from "./history"

/**
 * Rendering of components with specific path
 * @param {function} props.setPageNr setter for navigation
 */
const Routes = props => {
  return (
    <Router history={history}>
      <Switch>
        <Route path={process.env.PUBLIC_URL} exact component={() => <Start setPageNr={props.setPageNr} />} />
        <Route path={process.env.PUBLIC_URL + "/map"} exact component={() => <Map setPageNr={props.setPageNr} />} />
        <Route path={process.env.PUBLIC_URL + "/datepicker"} exact component={() => <Datepicker setPageNr={props.setPageNr} />} />
        <Route path={process.env.PUBLIC_URL + "/weather"} exact component={() => <WeatherElements setPageNr={props.setPageNr} />} />
        <Route path={process.env.PUBLIC_URL + "/climate"} exact component={() => <WeatherClimate setPageNr={props.setPageNr} />} />
        <Route path={process.env.PUBLIC_URL + "/end"} exact component={() => <End setPageNr={props.setPageNr}/>} />
      </Switch>
    </Router>
  )
}
export default Routes

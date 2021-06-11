import React, { useState } from "react"
import ButtonLeft from "../assets/img/buttonNavLeft.svg"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"
import history from "../routing/history"
import { Modal } from "react-bootstrap"
import "../App.css"

/**
 * creates the end screen of the weather presentation
 * @param {function} props.setPageNr setter for navigation
 */
const End = props => {
  //translation
  const { t } = useTranslation()

  //bootstrap modal
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

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
              history.push(process.env.PUBLIC_URL + "/climate")
            }}>
            <img src={ButtonLeft} alt="continue"></img>
          </button>
        </div>
      </CSSTransition>
    )
  }

  /**
   * creates the title animation
   * @returns animated svg
   */
  function createAnimation() {
    return (
      <svg width="100">
        <path
          d="M100 50C100 77.6142 77.6142 100 50 100C22.3858 100 0 77.6142 0 50C0 22.3858 22.3858 0 50 0C77.6142 0 100 22.3858 100 50Z"
          fill="#F8D763">
          <animate
            id="anim1"
            attributeName="d"
            to="M100 87C100 114.614 77.6142 137 50 137C22.3858 137 0 114.614 0 87C0 59.3857 34.5 20.5 50 0C65.5 20 100 59.3857 100 87Z"
            begin="2s;anim3.end+1s"
            dur="3s"
            fill="freeze"
          />
          <animate id="anim2" fill="freeze" attributeName="fill" begin="2s;anim3.end+1s" dur="3s" to="#6A8ADF" />
          <animate
            id="anim3"
            attributeName="d"
            to="M100 50C100 77.6142 77.6142 100 50 100C22.3858 100 0 77.6142 0 50C0 22.3858 22.3858 0 50 0C77.6142 0 100 22.3858 100 50Z"
            begin="anim1.end+1s"
            dur="3s"
            fill="freeze"
          />
          <animate id="anim4" attributeName="fill" to="#F8D763" begin="anim1.end+1s" dur="3s" fill="freeze" />
        </path>
      </svg>
    )
  }

  /**
   * creates a modal with the "about" information
   * @returns dom element with modal
   */
  function createModal() {
    return (
      <Modal show={show} onHide={handleClose} keyboard={false}>
        <Modal.Header closeButton className="about-title">
          {t("End_Modal.1")}
        </Modal.Header>
        <Modal.Body>
          <p className="about-subtitle">
            {t("End_Modal.2")}
            <br></br>
            <span className="about-text">Tabea Eggler - tabea.eggler@students.fhnw.ch</span> <br></br>
            <span className="about-text">Hannah Kühne - hannahsarah.kuehne@students.fhnw.ch</span>
          </p>
          <p className="about-subtitle">
            {t("End_Modal.3")}
            <br></br>
            <span className="about-text">Doris Agotai - doris.agotai@fhnw.ch</span> <br></br>
            <span className="about-text">Marco Soldati - marco.soldati@fhnw.ch</span>
          </p>
          <p className="about-subtitle">
            {t("End_Modal.4")}
            <br></br>
            <span className="about-text"> {t("End_Modal.5")}</span>
          </p>
        </Modal.Body>
      </Modal>
    )
  }

  /**
   * creates "About" and "Go to Startpage" buttons
   * @returns dom element
   */
  function createButtons() {
    return (
      <div>
        <CSSTransition in={!show} timeout={{ enter: 4000, exit: 0 }} classNames="fade" unmountOnExit appear>
          <button
            onClick={() => {
              props.setPageNr(0)
              history.push(process.env.PUBLIC_URL)
            }}
            className="go-to-start-button">
            {t("End.2")}
          </button>
        </CSSTransition>
        <div className="about-button-container">
          <button className="about-button" id={show ? "about-button-clicked" : null} onClick={() => handleShow()}>
            About
          </button>
        </div>
      </div>
    )
  }

  /**
   * creates the title of the page
   * @returns dom element
   */
  function createTitle() {
    return (
      <CSSTransition in={!show} timeout={{ enter: 4000, exit: 0 }} classNames="fade" unmountOnExit appear>
        <div className="end-text-container">
          {createAnimation()}
          <p className="end-text">{t("Start.1")}</p>
          <p className="end-subtitle"> {t("End.1")}</p>
        </div>
      </CSSTransition>
    )
  }

  return (
    <React.Fragment>
      {navigationBack()}
      {createTitle()}
      {createButtons()}
      {createModal()}
    </React.Fragment>
  )
}

export default End

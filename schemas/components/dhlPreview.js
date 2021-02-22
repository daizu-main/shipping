import React, { Component } from "react"
import PropTypes from "prop-types"
import { GiFactory, GiTruck, GiCheckMark, GiMailbox } from "react-icons/gi"
import { BsFillExclamationTriangleFill } from "react-icons/bs"
import { FaQuestion, FaDhl } from "react-icons/fa"

const formatDate = (inputDate) => {
  const [datePart, timePart] = inputDate.split("T")
  const outputDate = datePart.split("-").reverse().join(".")
  const outputTime = timePart.split(":").slice(0, 2).join(":")
  return `${outputDate}, ${outputTime}`
}

const getRedirected = (str) => {
  return (
    str.includes("The shipment is being brought to") ||
    str.includes("The shipment is available for pick-up from")
  )
}

const getPackstation = (str) => {
  return (
    str.includes("The shipment is ready for pick-up at the") &&
    str.includes("PACKSTATION")
  )
}

const StatusSymbol = ({ status }) => {
  switch (status) {
    case "delivered":
      return <GiCheckMark size="3em" style={{ minWidth: "50px" }} />
    case "packstation":
      return <GiMailbox size="3em" style={{ minWidth: "50px" }} />
    case "redirect":
      return <FaDhl size="3em" style={{ minWidth: "50px" }} />
    case "pre-transit":
      return <GiFactory size="3em" style={{ minWidth: "50px" }} />
    case "transit":
      return <GiTruck size="3em" style={{ minWidth: "50px" }} />
    case "failure":
      return (
        <BsFillExclamationTriangleFill
          size="3em"
          style={{ minWidth: "50px" }}
        />
      )
    default:
      return <FaQuestion size="3em" style={{ minWidth: "50px" }} />
  }
}

export default class dhlPreview extends Component {
  static propTypes = { value: PropTypes.object }
  render() {
    const { time = "", status = "", statusCode = "" } = this.props.value
    const formattedTime = formatDate(time)
    const redirected = getRedirected(status)
    const packstation = getPackstation(status)
    const lastStatusCode = packstation
      ? "packstation"
      : redirected
      ? "redirect"
      : statusCode
    return (
      <div
        style={{
          minHeight: "2em",
          border: "2px grey",
          padding: "5px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        {lastStatusCode && <StatusSymbol status={lastStatusCode} />}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingLeft: "10px",
          }}
        >
          <div
            style={{
              fontWeight: 400,
              fontSize: "0.9em",
              color: "#111111",
              marginTop: 0,
              marginBottom: 0,
              paddingBottom: 0,
              paddingTop: 0,
            }}
            dangerouslySetInnerHTML={{ __html: status }}
          />
          <p
            style={{
              fontWeight: 300,
              fontSize: "0.8em",
              color: "#333333",
              marginTop: 0,
              marginBottom: 0,
              paddingTop: 0,
              paddingBottom: 0,
            }}
          >
            {formattedTime}
          </p>
        </div>
      </div>
    )
  }
}

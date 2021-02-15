import { GiFactory, GiTruck, GiCheckMark, GiMailbox } from "react-icons/gi"
import { BsFillExclamationTriangleFill } from "react-icons/bs"
import { FaQuestion, FaDhl } from "react-icons/fa"

const getRedirected = (str) => {
  return str.includes("The shipment is being brought to")
}

const getPackstation = (str) => {
  return (
    str.includes("The shipment is ready for pick-up at the") &&
    str.includes("PACKSTATION")
  )
}

const getIcon = (lastStatus) => {
  switch (lastStatus) {
    case "delivered":
      return GiCheckMark
    case "packstation":
      return GiMailbox
    case "redirect":
      return FaDhl
    case "pre-transit":
      return GiFactory
    case "transit":
      return GiTruck
    case "failure":
      return BsFillExclamationTriangleFill
    default:
      return FaQuestion
  }
}

const formatDate = (inputDate) => {
  const [datePart, timePart] = inputDate.split("T")
  const outputDate = datePart.split("-").reverse().join(".")
  const outputTime = timePart.split(":").slice(0, 2).join(":")
  return `${outputDate}, ${outputTime}`
}

export default {
  name: "dhlEvent",
  title: "Statusmeldung von DHL",
  type: "object",
  fields: [
    {
      name: "time",
      title: "Zeitpunkt",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "status",
      title: "Statusmeldung",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "statusCode",
      title: "Statuscode",
      type: "string",
    },
  ],
  preview: {
    select: {
      time: "time",
      status: "status",
      statusCode: "statusCode",
    },
    prepare({ time, status, statusCode }) {
      const redirected = getRedirected(status)
      const packstation = getPackstation(status)
      const lastStatusCode = packstation
        ? "packstation"
        : redirected
        ? "redirect"
        : statusCode
      const icon = getIcon(lastStatusCode)
      const [dateInput, clockInput] = time.split("T")
      const date = dateInput.split("-").reverse().join(".")
      const clock = clockInput.split(":").slice(0, 2).join(":")
      const timeOutput = formatDate(time)
      return {
        title: status,
        subtitle: timeOutput,
        media: icon,
      }
    },
  },
}

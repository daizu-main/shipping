import { GiFactory, GiTruck, GiCheckMark, GiMailbox } from "react-icons/gi"
import { BsFillExclamationTriangleFill } from "react-icons/bs"
import { FaQuestion, FaDhl } from "react-icons/fa"
import { BiBarcodeReader } from "react-icons/bi"
import { RiLoginBoxLine } from "react-icons/ri"
import moment from "moment-timezone"

const getStatusMessage = (arr, str) => {
  return Array.isArray(arr) && arr.length > 0 ? arr[0].statusCode : str
}

const getRedirected = (arr) => {
  return Array.isArray(arr) && arr.length > 0
    ? arr[0].status.includes("The shipment is being brought to")
    : false
}

const getPackstation = (arr) => {
  return Array.isArray(arr) && arr.length > 0
    ? arr[0].status.includes("The shipment is ready for pick-up at the") &&
        arr[0].status.includes("PACKSTATION")
    : false
}

const getDuration = (delivered, dhlEvents, date) => {
  const shipmentBeginning = delivered
    ? moment(dhlEvents[dhlEvents.length - 1].time)
    : Array.isArray(dhlEvents) && dhlEvents.length > 0
    ? moment(dhlEvents[0].time)
    : moment(date)
  const shipmentEnding = delivered ? moment(dhlEvents[0].time) : moment()
  const durationNumber = shipmentEnding.diff(shipmentBeginning, "days")
  const unit = durationNumber === 1 ? "day" : "days"
  return `${durationNumber} ${unit}`
}

const formatDate = (inputDate) => {
  const [datePart, timePart] = inputDate.split("T")
  const outputDate = datePart.split("-").reverse().join(".")
  const outputTime = timePart.split(":").slice(0, 2).join(":")
  return `${outputDate}, ${outputTime}`
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
    case "Der Auftrag wurde eingelesen":
      return BiBarcodeReader
    case "Der Auftrag ist eingegangen":
      return RiLoginBoxLine
    default:
      return FaQuestion
  }
}

export default {
  name: "shipment",
  title: "Lieferung",
  type: "document",
  fields: [
    {
      name: "orderNumber",
      title: "Bestellnummer (z.B. Shopify)",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "shippingNumbers",
      title: "Sendungsnummer (DHL)",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: "date",
      title: "erstellt am",
      type: "datetime",
      options: {
        timeStep: 1,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "duration",
      title: "Dauer (in Tagen)",
      description:
        "von Beginn bis Ende der Lieferung (bei ausgelieferten Bestellungen), seit der letzten DHL-Statusmeldung (bei nicht ausgelieferten Bestellungen), seit Erstellung der Lieferung",
      type: "number",
      readOnly: true,
    },
    {
      name: "targetWeightKg",
      title: "Sollgewicht in Kilogramm",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    },
    {
      name: "realWeightKg",
      title: "Gewicht in Kilogramm (entsprechend Paketwaage)",
      type: "number",
    },
    {
      name: "products",
      title: "Produkte",
      type: "array",
      of: [{ type: "product" }],
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: "zipCode",
      title: "Postleitzahl des Empfängers",
      type: "string",
      validation: (Rule) =>
        Rule.custom((zip) => {
          if (/^[0-9]{4,5}$/.test(zip)) {
            return true
          } else {
            return {
              message:
                "Die Postleitzahl ist nicht gültig. Sie muss vier- oder fünfstellig sein und nur aus Ziffern bestehen.",
            }
          }
        }),
    },
    {
      name: "status",
      title: "Status",
      type: "string",
    },
    {
      name: "delivered",
      title: "ausgeliefert?",
      type: "boolean",
    },
    {
      name: "dhlEvents",
      title: "Statusmeldungen von DHL",
      type: "array",
      of: [{ type: "dhlEvent" }],
    },
  ],
  preview: {
    select: {
      dhlEvents: "dhlEvents",
      delivered: "delivered",
      orderNumber: "orderNumber",
      status: "status",
      date: "date",
    },
    prepare({ dhlEvents, delivered, orderNumber, status, date }) {
      const statusMessage = getStatusMessage(dhlEvents, status)
      const redirected = getRedirected(dhlEvents)
      const packstation = getPackstation(dhlEvents)
      const lastStatusCode = packstation
        ? "packstation"
        : redirected
        ? "redirect"
        : statusMessage
      const icon = getIcon(lastStatusCode)
      const duration = getDuration(delivered, dhlEvents, date)
      const formattedDate = formatDate(date)
      return {
        title: orderNumber,
        subtitle: `${duration} (${formattedDate})`,
        media: icon,
      }
    },
  },
}

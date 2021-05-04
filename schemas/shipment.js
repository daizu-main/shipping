import {
  GiFactory,
  GiTruck,
  GiCheckMark,
  GiMailbox,
  GiReturnArrow,
} from "react-icons/gi"
import { BsFillExclamationTriangleFill } from "react-icons/bs"
import { FaQuestion, FaDhl } from "react-icons/fa"
import { BiBarcodeReader } from "react-icons/bi"
import { RiLoginBoxLine } from "react-icons/ri"
import moment from "moment-timezone"
import { ImSpinner3 } from "react-icons/im"

const getStatusMessage = (arr, str) => {
  return Array.isArray(arr) && arr.length > 0 ? arr[0].statusCode : str
}

const getRedirected = (arr) => {
  return Array.isArray(arr) && arr.length > 0
    ? arr[0].status.includes("The shipment is being brought to") ||
        arr[0].status.includes("The shipment is available for pick-up from")
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
    // case "redirect":
    case "paketshop":
      return FaDhl
    case "pre-transit":
      return GiFactory
    case "transit":
      return GiTruck
    case "failure":
      return BsFillExclamationTriangleFill
    case "return":
      return GiReturnArrow
    // case "Der Auftrag wurde eingelesen":
    // return BiBarcodeReader
    // case "Der Auftrag ist eingegangen":
    // return RiLoginBoxLine
    case "pending":
      return ImSpinner3
    case "question":
      return FaQuestion
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
      readOnly: true,
    },
    {
      name: "billbeeId",
      title: "BillBee-ID",
      type: "string",
      // validation: Rule => Rule.required(),
      readOnly: true,
    },
    {
      name: "lieferscheinId",
      title: "Nummer des Lieferscheins",
      type: "string",
      readOnly: true,
    },
    {
      name: "shippingNumbers",
      title: "Sendungsnummer (DHL)",
      type: "array",
      of: [{ type: "string" }],
      readOnly: true,
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: "date",
      title: "erstellt am",
      type: "datetime",
      readOnly: true,
      options: {
        timeStep: 1,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "duration",
      title: "Dauer (in Stunden)",
      description:
        "von Beginn bis Ende der Lieferung (bei ausgelieferten Bestellungen), seit der letzten DHL-Statusmeldung (bei nicht ausgelieferten Bestellungen), seit Erstellung der Lieferung",
      type: "number",
      readOnly: true,
    },
    {
      name: "targetWeightKg",
      title: "Sollgewicht in Kilogramm",
      type: "number",
      readOnly: true,
      validation: (Rule) => Rule.required().positive(),
    },
    {
      name: "realWeightKg",
      title: "Gewicht in Kilogramm (entsprechend Paketwaage)",
      type: "number",
      readOnly: true,
    },
    {
      name: "products",
      title: "Produkte",
      type: "array",
      of: [{ type: "product" }],
      readOnly: true,
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: "zipCode",
      title: "Postleitzahl des Empfängers",
      type: "string",
      readOnly: true,
      validation: (Rule) =>
        Rule.custom((zip) => {
          if (/^[ ]*[0-9]{4,5}[ ]*$/.test(zip)) {
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
      readOnly: true,
    },
    {
      name: "delivered",
      title: "ausgeliefert?",
      type: "boolean",
    },
    {
      name: "finalState",
      title: "Status der Sendung",
      description: "für eine bessere Zuordnung der Pakete",
      type: "string",
      readOnly: true,
      options: {
        list: [
          {
            title: "an Empfänger zugestellt",
            value: "delivered",
          },
          {
            title: "an Packstation zugestellt",
            value: "packstation",
          },
          {
            title: "in Paketshop eingeliefert",
            value: "paketshop",
          },
          {
            title: "Zustellung läuft",
            value: "transit",
          },
          {
            title: "Daten an DHL übermittelt",
            value: "pre-transit",
          },
          {
            title: "Auftrag eingegangen/eingelesen",
            value: "pending",
          },
          {
            title: "zurück an Absender",
            value: "return",
          },
          {
            title: "Fehler",
            value: "failure",
          },
          {
            title: "unbekannt",
            value: "unknown",
          },
        ],
        layout: "dropdown",
      },
    },
    {
      name: "dhlEvents",
      title: "Statusmeldungen von DHL",
      type: "array",
      readOnly: true,
      options: {
        editModal: "popover",
      },
      of: [{ type: "dhlEvent" }],
    },
    {
      name: "name",
      title: "Name des Empfängers",
      description: "für den Empfang von E-Mails",
      type: "string",
      readOnly: true,
    },
    {
      name: "email",
      title: "E-Mail-Adresse des Empfängers",
      type: "string",
      readOnly: true,
    },
    {
      name: "paymentMethod",
      title: "Zahlart",
      type: "string",
      readOnly: true,
      options: {
        list: [
          { value: 1, title: "Banküberweisung" },
          { value: 3, title: "PayPal" },
          { value: 6, title: "Gutschein" },
          { value: 22, title: "Andere" },
          { value: 25, title: "Klarna (Rechnung)" },
          { value: 26, title: "Rechnung" },
          { value: 31, title: "Kreditkarte" },
          { value: 39, title: "Klarna (Ratenzahlung)" },
          { value: 59, title: "Vorkasse" },
          { value: 61, title: "Amazon Marketplace" },
          { value: 79, title: "PayPal Express" },
          { value: 98, title: "Klarna" },
          { value: 104, title: "eBay" },
        ],
        layout: "dropdown",
      },
    },
    {
      name: "payedAt",
      title: "bezahlt am",
      type: "datetime",
      readOnly: true,
      options: {
        timeStep: 1,
      },
    },
    {
      name: "reminderPayment",
      title: "Zahlungserinnerung verschickt",
      type: "boolean",
      readOnly: true,
    },
    {
      name: "reminderPaketshop",
      title: "Erinnerung an Abholung verschickt?",
      type: "boolean",
      readOnly: true,
    },
    {
      name: "reminderFourDays",
      title: "Erinnerung nach vier Tagen im Paketshop verschickt?",
      type: "boolean",
      readOnly: true,
    },
    {
      name: "firstReminder",
      title: "erste Erinnerung (Asana) verschickt?",
      type: "boolean",
      readOnly: true,
    },
    {
      name: "secondReminder",
      title: "zweite Erinnerung (Asana) verschickt?",
      type: "boolean",
      readOnly: true,
    },
  ],
  preview: {
    select: {
      dhlEvents: "dhlEvents",
      delivered: "delivered",
      orderNumber: "orderNumber",
      status: "status",
      date: "date",
      finalState: "finalState",
    },
    prepare({ dhlEvents, delivered, orderNumber, status, date, finalState }) {
      const icon = getIcon(finalState)
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

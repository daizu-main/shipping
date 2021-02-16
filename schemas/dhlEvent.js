import dhlPreview from "./components/dhlPreview"

export default {
  name: "dhlEvent",
  title: "Statusmeldung von DHL",
  type: "object",
  readOnly: true,
  fields: [
    {
      name: "time",
      title: "Zeitpunkt",
      type: "datetime",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    },
    {
      name: "status",
      title: "Statusmeldung",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    },
    {
      name: "statusCode",
      title: "Statuscode",
      type: "string",
      readOnly: true,
    },
  ],
  preview: {
    select: {
      time: "time",
      status: "status",
      statusCode: "statusCode",
    },
    prepare({ time, status, statusCode }) {
      return {
        time,
        status,
        statusCode,
      }
    },
    component: dhlPreview,
  },
}

import dhlPreview from "./components/dhlPreview"

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
      return {
        time,
        status,
        statusCode,
      }
    },
    component: dhlPreview,
  },
}

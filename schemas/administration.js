export default {
  name: "administration",
  title: "Administration",
  type: "object",
  fields: [
    {
      name: "title",
      title: "überschrift",
      description: "Der Wert wird nur zur Anzeige verwendet",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "useFunctions",
      title: "benutze Funktionen",
      type: "boolean",
    },
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: title,
        subtitle: "Administration",
      }
    },
  },
}

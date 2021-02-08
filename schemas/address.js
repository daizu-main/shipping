export default {
  name: "address",
  title: "Adresse",
  type: "object",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "street",
      title: "Straße",
      type: "string",
    },
    {
      name: "number",
      title: "Hausnummer",
      type: "string",
    },
    {
      name: "additionalInfo",
      title: "Adresszusatz",
      type: "string",
    },
    {
      name: "packstation",
      title: "Packstation",
      type: "string",
    },
    {
      name: "zipCode",
      title: "Postleitzahl",
      type: "string",
      validation: (Rule) =>
        Rule.custom((zip) => {
          if (/^[0-9]{4,5}$/.test(zip)) {
            return true
          } else {
            return { message: "Die Postleitzahl ist nicht gültig." }
          }
        }),
    },
    {
      name: "city",
      title: "Ort",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
  ],
}

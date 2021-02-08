export default {
  name: "product",
  title: "Produkt",
  type: "object",
  fields: [
    {
      name: "title",
      title: "Artikelbezeichnung",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "quantity",
      title: "Menge",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
    },
  ],
  preview: {
    select: {
      title: "title",
      quantity: "quantity",
    },
    prepare({ title, quantity }) {
      return {
        title: title,
        subtitle: `${quantity}x`,
      }
    },
  },
}

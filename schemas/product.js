import { GiPresent, GiTwoCoins } from "react-icons/gi"

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
      let icon = GiPresent
      if (title.includes("Rabatt")) {
        icon = GiTwoCoins
      } else {
        icon = GiPresent
      }
      return {
        title: title,
        subtitle: `${quantity}x`,
        media: icon,
      }
    },
  },
}

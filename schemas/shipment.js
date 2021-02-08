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
      name: "pickupAddress",
      title: "Adresse, an der die Sendung abgegeben wurde",
      type: "address",
    },
  ],
}

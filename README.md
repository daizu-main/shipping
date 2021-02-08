# Shipping

This repository contains a [Sanity backend](https://sanity.io) for the control
and quality management of shipments from [sleep.ink](https://sleep.ink) to the
customer.

## Data

Every shipment contains the following data:

- **orderNumber**: the order number, coming from Shopify or Amazon
- **shippingNumbers**: an array of shipping numbers, which can be used to track
  the shipment using the [DHL tracking
  page](https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html)
- **date**: the date (and time) the order was created on
- **targetWeightKg**: the targeted weight of the parcel in kilogramms, provided
  by the BillBee Orders API
- **realWeightKg**: the real weight in kilogramms when the parcel left our
  stocks
- **products**: a list of products in the parcel, given for the check of
  plausibility
  - **title**: the name of the product
  - **quantity**: the quantity how often this product is included in the
    shipment
- **zipCode**: the postal code of the customer (shipping address)
- **status**: the last status message BillBee provided for this shipment
- **delivered**: a toggle to show if the parcel has arrived at the customer
- **pickupAddress**: the name and address of the person who received the parcel
  on behalf of the customer
  - **name**: full name of the person or name of the shop
  - **street**: the street
  - **number**: the house number
  - **additionalInfo**: additional address information to find the location,
    e.g. a floor or which entrance
  - **packstation**: the number of a DHL packstation where the parcel is stored
  - **zipCode**: the postal code
  - **city**: the city

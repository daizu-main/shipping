import S from "@sanity/desk-tool/structure-builder"
import {
  GiTruck,
  GiCheckMark,
  GiSandsOfTime,
  GiMailbox,
  GiReturnArrow,
  GiFactory,
} from "react-icons/gi"
import { BsFillExclamationTriangleFill } from "react-icons/bs"
import { ImSpinner3 } from "react-icons/im"
import { FaDhl, FaQuestion } from "react-icons/fa"
import { RiAdminFill, RiRoadMapFill } from "react-icons/ri"

export default () =>
  S.list()
    .title("Inhalt")
    .items([
      S.listItem()
        .title("Lieferungen")
        .icon(GiTruck)
        .child(
          S.list("Lieferungen")
            .title("Lieferungen")
            .id("shipments")
            .items([
              S.listItem()
                .id("all-shipments")
                .title("Alle Lieferungen")
                .icon(GiTruck)
                .child(S.documentTypeList("shipment")),
              S.listItem()
                .id("delivered")
                .title("Zugestellte Lieferungen")
                .icon(GiCheckMark)
                .child(
                  S.documentList("shipment")
                    .title("Zugestellt")
                    .filter("_type == $type && finalState == $finalState")
                    .params({ type: "shipment", finalState: "delivered" })
                    .menuItems([
                      ...S.documentTypeList("shipment").getMenuItems(),
                      S.orderingMenuItem({
                        title: "Date",
                        by: [{ field: "date", direction: "desc" }],
                      }),
                    ])
                ),
              S.listItem()
                .id("packstation")
                .title("Lieferung an Packstation")
                .icon(GiMailbox)
                .child(
                  S.documentList("shipment")
                    .title("Packstation")
                    .filter("_type == $type && finalState == $finalState")
                    .params({
                      type: "shipment",
                      finalState: "packstation",
                    })
                    .menuItems([
                      ...S.documentTypeList("shipment").getMenuItems(),
                      S.orderingMenuItem({
                        title: "Date",
                        by: [{ field: "date", direction: "desc" }],
                      }),
                    ])
                ),
              S.listItem()
                .id("redirect")
                .title("Lieferung an Paketshop")
                .icon(FaDhl)
                .child(
                  S.documentList("shipment")
                    .title("Paketshop")
                    .filter("_type == $type && finalState == $finalState")
                    .params({
                      type: "shipment",
                      finalState: "paketshop",
                    })
                    .menuItems([
                      ...S.documentTypeList("shipment").getMenuItems(),
                      S.orderingMenuItem({
                        title: "Date",
                        by: [{ field: "date", direction: "desc" }],
                      }),
                    ])
                ),
              S.listItem()
                .id("transit")
                .title("Zustellung läuft")
                .icon(GiTruck)
                .child(
                  S.documentList("shipment")
                    .title("Zustellung läuft")
                    .filter("_type == $type && finalState == $finalState")
                    .params({
                      type: "shipment",
                      finalState: "transit",
                    })
                    .menuItems([
                      ...S.documentTypeList("shipment").getMenuItems(),
                      S.orderingMenuItem({
                        title: "Date",
                        by: [{ field: "date", direction: "desc" }],
                      }),
                    ])
                ),
              S.listItem()
                .id("pre-transit")
                .title("Daten an DHL übermittelt")
                .icon(GiFactory)
                .child(
                  S.documentList("shipment")
                    .title("Daten an DHL übermittelt")
                    .filter("_type == $type && finalState == $finalState")
                    .params({
                      type: "shipment",
                      finalState: "pre-transit",
                    })
                    .menuItems([
                      ...S.documentTypeList("shipment").getMenuItems(),
                      S.orderingMenuItem({
                        title: "Date",
                        by: [{ field: "date", direction: "desc" }],
                      }),
                    ])
                ),
              S.listItem()
                .id("pending")
                .title("Wartende Lieferungen")
                .icon(ImSpinner3)
                .child(
                  S.documentList("shipment")
                    .title("Wartend")
                    .filter("_type == $type && finalState == $finalState")
                    .params({ type: "shipment", finalState: "pending" })
                    .menuItems([
                      ...S.documentTypeList("shipment").getMenuItems(),
                      S.orderingMenuItem({
                        title: "Date",
                        by: [{ field: "date", direction: "desc" }],
                      }),
                    ])
                ),
              S.listItem()
                .id("return")
                .title("zurück an Absender")
                .icon(GiReturnArrow)
                .child(
                  S.documentList("shipment")
                    .title("zurück an Absender")
                    .filter("_type == $type && finalState == $finalState")
                    .params({ type: "shipment", finalState: "return" })
                    .menuItems([
                      ...S.documentTypeList("shipment").getMenuItems(),
                      S.orderingMenuItem({
                        title: "Date",
                        by: [{ field: "date", direction: "desc" }],
                      }),
                    ])
                ),
              S.listItem()
                .id("failure")
                .title("Fehler bei der Lieferung")
                .icon(BsFillExclamationTriangleFill)
                .child(
                  S.documentList("shipment")
                    .title("Fehler")
                    .filter("_type == $type && finalState == $finalState")
                    .params({
                      type: "shipment",
                      finalState: "failure",
                    })
                    .menuItems([
                      ...S.documentTypeList("shipment").getMenuItems(),
                      S.orderingMenuItem({
                        title: "Date",
                        by: [{ field: "date", direction: "desc" }],
                      }),
                    ])
                ),
              S.listItem()
                .id("unknown")
                .title("unbekannter Sendungsstatus")
                .icon(FaQuestion)
                .child(
                  S.documentList("shipment")
                    .title("Status unbekannt")
                    .filter("_type == $type && finalState == $finalState")
                    .params({ type: "shipment", finalState: "unknown" })
                    .menuItems([
                      ...S.documentTypeList("shipment").getMenuItems(),
                      S.orderingMenuItem({
                        title: "Date",
                        by: [{ field: "date", direction: "desc" }],
                      }),
                    ])
                ),
            ])
        ),
    ])

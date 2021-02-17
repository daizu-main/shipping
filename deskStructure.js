import S from "@sanity/desk-tool/structure-builder"
import { GiTruck, GiCheckMark, GiSandsOfTime, GiMailbox } from "react-icons/gi"
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
                    .filter("_type == $type && delivered == $delivered")
                    .params({ type: "shipment", delivered: true })
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
                    .filter(
                      "_type == $type && !delivered && count(dhlEvents) > $length && dhlEvents[0].status match $status"
                    )
                    .params({
                      type: "shipment",
                      length: 0,
                      status: "The shipment is ready for pick-up at the*",
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
                    .filter(
                      "_type == $type && !delivered && count(dhlEvents) > $length && dhlEvents[0].status match $status"
                    )
                    .params({
                      type: "shipment",
                      length: 0,
                      status: "The shipment is being brought to*",
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
                .id("running")
                .title("Laufende Lieferungen")
                .icon(GiSandsOfTime)
                .child(
                  S.documentList("shipment")
                    .title("Laufend")
                    .filter(
                      "_type == $type && !delivered && count(dhlEvents) > $length && !(dhlEvents[0].statusCode in $status) && !(dhlEvents[0].status match $packstation) && !(dhlEvents[0].status match $paketshop)"
                    )
                    .params({
                      type: "shipment",
                      length: 0,
                      status: ["failure", "unknown"],
                      packstation: "The shipment is ready for pick-up at the*",
                      paketshop: "The shipment is being brought to*",
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
                    .filter("_type == $type && !defined(dhlEvents)")
                    .params({ type: "shipment" })
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
                    .filter(
                      "_type == $type && !delivered && count(dhlEvents) > $length && dhlEvents[0].statusCode == $status"
                    )
                    .params({ type: "shipment", length: 0, status: "failure" })
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
                    .filter(
                      "_type == $type && !delivered && count(dhlEvents) > $length && dhlEvents[0].statusCode == $status"
                    )
                    .params({ type: "shipment", length: 0, status: "unknown" })
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
      S.listItem()
        .title("Administration")
        .icon(RiAdminFill)
        .child(S.documentTypeList("administration").title("Administration")),
    ])

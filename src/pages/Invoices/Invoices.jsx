import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

// dto
import { Invoice } from "../../models/Invoice";
import { Customer } from "../../models/Customer";
import { Currency } from "../../models/Currency";
import { Reservation, ReservationStatus } from "../../models/Reservation";
import { PaymentMethod } from "../../models/PaymentMethod";

// utils
import { extractKeysFromObject } from "../../utils/parser";

// components
import Table from "../../components/Table/Table";
import Loading from "../../partials/loading/Loading";

const invoiceQuery = [
  {
    id: 1,
    dateOfCreation: Date.now(),
    lastUpdate: Date.now(),
    deleted: false,
    reservation: new Reservation(
      1,
      new Customer(1, "John Doe"),
      [],
      Date.now(),
      Date.now(),
      ReservationStatus.confirmed,
      "AOAE100",
    ),
    customer: new Customer(1, "John Doe"),
    currency: new Currency(1, "USD"),
    dateIssued: Date.now(),
    totalAmount: 100,
    paymentMethod: new PaymentMethod(1, "Credit Card"),
  },
];

/**
 * Invoices page
 * @returns Invoices page component
 */
function Invoices() {
  const { t } = useTranslation();

  const preparedColumns = useMemo(() => {
    const keys = extractKeysFromObject(new Invoice(), [
      "id",
      "dateOfCreation",
      "lastUpdate",
      "deleted",
    ]);
    return keys.map((key) => ({ id: key, label: t(`_entities:invoice.${key}.label`), className: "" }));
  }, [t]);

  const preparedRows = useMemo(() => {
    return invoiceQuery.map((invoice) => {
      return {
        id: invoice.id,
        dateOfCreation: new Date(invoice.dateOfCreation).toLocaleDateString(),
        lastUpdate: new Date(invoice.lastUpdate).toLocaleDateString(),
        deleted: invoice.deleted ? t("_accessibility:buttons.yes") : t("_accessibility:buttons.no"),
        reservation: invoice.reservation.Ticket,
        customer: invoice.customer.Name,
        currency: invoice.currency.Name,
        dateIssued: new Date(invoice.dateIssued).toLocaleDateString(),
        totalAmount: invoice.totalAmount,
        paymentMethod: invoice.paymentMethod.Name,
      };
    });
  }, [t]);

  const loading = useMemo(() => false, []);

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-5">
        {t("_pages:management.links.invoices")}
      </h1>
      {loading ? <Loading /> : <Table rows={preparedRows} columns={preparedColumns} />}
    </div>
  );
}

export default Invoices;

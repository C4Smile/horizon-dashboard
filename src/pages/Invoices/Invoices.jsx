import React, { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// icons
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";

// dto
import { Invoice } from "../../models/invoice/Invoice";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { useMuseumApiClient, queryClient } from "../../providers/MuseumApiProvider";

// utils
import { ReactQueryKeys } from "../../utils/queryKeys";
import { extractKeysFromObject } from "../../utils/parser";

// components
import Table from "../../components/Table/Table";

/**
 * Invoices page
 * @returns Invoices page component
 */
function Invoices() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { setNotification } = useNotification();
  const museumApiClient = useMuseumApiClient();

  const preparedColumns = useMemo(() => {
    const keys = extractKeysFromObject(new Invoice(), [
      "id",
      "dateOfCreation",
      "lastUpdate",
      "deleted",
    ]);
    return keys.map((key) => ({ id: key, label: t(`_entities:invoice.${key}.label`), className: "" }));
  }, [t]);

  const invoiceQuery = useQuery({
    queryKey: [ReactQueryKeys.Invoices],
    queryFn: () => museumApiClient.Invoice.getAll(),
    retry: false,
  });

  const [localData, setLocalData] = useState([]);

  const preparedRows = useMemo(() => {
    return localData.map((invoice) => {
      return {
        id: invoice.id,
        ticket: (
          <Link className="underline text-light-primary" to={`${invoice.id}`}>
            {invoice.ticket}
          </Link>
        ),
        dateOfCreation: new Date(invoice.dateOfCreation).toLocaleDateString(),
        lastUpdate: new Date(invoice.lastUpdate).toLocaleDateString(),
        deleted: invoice.deleted ? t("_accessibility:buttons.yes") : t("_accessibility:buttons.no"),
        reservation: (
          <Link className="underline text-light-primary" to={`${invoice.reservation.id}`}>
            {invoice.reservation.ticket}
          </Link>
        ),
        customer: (
          <Link className="underline text-light-primary" to={`${invoice.customer.id}`}>
            {invoice.customer.name}
          </Link>
        ),
        currency: (
          <Link className="underline text-light-primary" to={`${invoice.currency.id}`}>
            {invoice.currency.name}
          </Link>
        ),
        dateIssued: new Date(invoice.dateIssued).toLocaleDateString(),
        totalAmount: invoice.totalAmount,
        paymentMethod: (
          <Link className="underline text-light-primary" to={`${invoice.paymentMethod.id}`}>
            {invoice.paymentMethod.name}
          </Link>
        ),
      };
    });
  }, [localData, t]);

  useEffect(() => {
    const { data } = invoiceQuery;
    if (data) {
      if (data.length === undefined && data?.statusCode !== 200) {
        // eslint-disable-next-line no-console
        console.error(data.message);
        if (data.statusCode) setNotification(String(data.statusCode));
      } else setLocalData(data ?? []);
    }
  }, [invoiceQuery, navigate, setNotification]);

  const getActions = [
    {
      id: "edit",
      onClick: (e) => navigate(`/management/invoices/${e.id}`),
      icon: faPencil,
      tooltip: t("_accessibility:buttons.edit"),
    },
    {
      id: "delete",
      onClick: async (e) => {
        const result = await museumApiClient.Invoice.delete([e.id]);
        const { error, status } = result;
        setNotification(String(status), { model: t("_entities:entities.invoice") });

        if (status !== 204) {
          // eslint-disable-next-line no-console
          console.error(error);
          setNotification(String(status));
        } else queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Invoices] });
      },
      icon: faTrash,
      tooltip: t("_accessibility:buttons.delete"),
    },
  ];

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-5">
        {t("_pages:management.links.invoices")}
      </h1>
      <Table
        isLoading={invoiceQuery.isLoading}
        rows={preparedRows}
        columns={preparedColumns}
        actions={getActions}
      />
    </div>
  );
}

export default Invoices;

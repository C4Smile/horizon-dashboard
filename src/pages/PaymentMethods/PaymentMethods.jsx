import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";

// icons
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";

// dto
import { PaymentMethod } from "../../models/paymentMethod/PaymentMethod";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { useMuseumApiClient, queryClient } from "../../providers/MuseumApiProvider";

// components
import Table from "../../components/Table/Table";

/**
 * PaymentMethod page
 * @returns PaymentMethod page component
 */
function PaymentMethods() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { setNotification } = useNotification();
  const museumApiClient = useMuseumApiClient();

  const preparedColumns = useMemo(() => {
    const keys = extractKeysFromObject(new PaymentMethod(), [
      "id",
      "dateOfCreation",
      "lastUpdate",
      "deleted",
    ]);
    return keys.map((key) => ({
      id: key,
      label: t(`_entities:paymentMethod.${key}.label`),
      className: "",
    }));
  }, [t]);

  const paymentMethodQuery = useQuery({
    queryKey: [ReactQueryKeys.PaymentMethods],
    queryFn: () => museumApiClient.PaymentMethod.getAll(),
    retry: false,
  });

  const [localData, setLocalData] = useState([]);

  const preparedRows = useMemo(() => {
    return localData.map((paymentMethod) => {
      return {
        id: paymentMethod.id,
        dateOfCreation: new Date(paymentMethod.dateOfCreation).toLocaleDateString(),
        lastUpdate: new Date(paymentMethod.lastUpdate).toLocaleDateString(),
        deleted: paymentMethod.deleted
          ? t("_accessibility:buttons.yes")
          : t("_accessibility:buttons.no"),
        name: (
          <Link className="underline text-light-primary" to={`${paymentMethod.id}`}>
            {paymentMethod.name}
          </Link>
        ),
        iso: paymentMethod.iso,
      };
    });
  }, [localData, t]);

  useEffect(() => {
    const { data } = paymentMethodQuery;
    if (data) {
      if (data.length === undefined && data?.statusCode !== 200) {
        // eslint-disable-next-line no-console
        console.error(data.message);
        if (data.statusCode) setNotification(String(data.statusCode));
      } else setLocalData(data ?? []);
    }
  }, [paymentMethodQuery, navigate, setNotification]);

  const getActions = [
    {
      id: "edit",
      onClick: (e) => navigate(`/management/paymentMethods/${e.id}`),
      icon: faPencil,
      tooltip: t("_accessibility:buttons.edit"),
    },
    {
      id: "delete",
      onClick: async (e) => {
        const result = await museumApiClient.PaymentMethod.delete([e.id]);
        const { error, status } = result;
        setNotification(String(status), { model: t("_entities:entities.paymentMethod") });

        if (status !== 204) {
          // eslint-disable-next-line no-console
          console.error(error);
          setNotification(String(status));
        } else queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.PaymentMethods] });
      },
      icon: faTrash,
      tooltip: t("_accessibility:buttons.delete"),
    },
  ];

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-5">
        {t("_pages:management.links.paymentMethods")}
      </h1>
      <Table
        isLoading={paymentMethodQuery.isLoading}
        rows={preparedRows}
        columns={preparedColumns}
        actions={getActions}
      />
    </div>
  );
}

export default PaymentMethods;

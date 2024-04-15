import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";

// icons
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";

// dto
import { Currency } from "../../models/currency/Currency";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { useMuseumApiClient, queryClient } from "../../providers/MuseumApiProvider";

// components
import Table from "../../components/Table/Table";

/**
 * Currency page
 * @returns Currency page component
 */
function Currencies() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { setNotification } = useNotification();
  const museumApiClient = useMuseumApiClient();

  const preparedColumns = useMemo(() => {
    const keys = extractKeysFromObject(new Currency(), [
      "id",
      "dateOfCreation",
      "lastUpdate",
      "deleted",
    ]);
    return keys.map((key) => ({
      id: key,
      label: t(`_entities:currency.${key}.label`),
      className: "",
    }));
  }, [t]);

  const currencyQuery = useQuery({
    queryKey: [ReactQueryKeys.Currencies],
    queryFn: () => museumApiClient.Currency.getAll(),
    retry: false,
  });

  const [localData, setLocalData] = useState([]);

  const preparedRows = useMemo(() => {
    return localData.map((currency) => {
      return {
        id: currency.id,
        dateOfCreation: new Date(currency.dateOfCreation).toLocaleDateString(),
        lastUpdate: new Date(currency.lastUpdate).toLocaleDateString(),
        deleted: currency.deleted ? t("_accessibility:buttons.yes") : t("_accessibility:buttons.no"),
        name: (
          <Link className="underline text-light-primary" to={`${currency.id}`}>
            {currency.name}
          </Link>
        ),
        reduction: currency.reduction,
      };
    });
  }, [localData, t]);

  useEffect(() => {
    const { data } = currencyQuery;
    if (data) {
      if (data.length === undefined && data?.statusCode !== 200) {
        // eslint-disable-next-line no-console
        console.error(data.message);
        if (data.statusCode) setNotification(String(data.statusCode));
      } else setLocalData(data ?? []);
    }
  }, [currencyQuery, navigate, setNotification]);

  const getActions = [
    {
      id: "edit",
      onClick: (e) => navigate(`/management/currencies/${e.id}`),
      icon: faPencil,
      tooltip: t("_accessibility:buttons.edit"),
    },
    {
      id: "delete",
      onClick: async (e) => {
        const result = await museumApiClient.Currency.delete([e.id]);
        const { error, status } = result;
        setNotification(String(status), { model: t("_entities:entities.currency") });

        if (status !== 204) {
          // eslint-disable-next-line no-console
          console.error(error);
          setNotification(String(status));
        } else queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Currencies] });
      },
      icon: faTrash,
      tooltip: t("_accessibility:buttons.delete"),
    },
  ];

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-5">
        {t("_pages:management.links.currencies")}
      </h1>
      <Table
        isLoading={currencyQuery.isLoading}
        rows={preparedRows}
        columns={preparedColumns}
        actions={getActions}
      />
    </div>
  );
}

export default Currencies;

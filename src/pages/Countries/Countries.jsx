import { useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";

// icons
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";

// dto
import { Country } from "../../models/Country";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { useMuseumApiClient, queryClient } from "../../providers/MuseumApiProvider";

// components
import Table from "../../components/Table/Table";

/**
 * Country page
 * @returns Country page component
 */
function Countries() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { setNotification } = useNotification();
  const museumApiClient = useMuseumApiClient();

  const preparedColumns = useMemo(() => {
    const keys = extractKeysFromObject(new Country(), [
      "id",
      "dateOfCreation",
      "lastUpdate",
      "deleted",
    ]);
    return keys.map((key) => ({
      id: key,
      label: t(`_entities:country.${key}.label`),
      className: "",
    }));
  }, [t]);

  const countryQuery = useQuery({
    queryKey: [ReactQueryKeys.Countries],
    queryFn: () => museumApiClient.country.getAll(),
  });

  const preparedRows = useMemo(() => {
    if (countryQuery.data) {
      const { data } = countryQuery.data;
      if (data && data !== null)
        return data.map((country) => {
          return {
            id: country.id,
            dateOfCreation: new Date(country.dateOfCreation).toLocaleDateString(),
            lastUpdate: new Date(country.lastUpdate).toLocaleDateString(),
            deleted: country.deleted ? t("_accessibility:buttons.yes") : t("_accessibility:buttons.no"),
            name: (
              <Link className="underline text-light-primary" to={`${country.id}`}>
                {country.name}
              </Link>
            ),
            iso: country.iso,
          };
        });
    }
  }, [countryQuery, t]);

  useEffect(() => {
    const { error } = countryQuery;
    // eslint-disable-next-line no-console
    if (error && error !== null) console.error(countryQuery.error);
  }, [countryQuery]);

  const getActions = [
    {
      id: "edit",
      onClick: (e) => navigate(`/management/countries/${e.id}`),
      icon: faPencil,
      tooltip: t("_accessibility:buttons.edit"),
    },
    {
      id: "delete",
      onClick: (e) => {
        const { error, status } = museumApiClient.Customer.delete([e.id]);
        setNotification(String(status));

        // eslint-disable-next-line no-console
        if (error && error !== null) console.error(error);
        else queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Customers] });
      },
      icon: faTrash,
      tooltip: t("_accessibility:buttons.delete"),
    },
  ];

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-5">
        {t("_pages:management.links.countries")}
      </h1>
      <Table
        isLoading={countryQuery.isLoading}
        rows={preparedRows}
        columns={preparedColumns}
        actions={getActions}
      />
    </div>
  );
}

export default Countries;

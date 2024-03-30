import { useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";

// icons
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";

// dto
import { Province } from "../../models/Province";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { useMuseumApiClient, queryClient } from "../../providers/MuseumApiProvider";

// components
import Table from "../../components/Table/Table";

/**
 * Province page
 * @returns Province page component
 */
function Provinces() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { setNotification } = useNotification();
  const museumApiClient = useMuseumApiClient();

  const preparedColumns = useMemo(() => {
    const keys = extractKeysFromObject(new Province(), [
      "id",
      "dateOfCreation",
      "lastUpdate",
      "deleted",
    ]);
    return keys.map((key) => ({
      id: key,
      label: t(`_entities:province.${key}.label`),
      className: "",
    }));
  }, [t]);

  const provinceQuery = useQuery({
    queryKey: [ReactQueryKeys.Provinces],
    queryFn: () => museumApiClient.province.getAll(),
  });

  const preparedRows = useMemo(() => {
    if (provinceQuery.data) {
      const { data } = provinceQuery.data;
      if (data && data !== null)
        return data.map((province) => {
          return {
            id: province.id,
            dateOfCreation: new Date(province.dateOfCreation).toLocaleDateString(),
            lastUpdate: new Date(province.lastUpdate).toLocaleDateString(),
            deleted: province.deleted
              ? t("_accessibility:buttons.yes")
              : t("_accessibility:buttons.no"),
            name: (
              <Link className="underline text-light-primary" to={`${province.id}`}>
                {province.name}
              </Link>
            ),
            country: province.country?.name,
          };
        });
    }
  }, [provinceQuery, t]);

  useEffect(() => {
    const { error } = provinceQuery;
    // eslint-disable-next-line no-console
    if (error && error !== null) console.error(provinceQuery.error);
  }, [provinceQuery]);

  const getActions = [
    {
      id: "edit",
      onClick: (e) => navigate(`/management/provinces/${e.id}`),
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
        {t("_pages:management.links.provinces")}
      </h1>
      <Table
        isLoading={provinceQuery.isLoading}
        rows={preparedRows}
        columns={preparedColumns}
        actions={getActions}
      />
    </div>
  );
}

export default Provinces;

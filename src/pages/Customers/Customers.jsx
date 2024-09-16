import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

// icons
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";

// dto
import { Customer } from "../../models/customer/Customer";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { useMuseumApiClient, queryClient } from "../../providers/MuseumApiProvider";

// components
import Table from "../../components/Table/Table";

/**
 * Customers page
 * @returns Customers page component
 */
function Customers() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { setNotification } = useNotification();
  const museumApiClient = useMuseumApiClient();

  const preparedColumns = useMemo(() => {
    const keys = extractKeysFromObject(new Customer(), [
      "id",
      "dateOfCreation",
      "lastUpdate",
      "deleted",
    ]);
    return keys.map((key) => ({ id: key, label: t(`_entities:customer.${key}.label`), className: "" }));
  }, [t]);

  const customerQuery = useQuery({
    queryKey: [ReactQueryKeys.Customers],
    queryFn: () => museumApiClient.Customer.getAll(),
  });

  const [localData, setLocalData] = useState([]);

  const preparedRows = useMemo(() => {
    return localData.map((customer) => {
      return {
        id: customer.id,
        dateOfCreation: new Date(customer.dateOfCreation).toLocaleDateString(),
        lastUpdate: new Date(customer.lastUpdate).toLocaleDateString(),
        deleted: customer.deleted ? t("_accessibility:buttons.yes") : t("_accessibility:buttons.no"),
        name: (
          <Link className="underline text-light-primary" to={`${customer.id}`}>
            {customer.name}
          </Link>
        ),
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        identification: customer.identification,
        country: (
          <Link
            className="underline text-light-primary"
            to={`/management/countries/${customer.countryId}`}
          >
            {customer.country?.name}
          </Link>
        ),
      };
    });
  }, [localData, t]);

  useEffect(() => {
    const { data } = customerQuery;
    if (data) {
      if (data.status && data?.status !== 200) {
        // eslint-disable-next-line no-console
        console.error(data.message);
        setNotification(String(data.status));
      } else setLocalData(data ?? []);
    }
  }, [customerQuery, navigate, setNotification]);

  const getActions = [
    {
      id: "edit",
      onClick: (e) => navigate(`/management/customers/${e.id}`),
      icon: faPencil,
      tooltip: t("_accessibility:buttons.edit"),
    },
    {
      id: "delete",
      onClick: async (e) => {
        const result = await museumApiClient.Customer.delete([e.id]);
        const { error, status } = result;
        setNotification(String(status), { model: t("_entities:entities.customer") });

        if (status !== 204) {
          // eslint-disable-next-line no-console
          console.error(error);
          setNotification(String(status));
        } else queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Customers] });
      },
      icon: faTrash,
      tooltip: t("_accessibility:buttons.delete"),
    },
  ];

  return (
    <div className="p-5 relative">
      <h1 className="text-2xl md:text-3xl text-slate-800 font-bold mb-5">
        {t("_pages:management.links.customers")}
      </h1>
      <Table
        isLoading={customerQuery.isLoading}
        rows={preparedRows}
        columns={preparedColumns}
        actions={getActions}
        parent="management"
      />
    </div>
  );
}

export default Customers;

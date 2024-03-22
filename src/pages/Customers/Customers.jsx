import { useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

// dto
import { Customer } from "../../models/Customer";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";

// providers
import { useHotelApiClient } from "../../providers/HotelApiProvider";

// components
import Table from "../../components/Table/Table";

/**
 * Customers page
 * @returns Customers page component
 */
function Customers() {
  const { t } = useTranslation();

  const hotelApiClient = useHotelApiClient();

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
    queryFn: () => hotelApiClient.Customer.getAll(),
  });

  const preparedRows = useMemo(() => {
    if (customerQuery.data) {
      const { data } = customerQuery.data;
      if (data && data !== null)
        return data.map((customer) => {
          return {
            id: customer.id,
            dateOfCreation: new Date(customer.dateOfCreation).toLocaleDateString(),
            lastUpdate: new Date(customer.lastUpdate).toLocaleDateString(),
            deleted: customer.deleted
              ? t("_accessibility:buttons.yes")
              : t("_accessibility:buttons.no"),
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            identification: customer.identification,
            country: customer.country.Name,
          };
        });
    }
  }, [t, customerQuery]);

  useEffect(() => {
    const { error } = customerQuery;
    // eslint-disable-next-line no-console
    if (error && error !== null) console.error(customerQuery.error);
  }, [customerQuery]);

  return (
    <div className="p-5 relative">
      <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-5">
        {t("_pages:management.links.customers")}
      </h1>
      <Table isLoading={customerQuery.isLoading} rows={preparedRows} columns={preparedColumns} />
    </div>
  );
}

export default Customers;

import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

// dto
import { User } from "../../models/User";

// utils
import { extractKeysFromObject } from "../../utils/parser";

// components
import Loading from "../../partials/loading/Loading";
import Table from "../../components/Table/Table";

const usersQuery = [
  {
    id: 1,
    dateOfCreation: Date.now(),
    lastUpdate: Date.now(),
    deleted: true,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    username: "johndoe",
  },
  {
    id: 2,
    dateOfCreation: Date.now(),
    lastUpdate: Date.now(),
    deleted: false,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+9876543210",
    username: "janesmith",
  },
];

/**
 * Users page
 * @returns Users page component
 */
function Users() {
  const { t } = useTranslation();

  const preparedColumns = useMemo(() => {
    const keys = extractKeysFromObject(new User(), [
      "id",
      "dateOfCreation",
      "lastUpdate",
      "deleted",
      "password",
    ]);
    return keys.map((key) => ({ id: key, label: t(`_entities:user.${key}.label`), className: "" }));
  }, [t]);

  const preparedRows = useMemo(() => {
    return usersQuery.map((user) => {
      return {
        id: user.id,
        dateOfCreation: new Date(user.dateOfCreation).toLocaleDateString(),
        lastUpdate: new Date(user.lastUpdate).toLocaleDateString(),
        deleted: user.deleted ? t("_accessibility:buttons.yes") : t("_accessibility:buttons.no"),
        name: user.name,
        email: user.email,
        phone: user.phone,
        username: user.username,
      };
    });
  }, [t]);

  const loading = useMemo(() => false, []);

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-5">
        {t("_pages:personal.links.users")}
      </h1>
      {loading ? <Loading /> : <Table rows={preparedRows} columns={preparedColumns} />}
    </div>
  );
}

export default Users;

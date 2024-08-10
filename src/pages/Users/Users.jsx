import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// dto
import { User } from "../../models/user/User";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";
import { SortOrder } from "../../models/query/GenericFilter";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { useMuseumApiClient } from "../../providers/MuseumApiProvider";

// components
import Table from "../../components/Table/Table";

/**
 * Users page
 * @returns Users page component
 */
function Users() {
  const { t } = useTranslation();

  const { setNotification } = useNotification();
  const museumApiClient = useMuseumApiClient();

  const preparedColumns = useMemo(() => {
    const keys = extractKeysFromObject(new User(), ["dateOfCreation", "lastUpdate", "password"]);
    return keys.map((key) => ({ id: key, label: t(`_entities:user.${key}.label`), className: "" }));
  }, [t]);

  const [sort, setSort] = useState({
    attribute: "lastUpdate",
    order: SortOrder.ASC,
  });

  const onTableSort = (attribute, order) => setSort({ attribute, order });

  const userQuery = useQuery({
    queryKey: [
      ReactQueryKeys.Users,
      {
        ...sort,
      },
    ],
    queryFn: () => museumApiClient.User.getAll(sort.attribute, sort.order),
  });

  const preparedRows = useMemo(() => {
    if (userQuery.data) {
      const { data } = userQuery.data;
      if (data && data !== null)
        return data.map((user) => {
          return {
            ...user,
            username: (
              <Link className="underline text-light-primary" to={`${user.id}`}>
                {user.username}
              </Link>
            ),
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            identification: user.identification,
          };
        });
    }
  }, [userQuery]);

  useEffect(() => {
    const { data } = userQuery;
    if (data) {
      if (data.status && data?.status !== 200) {
        // eslint-disable-next-line no-console
        console.error(data.message);
        setNotification(String(data.status));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userQuery.data, setNotification]);

  const getActions = [];

  return (
    <div className="p-5 relative">
      <h1 className="text-2xl md:text-3xl font-bold mb-5">{t("_pages:personal.links.users")}</h1>
      <Table
        isLoading={userQuery.isLoading}
        rows={preparedRows}
        apiClient={museumApiClient.User}
        columns={preparedColumns}
        actions={getActions}
        onSort={onTableSort}
        queryKey={ReactQueryKeys.Users}
        parent="personal"
      />
    </div>
  );
}

export default Users;

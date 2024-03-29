import { useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

// icons
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";

// dto
import { User } from "../../models/User";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { useMuseumApiClient, queryClient } from "../../providers/MuseumApiProvider";

// components
import Table from "../../components/Table/Table";

/**
 * Users page
 * @returns Users page component
 */
function Users() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { setNotification } = useNotification();
  const museumApiClient = useMuseumApiClient();

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

  const userQuery = useQuery({
    queryKey: [ReactQueryKeys.Users],
    queryFn: () => museumApiClient.User.getAll(),
  });

  const preparedRows = useMemo(() => {
    if (userQuery.data) {
      const { data } = userQuery.data;
      if (data && data !== null)
        return data.map((user) => {
          return {
            id: user.id,
            dateOfCreation: new Date(user.dateOfCreation).toLocaleDateString(),
            lastUpdate: new Date(user.lastUpdate).toLocaleDateString(),
            deleted: user.deleted ? t("_accessibility:buttons.yes") : t("_accessibility:buttons.no"),
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
  }, [t, userQuery]);

  useEffect(() => {
    const { error } = userQuery;
    // eslint-disable-next-line no-console
    if (error && error !== null) console.error(userQuery.error);
  }, [userQuery]);

  const getActions = [
    {
      id: "edit",
      onClick: (e) => navigate(`/personal/users/${e.id}`),
      icon: faPencil,
      tooltip: t("_accessibility:buttons.edit"),
    },
    {
      id: "delete",
      onClick: (e) => {
        const { error, status } = museumApiClient.User.delete([e.id]);
        setNotification(String(status));

        // eslint-disable-next-line no-console
        if (error && error !== null) console.error(error);
        else queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Users] });
      },
      icon: faTrash,
      tooltip: t("_accessibility:buttons.delete"),
    },
  ];

  return (
    <div className="p-5 relative">
      <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-5">
        {t("_pages:management.links.users")}
      </h1>
      <Table
        isLoading={userQuery.isLoading}
        rows={preparedRows}
        columns={preparedColumns}
        actions={getActions}
      />
    </div>
  );
}

export default Users;

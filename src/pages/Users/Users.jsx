import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// dto
import { User } from "../../models/user/User";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";

// providers
import { useTableOptions } from "../../components/Table/hooks/TableOptionsProvider";
import { useMuseumApiClient } from "../../providers/MuseumApiProvider";

// components
import Table from "../../components/Table/Table";

// hooks
import { useActions } from "../../components/Table/hooks/useActions";

/**
 * Users page
 * @returns Users page component
 */
function Users() {
  const { t } = useTranslation();

  const museumApiClient = useMuseumApiClient();

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize } = useTableOptions();

  const { data, isLoading } = useQuery({
    queryKey: [ReactQueryKeys.Tags, sortingBy, sortingOrder, currentPage, pageSize],
    queryFn: () => museumApiClient.User.getAll({ sortingBy, sortingOrder, currentPage, pageSize }),
  });

  useEffect(() => {
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  const prepareRows = (user) => ({
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
  });

  const getActions = useActions({
    apiClient: museumApiClient.User,
    queryKey: ReactQueryKeys.Users,
    parent: "personal",
  });

  return (
    <div className="p-5 relative">
      <Table
        rows={data?.items}
        actions={getActions}
        isLoading={isLoading}
        parseRows={prepareRows}
        entity={User.className}
        columns={extractKeysFromObject(new User(), ["id", "password", "dateOfCreation", "lastUpdate"])}
        title={t("_pages:personal.links.users")}
      />
    </div>
  );
}

export default Users;

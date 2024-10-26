import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// @sito/dashboard
import { Table, useTableOptions } from "@sito/dashboard";

// images
import noUserPhoto from "../../assets/images/user-no-image.webp";

// dto
import { User } from "../../models/user/User";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { Parents, ReactQueryKeys } from "../../utils/queryKeys";
import { staticUrlPhoto } from "../../components/utils";

// providers
import { useHorizonApiClient } from "../../providers/HorizonApiProvider";

// hooks
import { useActions } from "../../hooks/useActions";
import { useParseColumns, useParseRows } from "../../utils/parseBaseColumns";

/**
 * Users page
 * @returns Users page component
 */
function Users() {
  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize } = useTableOptions();

  const { data, isLoading } = useQuery({
    queryKey: [ReactQueryKeys.Users, sortingBy, sortingOrder, currentPage, pageSize],
    queryFn: () => horizonApiClient.User.getAll({ sortingBy, sortingOrder, currentPage, pageSize }),
  });

  useEffect(() => {
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  const prepareRows = (user) => ({
    ...user,
    imageId: user.imageId?.url ? (
      <img
        className={`w-10 h-10 rounded-full object-cover border-white border-2`}
        src={staticUrlPhoto(user.imageId.url)}
        alt={`${user.name}`}
      />
    ) : (
      <img className="w-10 h-10 rounded-full object-cover" src={noUserPhoto} alt={user.name} />
    ),
    username: (
      <Link className="underline text-light-primary" to={`${user.id}`}>
        {user.username}
      </Link>
    ),
    roleId: user.roleId?.name,
    name: <p className="whitespace-nowrap">{user.name}</p>,
    email: user.email,
    phone: user.phone,
  });

  const getActions = useActions({
    apiClient: horizonApiClient.User,
    queryKey: ReactQueryKeys.Users,
    parent: Parents.user,
  });

  const { columns } = useParseColumns(
    extractKeysFromObject(new User(), [
      "id",
      "deleted",
      "password",
      "address",
      "identification",
      "dateOfCreation",
      "lastUpdate",
    ]),
    User.className,
  );

  const { rows } = useParseRows(prepareRows);

  return (
    <Table
      rows={data?.items}
      actions={getActions}
      isLoading={isLoading}
      parseRows={rows}
      entity={User.className}
      columns={columns}
      title={t("_pages:personal.links.users")}
    />
  );
}

export default Users;

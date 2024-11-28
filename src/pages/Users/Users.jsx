import { useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// @sito/dashboard
import { Table, useTableOptions } from "@sito/dashboard";

// images
import noUserPhoto from "../../assets/images/user-no-image.webp";

// icons
import { faAdd } from "@fortawesome/free-solid-svg-icons";

// dto
import { User } from "../../models/user/User";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { Parents, ReactQueryKeys } from "../../utils/queryKeys";
import { staticUrlPhoto } from "../../components/utils";

// components
import { FloatingButton } from "../../components/FloatingButton/FloatingButton.jsx";

// providers
import { useHorizonApiClient } from "../../providers/HorizonApiProvider";

// hooks
import { useRestoreAction, useDeleteAction, useEditAction } from "../../hooks";
import { useParseColumns, useParseRows } from "../../utils/parseBaseColumns.jsx";

const columnClasses = {
  lastUpdate: "w-56",
};

const noSortableColumns = {
  image: true,
};

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
    image: user.image?.url ? (
      <img
        className={`w-10 h-10 rounded-full object-cover border-white border-2`}
        src={staticUrlPhoto(user.image.url)}
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

  //#region Actions

  const editAction = useEditAction({ entity: ReactQueryKeys.Users });

  const restoreAction = useRestoreAction({
    entity: ReactQueryKeys.Users,
    apiClient: horizonApiClient.User,
  });

  const deleteAction = useDeleteAction({
    entity: ReactQueryKeys.Users,
    apiClient: horizonApiClient.User,
  });

  const getActions = useCallback((row) => [
    editAction.action(row),
    restoreAction.action(row),
    deleteAction.action(row),
  ],[]);

  //#endregion Actions

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
    <>
      <Table
        rows={data?.items}
        actions={getActions}
        isLoading={isLoading}
        parseRows={rows}
        entity={User.className}
        columns={columns}
        title={t("_pages:players.links.users")}
      />
      <FloatingButton component="link" href="new" icon={faAdd} />
    </>
  );
}

export default Users;

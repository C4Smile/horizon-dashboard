import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// @sito/dashboard
import { Table } from "@sito/dashboard";

// images
import noUserPhoto from "../../assets/images/user-no-image.webp";

// icons
import { faAdd } from "@fortawesome/free-solid-svg-icons";

// dto
import { User } from "../../models/user/User";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";
import { staticUrlPhoto } from "../../components/utils";

// components
import { FloatingButton } from "../../components/FloatingButton/FloatingButton.jsx";

// providers
import { useHorizonApiClient } from "../../providers/HorizonApiProvider";

// hooks
import { useRestoreAction, useDeleteAction, useEditAction } from "../../hooks";
import { useParseColumns, useParseRows } from "../../utils/parseBaseColumns.jsx";
import { useHorizonQuery } from "../../hooks/query/useHorizonQuery.jsx";

/**
 * Users page
 * @returns Users page component
 */
function Users() {
  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const { data, isLoading } = useHorizonQuery({
    entity: ReactQueryKeys.Users,
    queryFn: (data) => horizonApiClient.User.getAll(data),
  });

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

  const getActions = useCallback(
    (row) => [editAction.action(row), restoreAction.action(row), deleteAction.action(row)],
    [deleteAction, editAction, restoreAction],
  );

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

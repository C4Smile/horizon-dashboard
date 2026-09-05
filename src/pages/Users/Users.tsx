import { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// @sito/dashboard-app
import { ActionType, ConfirmationDialog, FilterTypes, Table } from "@sito/dashboard-app";

// images
import noUserPhoto from "assets/images/user-no-image.webp";

// utils
import { getEnumIdValueTuple, useParseColumns } from "utils";

// components
import { TableToolbar, staticUrlPhoto } from "components";

// providers
import { useHorizonApiClient } from "providers";

// hooks
import {
  useEditAction,
  UsersQueryKeys,
  useDeleteDialog,
  useRestoreDialog,
  useUsersList,
} from "hooks";

// api
import { EntityName, Tables } from "api";

// pages
import { PageId } from "pages";

// lib
import { Roles, UserDto } from "lib";

/**
 * Users page
 * @returns Users page component
 */
function Users() {
  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const { data, isLoading, setTotal } = useUsersList();

  useEffect(() => {
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  //#region Actions

  const editAction = useEditAction({
    url: `game/${Tables.Users}`,
  });

  const restoreAction = useRestoreDialog({
    mutationFn: (data) => horizonApiClient.User.restore(data),
    ...UsersQueryKeys.all(),
  });

  const deleteAction = useDeleteDialog({
    mutationFn: (data) => horizonApiClient.User.softDelete(data),
    ...UsersQueryKeys.all(),
  });

  const getActions = useCallback(
    (row: UserDto): ActionType<UserDto>[] => [
      editAction.action(row),
      restoreAction.action(row),
      deleteAction.action(row),
    ],
    [editAction, restoreAction, deleteAction],
  );

  //#endregion Actions

  const translatedRoles = useMemo(() => {
    return getEnumIdValueTuple(Roles).map((role) => ({
      ...role,
      value: t(`_entities:roles.${role.value}`),
    }));
  }, [t]);

  const { columns } = useParseColumns<UserDto>(
    [
      {
        key: "username",
        renderBody: (_, user) => (
          <Link
            className={`underline ${user.deletedAt ? "text-white" : "text-light-primary"}`}
            to={`${user.id}`}
          >
            {user.username}
          </Link>
        ),
        filterOptions: { type: FilterTypes.text, defaultValue: "" },
      },
      {
        key: "name",
        filterOptions: { type: FilterTypes.text, defaultValue: "" },
        renderBody: (value) => <p className="whitespace-nowrap">{value}</p>,
      },
      {
        key: "email",
        filterOptions: { type: FilterTypes.text, defaultValue: "" },
      },
      {
        key: "phone",
        filterOptions: { type: FilterTypes.text, defaultValue: "" },
      },
      {
        key: "roleId",
        filterOptions: {
          type: FilterTypes.select,
          options: translatedRoles,
        },
        renderBody: (_, user) => {
          return user.role.name;
        },
      },
      {
        key: "image",
        renderBody: (_, user) =>
          user.image?.url ? (
            <img
              className={`w-10 h-10 rounded-full object-cover border-white border-2`}
              src={staticUrlPhoto(user.image.url)}
              alt={user.name}
            />
          ) : (
            <img
              className="w-10 h-10 rounded-full object-cover"
              src={noUserPhoto}
              alt={user.name}
            />
          ),
        sortable: false,
      },
    ],
    EntityName.User,
    ["dateOfCreation", "lastUpdate"],
  );

  return (
    <>
      <ConfirmationDialog {...deleteAction}>
        <p>{t("_pages:common.actions.delete.dialog.message")}</p>
      </ConfirmationDialog>
      <ConfirmationDialog {...restoreAction}>
        <p>{t("_pages:common.actions.restore.dialog.message")}</p>
      </ConfirmationDialog>
      <Table
        data={data?.items ?? []}
        actions={getActions}
        isLoading={isLoading}
        entity={EntityName.User}
        columns={columns}
        toolbar={<TableToolbar pageKey={PageId.users} />}
      />
    </>
  );
}

export default Users;

import { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// @sito/dashboard-app
import {
  ActionType,
  ConfirmationDialog,
  FilterTypes,
  Table,
} from "@sito/dashboard-app";

// images
import noUserPhoto from "assets/images/user-no-image.webp";

// utils
import { getEnumIdValueTuple, useParseColumns } from "utils";

// components
import { TableToolbar, staticUrlPhoto } from "components";

// providers
import { useHorizonApiClient } from "providers";

// hooks
import { useEditAction, useDeleteDialog, useRestoreDialog } from "hooks";
import { UsersQueryKeys, useUsersList } from "../hooks";

// api
import { EntityName } from "api";

// pages
import { PageId } from "pages";

// lib
import { Roles } from "lib";
import { UserDto } from "../lib";

/**
 * Users page
 * @returns Users page component
 */
function Users() {
  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const { data, isLoading, setTotal } = useUsersList();

  useEffect(() => {
    if (data) setTotal(data.totalElements ?? 0);
  }, [data, setTotal]);

  //#region Actions

  const editAction = useEditAction({
    pageKey: PageId.users,
  });

  const restoreAction = useRestoreDialog({
    mutationFn: (ids) => horizonApiClient.User.restore(ids),
    ...UsersQueryKeys.all(),
  });

  const deleteAction = useDeleteDialog({
    mutationFn: (ids) => horizonApiClient.User.softDelete(ids),
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
            className={`underline ${user.deletedAt ? "text-fg-muted" : "text-primary"}`}
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
        renderBody: (value: unknown) => (
          <p className="whitespace-nowrap">{String(value)}</p>
        ),
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
        renderBody: (_: unknown, user: UserDto) =>
          typeof user.roleId === "object" ? user.roleId.name : "",
      },
      {
        key: "image",
        // pos 1 puts the picture between the id and the name, the way
        // imageColumn does it for every other table
        pos: 1,
        renderBody: (_, user) => (
          <img
            className="tile w-10 h-10 object-cover"
            src={
              user.image?.url
                ? staticUrlPhoto(user.image.url, { w: 80 })
                : noUserPhoto
            }
            alt={user.name}
          />
        ),
        sortable: false,
      },
    ],
    EntityName.User,
    ["createdAt", "updatedAt"],
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

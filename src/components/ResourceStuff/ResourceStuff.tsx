import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { FormDialog, Loading, useFormDialog } from "@sito/dashboard-app";

// providers
import { useNotification, queryClient } from "providers";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

// api
import { HTTPError } from "api";

// lib
import { QueryResult } from "lib";

// components
import { ResourceForm } from "./ResourceForm";
import { ResourceRow } from "./ResourceRow";

// types
import {
  OptionResourceCommonDto,
  ResourceFormType,
  ResourceSaveDto,
  ResourceStuffPropsType,
} from "./types";

/**
 * The relation endpoints answer a bare array while the paged ones answer a
 * QueryResult, so both shapes are accepted here.
 * @param data - whatever the query returned
 * @returns the rows
 */
function toRows<TDto>(data?: QueryResult<TDto> | TDto[]): TDto[] {
  if (!data) return [];
  return Array.isArray(data) ? data : (data.items ?? []);
}

const emptyResource: ResourceFormType = {
  id: undefined,
  resourceId: "",
  base: "",
  factor: "",
};

/**
 *
 * @param {object} props component props
 * @returns ResourceStuff component
 */
export function ResourceStuff<TDto extends OptionResourceCommonDto>(
  props: ResourceStuffPropsType<TDto>,
) {
  const { t } = useTranslation();

  const { setNotification } = useNotification();

  const [saving, setSaving] = useState(false);

  const {
    id,
    label,
    inputKey,
    entity,
    entityToSave,
    queryFn,
    saveFn,
    deleteFn,
    queryKey,
    resources = [],
  } = props;

  const { data } = useQuery({
    queryKey,
    queryFn,
    enabled: !!queryFn && !!queryKey,
  });

  const lists = useMemo(() => toRows(data), [data]);

  const modelName = useMemo(
    () => t(`_entities:entities.${entityToSave}`),
    [entityToSave, t],
  );

  const notifyError = useCallback(
    (error: unknown) => {
      console.error(error);
      setNotification(String((error as HTTPError)?.status), {
        model: modelName,
      });
    },
    [modelName, setNotification],
  );

  const formDialog = useFormDialog<ResourceFormType, ResourceSaveDto>({
    mode: "state",
    title: t(`_entities:${entity}.resource.${label}`),
    defaultValues: emptyResource,
    resetOnOpen: true,
    formToDto: (values) => ({
      id: values.id,
      resourceId: Number(values.resourceId),
      base: Number(values.base),
      factor: Number(values.factor),
    }),
    onSubmit: async (dto) => {
      // the api layer throws on a failed request, it does not return an error
      await saveFn(id, dto);
      setNotification("200", { model: modelName });
      await queryClient.invalidateQueries({ queryKey });
    },
    onError: notifyError,
  });

  const { openDialog } = formDialog;

  const openResource = useCallback(
    (resourceId?: number) => {
      const selected = lists.find((res) => res.resourceId === resourceId);
      if (!selected) return openDialog();
      openDialog({
        values: {
          id: selected.id,
          resourceId: selected.resourceId,
          base: selected.base,
          factor: selected.factor,
        },
      });
    },
    [lists, openDialog],
  );

  const onDelete = useCallback(
    async (resourceId: number) => {
      setSaving(true);
      try {
        await deleteFn(id, resourceId);
        setNotification("deleted", { count: 1 });
        await queryClient.invalidateQueries({ queryKey });
      } catch (e: unknown) {
        notifyError(e);
      }
      setSaving(false);
    },
    [deleteFn, id, notifyError, queryKey, setNotification],
  );

  return (
    <div className="form mt-5 gap-5 w-full">
      <FormDialog {...formDialog}>
        <ResourceForm
          currentList={lists}
          resources={resources}
          label={t(`_entities:${entity}.resource.${label}`)}
          inputLabel={t(`_entities:base.${inputKey}.label`)}
          inputPlaceholder={t(`_entities:base.${inputKey}.placeholder`)}
          control={formDialog.control}
        />
      </FormDialog>
      {lists?.map((cost, i) => (
        <ResourceRow
          value={cost}
          disabled={saving}
          resources={resources}
          key={`${cost.resourceId}-${i}`}
          label={t(`_entities:${entity}.resource.${label}`)}
          inputLabel={t(`_entities:base.${inputKey}.label`)}
          onEdit={(resourceId) => openResource(resourceId)}
          onDelete={onDelete}
        />
      ))}

      <div className="flex gap-3 absolute bottom-6 left-6">
        <button
          disabled={saving || lists.length >= resources.length}
          onClick={() => openResource()}
          className={`${lists.length >= resources.length ? "bg-ocean/80 text-white/60" : "bg-ocean text-white"} w-10 h-10 rounded-full`}
        >
          {saving ? (
            <Loading
              className="button-loading no-bg"
              strokeWidth="4"
              loaderClass="!w-6"
              color="stroke-white"
            />
          ) : (
            <FontAwesomeIcon icon={faAdd} />
          )}
        </button>
      </div>
    </div>
  );
}

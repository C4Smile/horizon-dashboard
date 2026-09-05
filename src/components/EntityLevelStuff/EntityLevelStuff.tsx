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

// index
import {
  EntityLevelForm,
  EntityLevelRow,
  Empty,
  EntityLevelFormType,
  EntityLevelSaveDto,
  EntityLevelStuffPropsType,
  OptionReqCommonDto,
} from "./index.js";

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

/**
 *
 * @param {object} props component props
 * @returns EntityStuff component
 */
export function EntityLevelStuff<TDto extends OptionReqCommonDto>(
  props: EntityLevelStuffPropsType<TDto>,
) {
  const { t } = useTranslation();

  const { setNotification } = useNotification();

  const [saving, setSaving] = useState(false);

  const {
    id,
    inputKey,
    entity,
    entityToSave,
    queryFn,
    saveFn,
    deleteFn,
    queryKey,
    attributeId,
    entities = [],
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

  const emptyRequirement = useMemo(
    () => ({ id: undefined, level: "", [attributeId]: "" }),
    [attributeId],
  );

  const formDialog = useFormDialog<EntityLevelFormType, EntityLevelSaveDto>({
    mode: "state",
    title: t(`_entities:entities.${entity}`),
    defaultValues: emptyRequirement,
    resetOnOpen: true,
    formToDto: (values) => ({
      level: Number(values.level),
      [attributeId]: Number(values[attributeId]),
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

  const openRequirement = useCallback(
    (entityReqId?: number) => {
      const selected = lists.find(
        (res) => (res as Record<string, unknown>)[attributeId] === entityReqId,
      );
      if (!selected) return openDialog();
      openDialog({
        values: {
          id: selected.id,
          level: selected.level,
          [attributeId]: (selected as Record<string, unknown>)[
            attributeId
          ] as number,
        },
      });
    },
    [attributeId, lists, openDialog],
  );

  const onDelete = useCallback(
    async (entityReqId: number) => {
      setSaving(true);
      try {
        await deleteFn(id, entityReqId);
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
        <EntityLevelForm
          currentList={lists}
          entities={entities}
          entityLabel={entity}
          attributeId={attributeId}
          inputLabel={t(`_entities:base.${inputKey}.label`)}
          inputPlaceholder={t(`_entities:base.${inputKey}.placeholder`)}
          control={formDialog.control}
        />
      </FormDialog>
      {lists?.length ? (
        lists?.map((entityReq, i) => (
          <EntityLevelRow
            value={entityReq}
            entities={entities}
            disabled={saving}
            key={`${(entityReq as Record<string, unknown>)[attributeId] as number}-${i}`}
            inputLabel={t(`_entities:base.${inputKey}.label`)}
            inputPlaceholder={t(`_entities:base.${inputKey}.placeholder`)}
            onEdit={(entityReqId) => openRequirement(entityReqId)}
            onDelete={onDelete}
            entityLabel={entity}
            attributeId={attributeId}
          />
        ))
      ) : (
        <Empty />
      )}
      <div className="flex gap-3 absolute bottom-6 left-6">
        <button
          disabled={saving || (!!lists && lists.length >= entities.length)}
          onClick={() => openRequirement()}
          className={`${!!lists && lists.length >= entities.length ? "bg-ocean/80 text-white/60" : "bg-ocean text-white"} w-10 h-10 rounded-full`}
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

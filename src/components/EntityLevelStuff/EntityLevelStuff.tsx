import { useState, useCallback, useEffect, useReducer } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

// @sito/dashboard
import { Loading } from "@sito/dashboard";

// providers
import { useNotification, queryClient } from "providers";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

// hooks
import { useFormDialog } from "../Dialogs/useFormDialog.jsx";

// components
import FormDialog from "../Dialogs/FormDialog.jsx";

// api
import { HTTPError } from "api";

// index
import {
  EntityLevelForm,
  EntityLevelRow,
  Empty,
  EntityLevelStuffPropsType,
  OptionReqCommonDto,
} from "./index.js";
import { BaseReqDto } from "lib";

/**
 *
 * @param {object} props component props
 * @returns EntityStuff component
 */
export function EntityLevelStuff<TDto extends OptionReqCommonDto>(
  props: EntityLevelStuffPropsType<TDto>
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

  const [initial, setInitial] = useState({});
  const [lists, setLists] = useReducer((state = {}, action = {}) => {
    const { type } = action;
    switch (type) {
      case "add": {
        const { item } = action;
        return [...state, item];
      }
      case "set": {
        const { items } = action;
        return items;
      }
      case "modify": {
        const { item } = action;
        const found = state.findIndex(
          (stem) => item[attributeId] === stem[attributeId]
        );
        if (found >= 0) state[found] = item.value;
        return [...state];
      }
      case "delete": {
        const found = state.findIndex(
          (stem) => action[attributeId] === stem[attributeId]
        );
        if (found >= 0) state.splice(found, 1);
        return [...state];
      }
      default:
        return state;
    }
  }, []);

  const costQuery = useQuery({
    queryKey,
    queryFn,
    enabled: !!queryFn && !!queryKey,
  });

  useEffect(() => {
    const result = costQuery.data;
    if (result) setLists({ type: "set", items: result?.items });
  }, [costQuery.data]);

  const save = useCallback(
    async (value: BaseReqDto) => {
      setSaving(true);
      try {
        const { error, status } = await saveFn(id, value);
        setNotification(String(status), {
          model: t(`_entities:entities.${entityToSave}`),
        });

        if (error) console.error(error.message);
        else await queryClient.invalidateQueries({ queryKey });
      } catch (e: unknown) {
        console.error(e);
        setNotification(String((e as HTTPError).status), {
          model: t(`_entities:entities.${entityToSave}`),
        });
      }
      setSaving(false);
    },
    [saveFn, id, setNotification, t, entityToSave, queryKey]
  );

  const onSubmit = useCallback(
    (d) => {
      const value = { level: Number(d.level) };
      value[attributeId] = d[attributeId];
      setInitial();
      save(value);
    },
    [attributeId, save]
  );

  const formProps = useFormDialog({
    initial,
    submit: onSubmit,
  });

  const openDialog = useCallback(
    (entityReqId?: number) => {
      const selected = lists.find((res) => res[attributeId] === entityReqId);
      if (selected) setInitial(selected);
      formProps.dialogProps.open();
    },
    [attributeId, formProps.dialogProps, lists]
  );

  const onDelete = useCallback(
    async (entityReqId: number) => {
      setSaving(true);
      try {
        const { error } = await deleteFn(id, entityReqId);
        setNotification("deleted", { count: 1 });

        if (error) console.error(error.message);
        else await queryClient.invalidateQueries({ queryKey });
      } catch (e: unknown) {
        console.error(e);
        setNotification(String((e as HTTPError).status), {
          model: t(`_entities:entities.${entityToSave}`),
        });
      }

      setSaving(false);
    },
    [deleteFn, entityToSave, id, queryKey, setNotification, t]
  );

  return (
    <div className="form mt-5 gap-5 w-full">
      <FormDialog {...formProps}>
        <EntityLevelForm
          currentList={lists}
          entities={entities}
          entityLabel={entity}
          attributeId={attributeId}
          inputLabel={t(`_entities:base.${inputKey as string}.label`)}
          inputPlaceholder={t(
            `_entities:base.${inputKey as string}.placeholder`
          )}
          {...formProps}
        />
      </FormDialog>
      {lists?.length ? (
        lists?.map((entityReq, i) => (
          <EntityLevelRow
            value={entityReq}
            entities={entities}
            disabled={saving}
            key={`${entityReq[attributeId]}-${i}`}
            inputLabel={t(`_entities:base.${inputKey as string}.label`)}
            inputPlaceholder={t(
              `_entities:base.${inputKey as string}.placeholder`
            )}
            onEdit={(entityReqId) => openDialog(entityReqId)}
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
          onClick={() => openDialog()}
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

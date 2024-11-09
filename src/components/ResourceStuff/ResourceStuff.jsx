import { useMemo, useState, useCallback, useEffect, useReducer } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

// utils
import { ReactQueryKeys } from "../../utils/queryKeys";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { queryClient, useHorizonApiClient } from "../../providers/HorizonApiProvider";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

// hooks
import { useFormDialog } from "../Dialogs/useFormDialog";

// partials
import Loading from "../../partials/loading/Loading";

// components
import FormDialog from "../Dialogs/FormDialog";
import ResourceForm from "./ResourceForm";
import ResourceRow from "./ResourceRow";

/**
 *
 * @param {object} props component props
 * @returns ResourceStuff component
 */
function ResourceStuff(props) {
  const { t } = useTranslation();

  const { setNotification } = useNotification();
  const horizonApiClient = useHorizonApiClient();

  const [saving, setSaving] = useState(false);

  const { id, label, inputKey, entity, entityToSave, queryFn, saveFn, deleteFn, queryKey } = props;

  const [initial, setInitial] = useState({});
  const [lists, setLists] = useReducer((state, action) => {
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
        const found = state.findIndex((jtem) => item.value.resourceId === jtem.resourceId);
        if (found >= 0) state[found] = item.value;
        return [...state];
      }
      case "delete": {
        const { resourceId } = action;
        const found = state.findIndex((jtem) => resourceId === jtem.resourceId);
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

  const resourcesQuery = useQuery({
    queryKey: [ReactQueryKeys.Resources],
    queryFn: () => horizonApiClient.Resource.getAll(),
  });

  const resourcesList = useMemo(() => {
    try {
      return (
        resourcesQuery?.data?.items?.map((c) => ({ value: `${c.name}`, id: c.id, image: c.image })) ??
        []
      );
    } catch (err) {
      return [];
    }
  }, [resourcesQuery.data]);

  const save = useCallback(
    async (value) => {
      setSaving(true);
      try {
        const { error, status } = await saveFn(id, value);
        setNotification(String(status), { model: t(`_entities:entities.${entityToSave}`) });

        // eslint-disable-next-line no-console
        if (error && error !== null) console.error(error.message);
        else {
          queryClient.invalidateQueries({ queryKey });
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        setNotification(String(e.status), { model: t(`_entities:entities.${entityToSave}`) });
      }
      setSaving(false);
    },
    [saveFn, id, setNotification, t, entityToSave, queryKey],
  );

  const onSubmit = useCallback(
    (d) => {
      const value = { resourceId: d.resourceId, base: Number(d.base), factor: Number(d.factor) };
      setInitial();
      save(value);
    },
    [save],
  );

  const formProps = useFormDialog({
    initial,
    submit: onSubmit,
  });

  const openDialog = useCallback(
    (resourceId) => {
      const selected = lists.find((res) => res.resourceId === resourceId);
      if (selected) setInitial(selected);
      formProps.dialogProps.open();
    },
    [formProps.dialogProps, lists],
  );

  const onDelete = useCallback(
    async (resourceId) => {
      setSaving(true);
      try {
        const { error } = await deleteFn(id, resourceId);
        setNotification("deleted", { count: 1 });

        // eslint-disable-next-line no-console
        if (error && error !== null) console.error(error.message);
        else queryClient.invalidateQueries({ queryKey });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        setNotification(String(e.status), { model: t(`_entities:entities.${entityToSave}`) });
      }

      setSaving(false);
    },
    [deleteFn, entityToSave, id, queryKey, setNotification, t],
  );

  return (
    <div className="form mt-5 gap-5 w-full">
      <FormDialog {...formProps}>
        <ResourceForm
          currentList={lists}
          resources={resourcesList}
          label={`${t(`_entities:${entity}.resource.${label}`)}`}
          inputLabel={t(`_entities:base.${inputKey}.label`)}
          inputPlaceholder={t(`_entities:base.${inputKey}.placeholder`)}
          {...formProps}
        />
      </FormDialog>
      {lists?.map((cost, i) => (
        <ResourceRow
          value={cost}
          disabled={saving}
          resources={resourcesList}
          key={`${cost.resourceId}-${i}`}
          label={`${t(`_entities:${entity}.resource.${label}`)}`}
          inputLabel={t(`_entities:base.${inputKey}.label`)}
          onEdit={(resourceId) => openDialog(resourceId)}
          onDelete={onDelete}
        />
      ))}

      <div className="flex gap-3 absolute bottom-6 left-6">
        <button
          disabled={saving || lists.length >= resourcesList.length}
          onClick={() => openDialog()}
          className={`${lists.length >= resourcesList.length ? "bg-ocean/80 text-white/60" : "bg-ocean text-white"} w-10 h-10 rounded-full`}
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

export default ResourceStuff;

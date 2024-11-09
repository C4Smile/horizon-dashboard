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
import { faAdd, faSave } from "@fortawesome/free-solid-svg-icons";

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

  const [old, setOld] = useState([]);

  const [saving, setSaving] = useState(false);

  const { id, label, inputKey, entity, entityToSave, queryFn, saveFn, queryKey } = props;

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

  useEffect(() => {
    setOld(costQuery?.data?.items);
  }, [costQuery?.data?.items]);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      console.log(lists, old, id);
      const result = await saveFn(id, lists, old);

      const { error, status } = result;
      setNotification(String(status), { model: t(`_entities:entities.${entityToSave}`) });

      // eslint-disable-next-line no-console
      if (error && error !== null) console.error(error.message);
      else {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setNotification(String(e.status), { model: t(`_entities:entities.${entityToSave}`) });
    }
    setSaving(false);
  }, [saveFn, id, lists, old, setNotification, t, entityToSave, queryKey]);

  const onSubmit = useCallback(
    (d) => {
      const value = { resourceId: d.resourceId, base: Number(d.base), factor: Number(d.factor) };
      if (initial) setLists({ type: "modify", item: { value } });
      else
        setLists({
          type: "add",
          item: { value },
        });
      setInitial();
    },
    [initial],
  );

  const formProps = useFormDialog({
    initial,
    submit: onSubmit,
  });

  const openDialog = useCallback(
    (resourceId) => {
      console.log(resourceId);
      const selected = lists.find((res) => res.resourceId === resourceId);
      if (selected) setInitial(selected);
      formProps.dialogProps.open();
    },
    [formProps.dialogProps, lists],
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
          resources={resourcesList}
          key={`${cost.resourceId}-${i}`}
          label={`${t(`_entities:${entity}.resource.${label}`)}`}
          inputLabel={t(`_entities:base.${inputKey}.label`)}
          onEdit={(resourceId) => openDialog(resourceId)}
          onDelete={(resourceId) => setLists({ type: "delete", resourceId })}
        />
      ))}
      <div className="flex gap-3 absolute bottom-6 left-6">
        <button onClick={save} className={"bg-primary text-white w-10 h-10 rounded-full"}>
          {saving ? (
            <Loading
              className="button-loading"
              strokeWidth="4"
              loaderClass="!w-6"
              color="stroke-white"
            />
          ) : (
            <FontAwesomeIcon icon={faSave} />
          )}
        </button>
        <button
          disabled={saving || lists.length >= resourcesList.length}
          onClick={() => openDialog()}
          className={`${lists.length >= resourcesList.length ? "bg-ocean/80 text-white/60" : "bg-ocean text-white"} w-10 h-10 rounded-full`}
        >
          <FontAwesomeIcon icon={faAdd} />
        </button>
      </div>
    </div>
  );
}

export default ResourceStuff;

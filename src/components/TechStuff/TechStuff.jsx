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
import TechForm from "./TechForm";
import TechRow from "./TechRow";

/**
 *
 * @param {object} props component props
 * @returns TechStuff component
 */
function TechStuff(props) {
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
        const found = state.findIndex((jtem) => item.value.techReqId === jtem.techReqId);
        if (found >= 0) state[found] = item.value;
        return [...state];
      }
      case "delete": {
        const { techReqId } = action;
        const found = state.findIndex((jtem) => techReqId === jtem.techReqId);
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

  const techsQuery = useQuery({
    queryKey: [ReactQueryKeys.Techs],
    queryFn: () => horizonApiClient.Tech.getAll(),
  });

  const techsList = useMemo(() => {
    try {
      return (
        techsQuery?.data?.items?.map((c) => ({ value: `${c.name}`, id: c.id, image: c.image })) ?? []
      );
    } catch (err) {
      return [];
    }
  }, [techsQuery.data]);

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
      const value = { techReqId: d.techReqId, base: Number(d.base), factor: Number(d.factor) };
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
    (techReqId) => {
      const selected = lists.find((res) => res.techReqId === techReqId);
      if (selected) setInitial(selected);
      formProps.dialogProps.open();
    },
    [formProps.dialogProps, lists],
  );

  const onDelete = useCallback(
    async (techReqId) => {
      setSaving(true);
      try {
        const { error } = await deleteFn(id, techReqId);
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
        <TechForm
          currentList={lists}
          techs={techsList}
          label={`${t(`_entities:${entity}.tech.${label}`)}`}
          inputLabel={t(`_entities:base.${inputKey}.label`)}
          inputPlaceholder={t(`_entities:base.${inputKey}.placeholder`)}
          {...formProps}
        />
      </FormDialog>
      {lists?.map((techReq, i) => (
        <TechRow
          value={techReq}
          techs={techsList}
          disabled={saving}
          key={`${techReq.techReqId}-${i}`}
          label={`${t(`_entities:${entity}.tech.${label}`)}`}
          inputLabel={t(`_entities:base.${inputKey}.label`)}
          inputPlaceholder={t(`_entities:base.${inputKey}.placeholder`)}
          onEdit={(techReqId) => openDialog(techReqId)}
          onDelete={onDelete}
        />
      ))}
      <div className="flex gap-3 absolute bottom-6 left-6">
        <button
          disabled={saving || lists.length >= techsList.length}
          onClick={() => openDialog()}
          className={`${lists.length >= techsList.length ? "bg-ocean/80 text-white/60" : "bg-ocean text-white"} w-10 h-10 rounded-full`}
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

export default TechStuff;

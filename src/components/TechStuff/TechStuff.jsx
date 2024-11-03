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

// components
import Loading from "../../partials/loading/Loading";
import TechForm from "./TechForm";

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

  const { id, label, inputKey, entity, entityToSave, queryFn, saveFn, queryKey } = props;

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
        const found = state.findIndex((jtem) =>
          item.attribute === "tech"
            ? item.value.level === jtem.level
            : item.value.techId === jtem.techId,
        );
        if (found >= 0) state[found] = item.value;
        return [...state];
      }
      case "delete": {
        const { techId } = action;
        const found = state.findIndex((jtem) => techId === jtem.techId);
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

  const save = useCallback(async () => {
    setSaving(true);
    try {
      const result = await saveFn(id, lists);

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
  }, [lists, entityToSave, id, queryKey, saveFn, setNotification, t]);

  return (
    <div className="form mt-5 gap-5 w-full">
      {lists?.map((cost, i) => (
        <TechForm
          value={cost}
          techs={techsList}
          key={i}
          label={`${t(`_entities:${entity}.tech.${label}`)}`}
          inputLabel={t(`_entities:base.${inputKey}.label`)}
          inputPlaceholder={t(`_entities:base.${inputKey}.placeholder`)}
          onChange={(value, attribute) => setLists({ type: "modify", item: { value, attribute } })}
          onDelete={(techId) => setLists({ type: "delete", techId })}
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
          disabled={saving || lists.length >= techsList.length}
          onClick={() =>
            setLists({
              type: "add",
              item: { techId: techsList[0].id, level: 1 },
            })
          }
          className={`${lists.length >= techsList.length ? "bg-ocean/80 text-white/60" : "bg-ocean text-white"} w-10 h-10 rounded-full`}
        >
          <FontAwesomeIcon icon={faAdd} />
        </button>
      </div>
    </div>
  );
}

export default TechStuff;

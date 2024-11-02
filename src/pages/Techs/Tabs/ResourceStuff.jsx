import { useMemo, useState, useCallback, useEffect, useReducer } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

// utils
import { ReactQueryKeys } from "../../../utils/queryKeys";

// providers
import { useNotification } from "../../../providers/NotificationProvider";
import { queryClient, useHorizonApiClient } from "../../../providers/HorizonApiProvider";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faSave } from "@fortawesome/free-solid-svg-icons";

// components
import Loading from "../../../partials/loading/Loading";
import ResourceForm from "../components/ResourceForm";

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

  const { id, label, inputKey, entity, getFunction, queryKey } = props;

  const [costs, setCosts] = useReducer((state, action) => {
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
        const found = state.findIndex((jtem) => item.resourceId === jtem.resourceId);
        if (found >= 0) state[found] = item;
        return [...state];
      }
      case "delete": {
        const { item } = action;
        const found = state.findIndex((jtem) => item.resourceId === jtem.resourceId);
        if (found >= 0) state.splice(found, 1);
        return [...state];
      }
      default:
        return state;
    }
  }, []);

  const costQuery = useQuery({
    queryKey,
    queryFn: getFunction,
    enabled: !!getFunction && !!queryKey,
  });

  useEffect(() => {
    const result = costQuery.data;
    if (result) setCosts({ type: "set", items: result?.items });
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

  const save = useCallback(async () => {
    setSaving(true);
    try {
      const result = await horizonApiClient.Tech.saveCosts(id, costs);

      const { error, status } = result;
      setNotification(String(status), { model: t("_entities:entities.techCost") });

      // eslint-disable-next-line no-console
      if (error && error !== null) console.error(error.message);
      else {
        queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.TechCosts, id] });
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setNotification(String(e.status), { model: t("_entities:entities.techCost") });
    }
    setSaving(false);
  }, [costs, horizonApiClient, id, setNotification, t]);

  return (
    <div className="form mt-5 gap-5 w-full">
      {costs?.map((cost, i) => (
        <ResourceForm
          value={cost}
          resources={resourcesList}
          key={cost.resource ?? i}
          label={`${t(`_entities:${entity}.resource.${label}`)} ${i + 1}`}
          inputLabel={t(`_entities:base.${inputKey}.label`)}
          inputPlaceholder={t(`_entities:base.${inputKey}.placeholder`)}
          onChange={(value) => setCosts({ type: "modify", item: { value } })}
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
          disabled={saving || costs.length >= resourcesList.length}
          onClick={() =>
            setCosts({
              type: "add",
              item: { resourceId: resourcesList[0].id, baseCost: 1, factor: 1 },
            })
          }
          className={`${costs.length >= resourcesList.length ? "bg-ocean/80 text-white/60" : "bg-ocean text-white"} w-10 h-10 rounded-full`}
        >
          <FontAwesomeIcon icon={faAdd} />
        </button>
      </div>
    </div>
  );
}

export default ResourceStuff;

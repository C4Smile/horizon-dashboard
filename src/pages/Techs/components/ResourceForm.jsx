import { memo, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

// utils
import { staticUrlPhoto } from "../../../components/utils";

// components
import TextInput from "../../../components/Forms/TextInput";
import SelectInput from "../../../components/Forms/SelectInput";

/**
 *
 * @param {*} props - component form
 * @returns ResourceForm component
 */
const ResourceForm = memo(
  function ResourceForm(props) {
    const { t } = useTranslation();

    const { resources, value, onChange, label, inputLabel, inputPlaceholder } = props;

    const [resourceId, setResourceId] = useState(value?.resourceId);
    const [baseCost, setBaseCost] = useState(value?.baseCost);
    const [factor, setFactor] = useState(value?.factor);

    const selected = useMemo(
      () => resources.find((item) => Number(value?.resourceId) === item.id),
      [resources, value?.resourceId],
    );

    return (
      <div className="flex flex-col w-full gap-5">
        <p className="min-w-20">{label}</p>
        <div className="flex items-start justify-start w-full gap-10">
          {selected ? (
            <img
              className="w-10 h-10 rounded-full object-cover"
              src={staticUrlPhoto(selected.image.url)}
              alt={selected.value}
            />
          ) : null}
          <SelectInput
            label={t("_entities:entities.resource")}
            value={resourceId}
            options={resources}
            onChange={(e) => {
              setResourceId(e.target.value);
              onChange({ ...value, resourceId: e.target.value });
            }}
          />
          <TextInput
            value={baseCost}
            label={inputLabel}
            onChange={(e) => {
              setBaseCost(e.target.value);
              onChange({ ...value, baseCost: e.target.value });
            }}
            placeholder={inputPlaceholder}
          />
          <TextInput
            value={factor}
            label={t("_entities:base.factor.label")}
            onChange={(e) => {
              setFactor(e.target.value);
              onChange({ ...value, factor: e.target.value });
            }}
            placeholder={t("_entities:base.factor.placeholder")}
          />
        </div>
      </div>
    );
  },
  (prev, next) => {
    if (
      prev.resources !== next.resources ||
      prev.onChange !== next.onChange ||
      prev.inputLabel !== next.inputLabel ||
      prev.inputPlaceholder !== next.inputPlaceholder ||
      prev.label !== next.label
    )
      return false;

    if (
      prev.value?.resource !== next.value?.resource ||
      prev.value?.base !== next.value?.base ||
      prev.value?.factor !== next.value?.factor
    )
      return false;

    return true;
  },
);

export default ResourceForm;

import { memo, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

// utils
import { staticUrlPhoto } from "../utils";

// components
import TextInput from "../Forms/TextInput";
import SelectInput from "../Forms/SelectInput";

/**
 *
 * @param {*} props - component form
 * @returns ResourceForm component
 */
const ResourceForm = memo(
  function ResourceForm(props) {
    const { t } = useTranslation();

    const { resources, value, onChange, onDelete, label, inputLabel, inputPlaceholder } = props;

    const [resourceId, setResourceId] = useState(value?.resourceId);
    const [base, setBase] = useState(value?.base);
    const [factor, setFactor] = useState(value?.factor);

    const selected = useMemo(
      () => resources.find((item) => Number(value?.resourceId) === item.id),
      [resources, value?.resourceId],
    );

    return (
      <div className="flex flex-col w-full gap-5">
        <p className="min-w-20">
          {label} {selected?.value}
        </p>
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
              onChange({ ...value, resourceId: e.target.value }, "resource");
            }}
          />
          <TextInput
            value={base}
            label={inputLabel}
            onChange={(e) => {
              setBase(e.target.value);
              onChange({ ...value, base: e.target.value }, "base");
            }}
            placeholder={inputPlaceholder}
          />
          <TextInput
            value={factor}
            label={t("_entities:base.factor.label")}
            onChange={(e) => {
              setFactor(e.target.value);
              onChange({ ...value, factor: e.target.value }, "factor");
            }}
            placeholder={t("_entities:base.factor.placeholder")}
          />
          <button onClick={() => onDelete(resourceId)} className="">
            <FontAwesomeIcon icon={faTrash} />
          </button>
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
    ) {
      return false;
    }

    if (prev.value !== next.value) {
      return false;
    }

    return true;
  },
);

export default ResourceForm;

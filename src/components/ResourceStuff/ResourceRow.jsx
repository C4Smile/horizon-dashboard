import { memo, useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

// utils
import { staticUrlPhoto } from "../utils";

/**
 *
 * @param {*} props - component form
 * @returns ResourceRow component
 */
const ResourceRow = memo(
  function ResourceRow(props) {
    const { t } = useTranslation();

    const { disabled, resources, value, onDelete, onEdit, label, inputLabel } = props;

    const [resourceId, setResourceId] = useState(value?.resource?.id);
    const [base, setBase] = useState(value?.base);
    const [factor, setFactor] = useState(value?.factor);

    useEffect(() => {
      setResourceId(value?.resource?.id);
      setBase(value?.base);
      setFactor(value?.factor);
    }, [value]);

    const resource = useMemo(
      () => resources?.find((res) => res.id === resourceId),
      [resources, resourceId],
    );

    return (
      <div className="flex flex-col w-full gap-5">
        <p className="min-w-20">
          {label} {resource?.value}
        </p>
        <div className="flex items-start justify-start w-full gap-10">
          {resource ? (
            <img
              className="w-16 h-16 rounded-full object-cover self-center"
              src={staticUrlPhoto(resource?.image?.url)}
              alt={resource?.value}
            />
          ) : null}
          <p>
            {t("_entities:entities.resource")} <br />
            <span className="text-primary text-xl">{resource?.value}</span>
          </p>
          <p className="text-base">
            {inputLabel} <br />
            <span className="text-primary text-xl">{base}</span>
          </p>
          <p className="text-base">
            {t("_entities:base.factor.label")} <br />
            <span className="text-primary text-xl">{factor}</span>
          </p>
          <div className="flex gap-2 my-auto">
            <button
              disabled={disabled}
              onClick={() => onEdit(resourceId)}
              className="w-10 h-10 min-w-10 rounded-full bg-primary text-white self-center"
            >
              <FontAwesomeIcon icon={faPencil} />
            </button>
            <button
              disabled={disabled}
              onClick={() => onDelete(resourceId)}
              className="w-10 h-10 min-w-10 rounded-full bg-red-600 text-white self-center"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      </div>
    );
  },
  (prev, next) => {
    if (
      prev.resource !== next.resource ||
      prev.inputLabel !== next.inputLabel ||
      prev.inputPlaceholder !== next.inputPlaceholder ||
      prev.label !== next.label
    ) {
      return false;
    }

    return prev.value === next.value;
  },
);

export default ResourceRow;

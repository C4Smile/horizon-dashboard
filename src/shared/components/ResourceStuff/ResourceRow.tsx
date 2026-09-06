import { memo, useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

// utils
import { staticUrlPhoto } from "../utils";

// types
import { OptionResourceCommonDto, ResourceRowPropsType } from "./types";

/**
 *
 * @param {*} props - component form
 * @returns ResourceRow component
 */
export const ResourceRow = memo(
  function ResourceRow<TDto extends OptionResourceCommonDto>(
    props: ResourceRowPropsType<TDto>,
  ) {
    const { t } = useTranslation();

    const { disabled, resources, value, onDelete, onEdit, label, inputLabel } =
      props;

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
      <div className="flex flex-col w-full gap-2">
        <p className="min-w-20">
          {label} {resource?.value}
        </p>
        <div className="relation-row">
          {resource ? (
            <img
              className="tile w-16 h-16 object-cover"
              src={staticUrlPhoto(resource?.image?.url ?? "")}
              alt={String(resource?.value ?? "")}
            />
          ) : null}
          <p className="relation-row-cell">
            {t("_entities:entities.resource")} <br />
            <span className="text-primary text-xl">{resource?.value}</span>
          </p>
          <p className="relation-row-cell">
            {inputLabel} <br />
            <span className="text-primary text-xl">{base}</span>
          </p>
          <p className="relation-row-cell">
            {t("_entities:base.factor.label")} <br />
            <span className="text-primary text-xl">{factor}</span>
          </p>
          <div className="relation-row-actions">
            <button
              disabled={disabled}
              onClick={() => onEdit(resourceId)}
              aria-label={t("_accessibility:buttons.edit")}
              title={t("_accessibility:buttons.edit")}
              className="w-10 h-10 min-w-10 rounded-[var(--radius-control)] bg-primary text-page"
            >
              <FontAwesomeIcon icon={faPencil} />
            </button>
            <button
              disabled={disabled}
              onClick={() => onDelete(resourceId)}
              aria-label={t("_accessibility:buttons.delete")}
              title={t("_accessibility:buttons.delete")}
              className="w-10 h-10 min-w-10 rounded-[var(--radius-control)] bg-bg-error text-error"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      </div>
    );
  },
  (prev, next) => {
    if (prev.inputLabel !== next.inputLabel || prev.label !== next.label) {
      return false;
    }

    return prev.value === next.value;
  },
);

import { memo, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

// utils
import { staticUrlPhoto } from "../utils";

// types
import { EntityLevelRowPropsType, OptionReqCommonDto } from "./types";

/**
 *
 * @param props - component form
 * @returns EntityRow component
 */
export const EntityLevelRow = memo(
  function EntityRow<TDto extends OptionReqCommonDto>(
    props: EntityLevelRowPropsType<TDto>,
  ) {
    const { t } = useTranslation();

    const {
      disabled,
      entities,
      value,
      onDelete,
      onEdit,
      inputLabel,
      entityLabel,
      attributeId,
    } = props;

    const readReqId = (row?: TDto) =>
      row ? ((row as Record<string, unknown>)[attributeId] as number) : null;

    const [entityReqId, setEntityReqId] = useState(readReqId(value));
    const [level, setLevel] = useState(value?.level);

    useEffect(() => {
      if (value) setEntityReqId(readReqId(value));
      setLevel(value?.level);
    }, [attributeId, value]);

    const selected = useMemo(
      () => entities.find((item) => Number(entityReqId) === item.id),
      [entities, entityReqId],
    );

    return (
      <div className="flex flex-col w-full gap-2">
        <p className="min-w-20">
          {t("_accessibility:labels.require")} {selected?.value}
        </p>
        <div className="relation-row">
          {selected ? (
            <img
              className="tile w-16 h-16 object-cover"
              src={staticUrlPhoto(selected.image?.url ?? "")}
              alt={String(selected.value ?? "")}
            />
          ) : null}
          <p className="relation-row-cell">
            {t(`_entities:entities.${entityLabel}`)} <br />
            <span className="text-primary text-xl">{selected?.value}</span>
          </p>
          <p className="relation-row-cell">
            {inputLabel} <br />
            <span className="text-primary text-xl">{level}</span>
          </p>
          <div className="relation-row-actions">
            <button
              disabled={disabled}
              onClick={() => onEdit(entityReqId as number)}
              aria-label={t("_accessibility:buttons.edit")}
              title={t("_accessibility:buttons.edit")}
              className="w-10 h-10 min-w-10 rounded-[var(--radius-control)] bg-primary text-page"
            >
              <FontAwesomeIcon icon={faPencil} />
            </button>
            <button
              disabled={disabled}
              onClick={() => onDelete(entityReqId as number)}
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
    if (
      prev.entities !== next.entities ||
      prev.inputLabel !== next.inputLabel
    ) {
      return false;
    }

    return prev.value === next.value;
  },
);

import { memo, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

// utils
import { staticUrlPhoto } from "../utils";

/**
 *
 * @param {*} props - component form
 * @returns TechRow component
 */
const TechRow = memo(
  function TechRow(props) {
    const { t } = useTranslation();

    const { disabled, techs, value, onDelete, onEdit, label, inputLabel } = props;

    const [techReqId, setTechReqId] = useState(value?.techReqId);
    const [level, setLevel] = useState(value?.level);

    useEffect(() => {
      setTechReqId(value?.techReqId);
      setLevel(value?.level);
    }, [value]);

    const selected = useMemo(
      () => techs.find((item) => Number(value?.techReqId) === item.id),
      [techs, value?.techReqId],
    );

    return (
      <div className="flex flex-col w-full gap-5">
        <p className="min-w-20">
          {label} {selected?.value}
        </p>
        <div className="flex items-start justify-start w-full gap-10">
          {selected ? (
            <img
              className="w-16 h-16 rounded-full object-cover self-center"
              src={staticUrlPhoto(selected.image.url)}
              alt={selected.value}
            />
          ) : null}
          <p className="text-base">
            {t("_entities:entities.tech")} <br />
            <span className="text-primary text-xl">{selected?.value}</span>
          </p>
          <p className="text-base">
            {inputLabel} <br />
            <span className="text-primary text-xl">{level}</span>
          </p>
          <div className="flex gap-2 my-auto">
            <button
              disabled={disabled}
              onClick={() => onEdit(techReqId)}
              className="w-10 h-10 min-w-10 rounded-full bg-primary text-white self-center"
            >
              <FontAwesomeIcon icon={faPencil} />
            </button>
            <button
              disabled={disabled}
              onClick={() => onDelete(techReqId)}
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
      prev.techs !== next.techs ||
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

export default TechRow;

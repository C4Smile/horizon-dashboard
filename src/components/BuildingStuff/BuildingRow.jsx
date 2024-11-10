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
 * @returns BuildingRow component
 */
const BuildingRow = memo(
  function BuildingRow(props) {
    const { t } = useTranslation();

    const { disabled, buildings, value, onDelete, onEdit, label, inputLabel } = props;

    const [buildingReqId, setBuildingReqId] = useState(value?.buildingReqId);
    const [level, setLevel] = useState(value?.level);

    useEffect(() => {
      setBuildingReqId(value?.buildingReqId);
      setLevel(value?.level);
    }, [value]);

    const selected = useMemo(
      () => buildings.find((item) => Number(value?.buildingReqId) === item.id),
      [buildings, value?.buildingReqId],
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
            {t("_entities:entities.building")} <br />
            <span className="text-primary text-xl">{selected?.value}</span>
          </p>
          <p className="text-base">
            {inputLabel} <br />
            <span className="text-primary text-xl">{level}</span>
          </p>
          <div className="flex gap-2 my-auto">
            <button
              disabled={disabled}
              onClick={() => onEdit(buildingReqId)}
              className="w-10 h-10 min-w-10 rounded-full bg-primary text-white self-center"
            >
              <FontAwesomeIcon icon={faPencil} />
            </button>
            <button
              disabled={disabled}
              onClick={() => onDelete(buildingReqId)}
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
      prev.buildings !== next.buildings ||
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

export default BuildingRow;

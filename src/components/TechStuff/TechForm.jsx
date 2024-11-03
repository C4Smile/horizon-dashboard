import { memo, useEffect, useMemo, useState } from "react";
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
 * @returns TechForm component
 */
const TechForm = memo(
  function TechForm(props) {
    const { t } = useTranslation();

    const { techs, value, onChange, onDelete, label, inputLabel, inputPlaceholder } = props;

    const [techId, setTechId] = useState(value?.techId);
    const [level, setLevel] = useState(value?.level);

    useEffect(() => {
      setTechId(value?.techId);
      setLevel(value?.level);
    }, [value]);

    const selected = useMemo(
      () => techs.find((item) => Number(value?.techId) === item.id),
      [techs, value?.techId],
    );

    return (
      <div className="flex flex-col w-full gap-5">
        <p className="min-w-20">
          {label} {selected?.value}
        </p>
        <div className="flex items-start justify-start w-full gap-10">
          {selected ? (
            <img
              className="w-10 h-10 rounded-full object-cover self-center"
              src={staticUrlPhoto(selected.image.url)}
              alt={selected.value}
            />
          ) : null}
          <SelectInput
            label={t("_entities:entities.tech")}
            value={techId}
            options={techs}
            onChange={(e) => {
              setTechId(e.target.value);
              onChange({ ...value, techId: e.target.value }, "tech");
            }}
          />
          <TextInput
            value={level}
            label={inputLabel}
            onChange={(e) => {
              setLevel(e.target.value);
              onChange({ ...value, level: e.target.value }, "level");
            }}
            placeholder={inputPlaceholder}
          />
          <button onClick={() => onDelete(techId)} className="">
            <FontAwesomeIcon icon={faTrash} />
          </button>
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

export default TechForm;

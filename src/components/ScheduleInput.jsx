import React, { forwardRef, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

// components
import Chip from "./Chip/Chip";
import TextInput from "./Forms/TextInput";
import SelectInput from "./Forms/SelectInput";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ScheduleInput = forwardRef(function (props, ref) {
  const { children, value = [], onChange, label, containerClassName, onlyTime } = props;

  const { t } = useTranslation();

  // days of the week from translation
  const daysOfTheWeek = useMemo(
    () => [...Array(7).keys()].map((i) => t(`_accessibility:daysOfTheWeek.${i}`)),
    [t],
  );

  const [error, setError] = useState(false);
  const [description, setDescription] = useState("");
  const [day, setDay] = useState(0);
  const [time, setTime] = useState(
    `${new Date().toTimeString().split(" ")[0].split(":")[0]}:${new Date().toTimeString().split(" ")[0].split(":")[1]}`,
  );
  const [currentDateTime, setCurrentDateTime] = useState(new Date().toISOString().split(".")[0]);

  const add = () => {
    if (description.length) {
      const newItem = { description };
      if (onlyTime) {
        newItem.time = time;
        newItem.dayOfTheWeek = day;
      } else newItem.date = currentDateTime;
      if (value) onChange([...value, newItem]);
      else onChange([newItem]);
      setDescription("");
      setError(false);
    } else setError(true);
  };

  const onEnterDown = (e) => {
    const { key } = e;
    if (key === "Enter" || key === "Return") {
      e.preventDefault();
      if (description.length) {
        // searching for repeated
        add();
      } else {
        setError(true);
      }
    }
  };

  const onDelete = (index) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  return (
    <div className={`relative z-0 w-full mt-5 mb-10 group ${containerClassName}`}>
      <span className="">{label}</span>
      <div className="mt-5 flex gap-5 items-center justify-start">
        <button type="button" onClick={add} className="outlined">
          <FontAwesomeIcon icon={faAdd} />
        </button>
        {onlyTime ? (
          <>
            <TextInput
              value={time}
              onKeyDown={onEnterDown}
              label={t(`_entities:schedule.time.label`)}
              onChange={(e) => {
                setTime(e.target.value);
                setError(false);
              }}
              type="time"
              containerClassName="!mb-0"
              placeholder={t(`_entities:schedule.time.placeholder`)}
            />
            <SelectInput
              id="day"
              name="day"
              label={t(`_entities:schedule.day.label`)}
              options={daysOfTheWeek.map((day, i) => ({ id: i, value: day }))}
              value={day}
              onChange={(e) => {
                setDay(e.target.value);
              }}
            />
          </>
        ) : (
          <TextInput
            value={currentDateTime}
            onKeyDown={onEnterDown}
            state={error ? "error" : ""}
            label={t(`_entities:schedule.date.label`)}
            onChange={(e) => {
              setCurrentDateTime(e.target.value);
              setError(false);
            }}
            type="datetime-local"
            placeholder={t(`_entities:schedule.date.placeholder`)}
          />
        )}
        <TextInput
          value={description}
          onKeyDown={onEnterDown}
          state={error ? "error" : ""}
          label={t("_entities:schedule.description.label")}
          onChange={(e) => {
            setDescription(e.target.value);
            setError(false);
          }}
          containerClassName={`${onlyTime ? "!mb-0" : ""}`}
          placeholder={t("_entities:schedule.description.placeholder")}
          helperText={error ? t("_entities:schedule.description.notEmpty") : ""}
        />
      </div>
      <div className="flex items-center justify-start flex-wrap my-4 gap-2">
        {value?.map((schedule, i) => (
          <Chip
            key={`${schedule.description}-${schedule.date ?? schedule.time}`}
            label={`${schedule.description} - ${schedule.date ? `${new Date(schedule.date).toLocaleDateString("es-ES")} ${new Date(schedule.date).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}` : `${schedule.time?.split(":")[0]}:${schedule.time?.split(":")[1]} - ${daysOfTheWeek[schedule.dayOfTheWeek]}`}`}
            onDelete={() => onDelete(i)}
          />
        ))}
      </div>
      {children}
    </div>
  );
});

export default ScheduleInput;

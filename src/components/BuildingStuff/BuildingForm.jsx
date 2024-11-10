import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// components
import TextInput from "../Forms/TextInput";
import SelectInput from "../Forms/SelectInput";
import { Controller } from "react-hook-form";

/**
 *
 * @param {*} props - component form
 * @returns BuildingForm component
 */
const BuildingForm = function BuildingForm(props) {
  const { t } = useTranslation();

  const { currentList, buildings, label, inputLabel, inputPlaceholder, control } = props;

  const options = useMemo(
    () => buildings.filter((res) => !currentList.some((rex) => rex.resourceId === res.id)),
    [currentList, buildings],
  );

  return (
    <div className="flex flex-col w-full gap-5">
      <p className="min-w-20">{label}</p>
      <Controller
        control={control}
        name="buildingReqId"
        render={({ field: { onChange, value, ...rest } }) => (
          <SelectInput
            label={t("_entities:entities.building")}
            value={value}
            options={options}
            onChange={(e) => {
              onChange(e.target.value);
            }}
            {...rest}
          />
        )}
      />
      <Controller
        control={control}
        name="level"
        render={({ field }) => (
          <TextInput label={inputLabel} placeholder={inputPlaceholder} {...field} />
        )}
      />
    </div>
  );
};

export default BuildingForm;

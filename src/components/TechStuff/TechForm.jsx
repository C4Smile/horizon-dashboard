import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// components
import TextInput from "../Forms/TextInput";
import SelectInput from "../Forms/SelectInput";
import { Controller } from "react-hook-form";

/**
 *
 * @param {*} props - component form
 * @returns TechForm component
 */
const TechForm = function TechForm(props) {
  const { t } = useTranslation();

  const { currentList, techs, label, inputLabel, inputPlaceholder, control } = props;

  const options = useMemo(
    () => techs.filter((res) => !currentList.some((rex) => rex.resourceId === res.id)),
    [currentList, techs],
  );

  return (
    <div className="flex flex-col w-full gap-5">
      <p className="min-w-20">{label}</p>
      <Controller
        control={control}
        name="techReqId"
        render={({ field: { onChange, value, ...rest } }) => (
          <SelectInput
            label={t("_entities:entities.tech")}
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

export default TechForm;

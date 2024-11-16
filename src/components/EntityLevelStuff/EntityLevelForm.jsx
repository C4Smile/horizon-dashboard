import { useMemo } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

// components
import TextInput from "../Forms/TextInput";
import SelectInput from "../Forms/SelectInput";


/**
 *
 * @param {*} props - component form
 * @returns EntityForm component
 */
const EntityLevelForm = function EntityForm(props) {
  const { t } = useTranslation();

  const { currentList, entities, inputLabel, inputPlaceholder, control, entityLabel, attributeId } = props;

  const options = useMemo(
    () => entities.filter((res) => !currentList.some((rex) => rex[attributeId] === res.id)),
    [currentList, entities],
  );

  return (
    <div className="flex flex-col w-full gap-5">
      <p className="min-w-20">{t("_accessibility:labels.require")}</p>
      <Controller
        control={control}
        name="entityReqId"
        render={({ field: { onChange, value, ...rest } }) => (
          <SelectInput
            label={t(`_entities:entities.${entityLabel}`)}
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

export default EntityLevelForm;

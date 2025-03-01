import { useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
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

  const { currentList, entities, inputLabel, inputPlaceholder, control, entityLabel, attributeId } =
    props;

  const id = useWatch({ control, name: "id" });

  const options = useMemo(
    () =>
      entities.filter((res) =>
        !!id && typeof id === "number"
          ? currentList
          : !currentList.some((rex) => rex[attributeId] === res.id),
      ),
    [attributeId, currentList, entities, id],
  );

  return (
    <div className="flex flex-col w-full gap-5">
      <p className="min-w-20">{t("_accessibility:labels.require")}</p>
      <Controller
        control={control}
        name={attributeId}
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

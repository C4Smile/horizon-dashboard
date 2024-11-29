import { useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

// components
import TextInput from "../Forms/TextInput";
import SelectInput from "../Forms/SelectInput";

/**
 *
 * @param {*} props - component form
 * @returns ResourceForm component
 */
const ResourceForm = function ResourceForm(props) {
  const { t } = useTranslation();

  const { currentList, resources, label, inputLabel, inputPlaceholder, control } = props;

  const id = useWatch({ control, name: "id" });

  const options = useMemo(
    () =>
      resources.filter((res) =>
        !!id && typeof id === "number"
          ? currentList
          : !currentList.some((rex) => {
              return rex.resourceId === res.id;
            }),
      ),
    [currentList, resources, id],
  );

  return (
    <div className="flex flex-col w-full gap-5">
      <p className="min-w-20">{label}</p>
      <Controller
        control={control}
        name="resourceId"
        render={({ field: { onChange, value, ...rest } }) => (
          <SelectInput
            required
            label={t("_entities:entities.resource")}
            value={value}
            options={options}
            onChange={(e) => onChange(e.target.value)}
            {...rest}
          />
        )}
      />

      <Controller
        control={control}
        name="base"
        render={({ field }) => (
          <TextInput required label={inputLabel} placeholder={inputPlaceholder} {...field} />
        )}
      />

      <Controller
        control={control}
        name="factor"
        render={({ field }) => (
          <TextInput
            required
            label={t("_entities:base.factor.label")}
            placeholder={t("_entities:base.factor.placeholder")}
            {...field}
          />
        )}
      />
    </div>
  );
};

export default ResourceForm;

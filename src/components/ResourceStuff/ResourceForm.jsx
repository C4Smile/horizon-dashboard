import { memo, useMemo } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

// components
import TextInput from "../Forms/TextInput";
import SelectInput from "../Forms/SelectInput";

/**
 *
 * @param {*} props - component form
 * @returns ResourceForm component
 */
const ResourceForm = memo(
  function ResourceForm(props) {
    const { t } = useTranslation();

    const { currentList, resources, label, inputLabel, inputPlaceholder, control } = props;

    const options = useMemo(
      () =>
        resources.filter(
          (res) =>
            !currentList.some((rex) => {
              return rex.resourceId === res.id;
            }),
        ),
      [currentList, resources],
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
  },
  (prev, next) => {
    if (
      prev.resources !== next.resources ||
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

export default ResourceForm;

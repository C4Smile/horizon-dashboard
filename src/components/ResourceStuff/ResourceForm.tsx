import { useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { TextInput, SelectInput, Option } from "@sito/dashboard-app";

// types
import { OptionResourceCommonDto, ResourceFormPropsType } from "./types";

/**
 *
 * @param {*} props - component form
 * @returns ResourceForm component
 */
export const ResourceForm = <TDto extends OptionResourceCommonDto>(
  props: ResourceFormPropsType<TDto>,
) => {
  const { t } = useTranslation();

  const {
    currentList,
    resources,
    label,
    inputLabel,
    inputPlaceholder,
    control,
  } = props;

  const id = useWatch({ control, name: "id" });

  const options = useMemo(
    () =>
      resources
        .filter((res) =>
          !!id && typeof id === "number"
            ? currentList
            : !currentList.some((rex) => {
                return rex.resourceId === res.id;
              }),
        )
        .map((res) => ({ id: res.id, name: res.name })) as unknown as Option[],
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
          <TextInput
            required
            label={inputLabel}
            placeholder={inputPlaceholder}
            {...field}
          />
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

import { useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { SelectInput, TextInput, Option } from "@sito/dashboard-app";

// types
import { EntityLevelFormPropsType, OptionReqCommonDto } from "./types";

/**
 *
 * @param {*} props - component form
 * @returns EntityForm component
 */
export const EntityLevelForm = <TDto extends OptionReqCommonDto>(
  props: EntityLevelFormPropsType<TDto>,
) => {
  const { t } = useTranslation();

  const {
    currentList,
    entities,
    inputLabel,
    inputPlaceholder,
    control,
    entityLabel,
    attributeId,
  } = props;

  const id = useWatch({ control, name: "id" });

  const options = useMemo(
    () =>
      entities
        .filter((res) =>
          !!id && typeof id === "number"
            ? currentList
            : !currentList.some((rex) => rex[attributeId] === res.id),
        )
        .map((res) => ({ id: res.id, name: res.name })) as unknown as Option[],
    [attributeId, currentList, entities, id],
  );

  return (
    <div className="flex flex-col w-full gap-5">
      <p className="min-w-20">{t("_accessibility:labels.require")}</p>
      <Controller
        control={control}
        name={attributeId as string}
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
          <TextInput
            label={inputLabel}
            placeholder={inputPlaceholder}
            {...field}
          />
        )}
      />
    </div>
  );
};

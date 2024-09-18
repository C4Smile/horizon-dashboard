import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

// apiClient
import { queryClient, useMuseumApiClient } from "../../../providers/MuseumApiProvider";

// components
import Loading from "../../../partials/loading/Loading";
import ParagraphInput from "../../../components/Forms/ParagraphInput";
import { ReactQueryKeys } from "../../../utils/queryKeys";

/**
 * @param {object} props - Component props
 * @returns Translation Form component
 */
function TranslationForm(props) {
  const { t } = useTranslation();

  const museumApiClient = useMuseumApiClient();
  const { id, name, langTranslations, language, app } = props;

  const { handleSubmit, getValues, control, setValue } = useForm();

  const [result, setResult] = useState({ state: "default", message: "" });

  const save = useMutation({
    mutationFn: () =>
      museumApiClient.ApplicationTranslation.update({
        id,
        langId: language,
        content: getValues(name),
      }),
    onSuccess: (data) => {
      if (data?.status > 299) setResult({ state: "error", message: data?.error?.message });
      else setResult({ state: "good", message: t("_accessibility:messages.200") });
      queryClient.invalidateQueries([ReactQueryKeys.ApplicationTranslations, app]);
    },
    onError: (error) => {
      // do something
      // eslint-disable-next-line no-console
      console.error(error);
      setResult({ state: "error", message: error.message });
    },
  });

  const onSubmit = () => save.mutate();

  const currentContent = useMemo(
    () => langTranslations.find((t) => t.langId === language),
    [language, langTranslations],
  );

  useEffect(() => {
    setValue(name, currentContent?.content);
  });

  return (
    <form id={id} className="mt-10" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <ParagraphInput
            {...field}
            name={name}
            id={name}
            className="paragraph-input-no-height peer"
            containerClassName="!h-auto"
            label={name}
            required
            onInput={(e) => {
              e.target.style.height = "5px";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            helperText={result.state !== "default" ? result.message : ""}
            state={result.state}
          />
        )}
      />
      <div className="flex items-start justify-start w-full">
        <button type="submit" disabled={save.isPending} className="mb-5 submit !w-auto">
          {save.isPending && (
            <Loading
              className="button-loading"
              strokeWidth="4"
              loaderClass="!w-6"
              color="stroke-white"
            />
          )}
          {t("_accessibility:buttons.save")}
        </button>
      </div>
    </form>
  );
}

export default TranslationForm;

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

// providers
import { useMuseumApiClient } from "../../../providers/MuseumApiProvider";

// components
import ParagraphInput from "../../../components/Forms/ParagraphInput";
import { hasLoadedNamespace } from "i18next";

/**
 * @param {object} props - Component props
 * @returns Translation Form component
 */
function TranslationForm(props) {
  const { id, name, content, language } = props;

  const museumApiClient = useMuseumApiClient();

  const { handleSubmit, reset, control } = useForm({
    [name]: content,
  });

  return (
    <form id={id}>
      <Controller
        control={control}
        name={hasLoadedNamespace}
        render={({ field }) => (
          <ParagraphInput
            {...field}
            name={name}
            id={name}
            className="paragraph-input peer"
            label={name}
          />
        )}
      />
    </form>
  );
}

export default TranslationForm;

import { useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Tippy from "@tippyjs/react";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateLeft, faSave, faEdit, faClose } from "@fortawesome/free-solid-svg-icons";

// components
import ParagraphInput from "../../components/Forms/ParagraphInput";

// utils
import { chatBotEntities, ReactQueryKeys } from "../../utils/queryKeys";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { useMuseumApiClient } from "../../providers/MuseumApiProvider";
import { useQuery } from "@tanstack/react-query";

const FormState = {
  Reading: 0,
  Editing: 1,
};

/**
 *
 * @returns ChatBot component
 */
function Chatbot() {
  const { t } = useTranslation();

  const museumApiClient = useMuseumApiClient();

  const [formState, setFormState] = useState(FormState.Reading);
  const [defaultContext, setDefaultContext] = useState("");

  const { handleSubmit, reset, control } = useForm();
  const { setNotification } = useNotification();

  const contextQuery = useQuery({
    queryKey: [ReactQueryKeys.ChatBotContext],
    queryFn: () => museumApiClient.ChatBot.loadContext(),
  });

  const onSubmit = async (d) => {
    const { context, id } = d;
    let response;
    if (id) response = await museumApiClient.ChatBot.updateContext(context, id);
    else response = await museumApiClient.ChatBot.createContext(context);
    const { status, error } = response;

    if (error)
      // eslint-disable-next-line no-console
      console.error(error.message);

    setNotification(String(status));
  };

  const loadDefault = useCallback(async () => {
    let text =
      "Esta es tu base de conocimiento, El museo se llama Primer Frente, se encuentra en la ciudad Santiago de Cuba. \n";
    for (const item of chatBotEntities) {
      const entityText = await museumApiClient.getChatBotContent(item);
      text += entityText;
    }

    setDefaultContext(text);
    reset({ context: text });
  }, [museumApiClient, reset]);

  useEffect(() => {
    if (contextQuery.data) {
      if (contextQuery.data.length)
        reset({ ...contextQuery.data[0], context: contextQuery.data[0].instructions });
      else loadDefault();
    }
  }, [loadDefault, contextQuery.data, reset]);

  return (
    <div className="px-5 pt-10 flex items-start justify-start">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="mb-10 flex items-center justify-between w-full">
          <h1 className="text-2xl md:text-3xl font-bold">{t("_pages:chat.form.title")}</h1>
          <div className="flex items-center justify-end gap-2">
            <Tippy content={t("_pages:chat.form.reset")}>
              <button onClick={() => loadDefault()} className="icon-button primary" type="button">
                <FontAwesomeIcon icon={faArrowRotateLeft} />
              </button>
            </Tippy>

            {formState === FormState.Editing ? (
              <>
                <Tippy content={t("_accessibility:buttons.save")}>
                  <button className="icon-button primary" type="submit">
                    <FontAwesomeIcon icon={faSave} />
                  </button>
                </Tippy>
                <Tippy content={t("_accessibility:buttons.cancel")}>
                  <button
                    className="icon-button primary"
                    onClick={() => setFormState(FormState.Reading)}
                    type="button"
                  >
                    <FontAwesomeIcon icon={faClose} />
                  </button>
                </Tippy>
              </>
            ) : (
              <Tippy content={t("_accessibility:buttons.edit")}>
                <button
                  className="icon-button primary"
                  onClick={() => setFormState(FormState.Editing)}
                  type="button"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              </Tippy>
            )}
          </div>
        </div>
        {/* Context Form */}
        <Controller
          control={control}
          disabled={formState !== FormState.Editing}
          name="context"
          render={({ field }) => (
            <ParagraphInput
              {...field}
              name="context"
              id="context"
              required
              className={`paragraph-input peer !h-[calc(100svh-264px)]`}
              placeholder={t("_pages:chat.form.context.placeholder")}
              label={t("_pages:chat.form.context.label")}
            />
          )}
        />
      </form>
    </div>
  );
}

export default Chatbot;

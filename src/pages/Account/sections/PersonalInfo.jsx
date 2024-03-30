import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";

// components
import Loading from "../../partials/loading/Loading";
import TextInput from "../../components/Forms/TextInput";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { queryClient, useMuseumApiClient } from "../../providers/MuseumApiProvider";

// utils
import { ReactQueryKeys } from "../../utils/queryKeys";

/**
 * Personal Info section
 * @returns Personal Info component
 */
function PersonalInfo() {
  const { t } = useTranslation();

  const museumApiClient = useMuseumApiClient();

  const { setNotification } = useNotification();
  const [saving, setSaving] = useState(false);

  const { handleSubmit, reset, control } = useForm();

  const onSubmit = async (d) => {
    setNotification("");
    setSaving(true);
    try {
      let result;
      if (d.id) result = await museumApiClient.Customer.create(d);
      else result = await museumApiClient.Customer.update(d);
      const { error, status } = result;
      setNotification(String(status));

      // eslint-disable-next-line no-console
      if (error && error !== null) console.error(error);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setNotification(String(e.status));
    }
    setSaving(false);
  };

  const accountQuery = useQuery({
    queryKey: [ReactQueryKeys.Customers, userId],
    queryFn: () => museumApiClient.Customer.getById(userId),
    enabled: userId !== undefined,
    retry: false,
  });

  return (
    <form className="px-5 pt-10 flex items-start justify-start">
      <h2 className="text-1xl md:text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5">
        {t("_pages:settings.links.account")}
      </h2>
      <button
        type="submit"
        disabled={accountQuery.isLoading || saving}
        className="mb-5 relative text-white bg-light-primary transition enabled:hover:bg-primary enabled:focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        {(accountQuery.isLoading || saving) && (
          <Loading
            className="bg-primary w-full h-full absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] rounded-lg "
            strokeWidth="4"
            loaderClass="!w-6"
            color="stroke-white"
          />
        )}
        {t("_accessibility:buttons.submit")}
      </button>
    </form>
  );
}

export default PersonalInfo;

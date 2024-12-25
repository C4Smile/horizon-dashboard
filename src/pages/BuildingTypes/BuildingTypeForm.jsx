import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import loadable from "@loadable/component";

// components
import Loading from "../../partials/loading/Loading";
import TextInput from "../../components/Forms/TextInput";
import ImageUploader from "../../components/ImageUploader";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { queryClient, useHorizonApiClient } from "../../providers/HorizonApiProvider";

// utils
import { ReactQueryKeys } from "../../utils/queryKeys";

// pages
const NotFound = loadable(() => import("../NotFound/NotFound"));

/**
 * BuildingType Form page component
 * @returns BuildingType Form page component
 */
function BuildingTypeForm() {
  const { id } = useParams();

  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const [notFound, setNotFound] = useState(false);

  const { setNotification } = useNotification();
  const [saving, setSaving] = useState(false);
  const [lastUpdate, setLastUpdate] = useState();

  const [photo, setPhoto] = useState();

  const { handleSubmit, reset, control } = useForm();

  const onSubmit = async (d) => {
    setSaving(true);

    try {
      let result;
      if (!d.id) result = await horizonApiClient.BuildingType.create(d, photo);
      else result = await horizonApiClient.BuildingType.update(d, photo);

      const { error, status } = result;
      setNotification(String(status), { model: t("_entities:entities.buildingType") });
      setLastUpdate(new Date().toDateString());
      // eslint-disable-next-line no-console
      if (error) console.error(error.message);
      else {
        await queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.BuildingTypes] });
        if (id !== undefined)
          await queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.BuildingTypes, id] });
        else {
          setPhoto();
          reset({
            id: undefined,
            name: "",
          });
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setNotification(String(e.status), { model: t("_entities:entities.buildingType") });
    }
    setSaving(false);
  };

  const buildingTypeQuery = useQuery({
    queryKey: [ReactQueryKeys.BuildingTypes, id],
    queryFn: () => horizonApiClient.BuildingType.getById(id),
    enabled: id !== undefined,
  });

  useEffect(() => {
    const { data } = buildingTypeQuery;
    // eslint-disable-next-line no-console
    if (data && data.error) console.error(data.error.message);
    if (data?.status === 404) setNotFound(true);
  }, [buildingTypeQuery]);

  useEffect(() => {
    if (buildingTypeQuery.data) {
      //* PARSING PHOTO
      setPhoto(buildingTypeQuery.data?.image);

      setLastUpdate(buildingTypeQuery?.data?.lastUpdate);
      reset({ ...buildingTypeQuery.data });
    }

    if (!id) {
      setPhoto();
      reset({
        id: undefined,
        name: "",
        baseFactor: 0,
        description: "",
      });
    }
  }, [buildingTypeQuery.data, reset, id]);

  return notFound ? (
    <NotFound />
  ) : (
    <div className="px-5 pt-10 flex items-start justify-start">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <h1 className="text-2xl md:text-3xl font-bold">
          {id
            ? `${t("_accessibility:components.form.editing")} ${id}`
            : t("_pages:buildingTypes.newForm")}
        </h1>
        {buildingTypeQuery.isLoading ? (
          <Loading
            className="bg-none w-6 h-6 mb-10"
            strokeWidth="4"
            loaderClass="!w-6"
            color="stroke-primary"
          />
        ) : (
          <div className={id && lastUpdate ? "" : "mt-5"}>
            {id && lastUpdate && (
              <p className="text-sm mb-10">
                {t("_accessibility:labels.lastUpdate")}{" "}
                {new Date(lastUpdate).toLocaleDateString("es-ES")}
              </p>
            )}
          </div>
        )}

        {/* BuildingType Name */}
        <Controller
          control={control}
          disabled={buildingTypeQuery.isLoading || saving}
          name="name"
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              name="name"
              id="name"
              className="text-input peer"
              placeholder={t("_entities:buildingType.name.placeholder")}
              label={t("_entities:buildingType.name.label")}
              required
            />
          )}
        />

        {/* Building Image */}
        <div className="my-5">
          {buildingTypeQuery.isLoading ? (
            <Loading />
          ) : (
            <ImageUploader
              photo={photo}
              setPhoto={setPhoto}
              label={`${t("_entities:buildingType.image.label")}`}
              folder={`${ReactQueryKeys.BuildingTypes}`}
            />
          )}
        </div>

        <button type="submit" disabled={buildingTypeQuery.isLoading || saving} className="my-5 submit">
          {(buildingTypeQuery.isLoading || saving) && (
            <Loading
              className="button-loading"
              strokeWidth="4"
              loaderClass="!w-6"
              color="stroke-white"
            />
          )}
          {t("_accessibility:buttons.save")}
        </button>
      </form>
    </div>
  );
}

export default BuildingTypeForm;

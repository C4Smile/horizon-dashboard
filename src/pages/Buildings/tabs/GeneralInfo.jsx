import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import loadable from "@loadable/component";

// editor
import { ContentState, EditorState } from "draft-js";
import htmlToDraft from "html-to-draftjs";

// components
import Loading from "../../../partials/loading/Loading";
import TextInput from "../../../components/Forms/TextInput";
import SelectInput from "../../../components/Forms/SelectInput";
import ImageUploader from "../../../components/ImageUploader";

// providers
import { useNotification } from "../../../providers/NotificationProvider";
import { queryClient, useHorizonApiClient } from "../../../providers/HorizonApiProvider";

// utils
import { ReactQueryKeys } from "../../../utils/queryKeys";

// loadable
const HtmlInput = loadable(() => import("../../../components/Forms/HtmlInput"));

/**
 * General Info
 * @param {*} props - component props
 * @returns GeneralInfo
 */
function GeneralInfo(props) {
  const { t } = useTranslation();

  const { buildingQuery } = props;

  const horizonApiClient = useHorizonApiClient();

  const { setNotification } = useNotification();
  const [saving, setSaving] = useState(false);
  const [lastUpdate, setLastUpdate] = useState("");

  const { handleSubmit, reset, control, getValues } = useForm();

  const [photo, setPhoto] = useState();

  const typesQuery = useQuery({
    queryKey: [ReactQueryKeys.BuildingTypes],
    queryFn: () => horizonApiClient.BuildingType.getAll(),
  });

  const typesList = useMemo(() => {
    try {
      return typesQuery?.data?.items?.map((c) => ({ value: `${c.name}`, id: c.id })) ?? [];
    } catch (err) {
      return [];
    }
  }, [typesQuery.data]);

  const onSubmit = async (d) => {
    setSaving(true);

    try {
      let result;
      if (!d.id) result = await horizonApiClient.Building.create(d, photo);
      else result = await horizonApiClient.Building.update(d, photo);

      const { error, status } = result;
      setNotification(String(status), { model: t("_entities:entities.building") });
      setLastUpdate(new Date().toDateString());
      // eslint-disable-next-line no-console
      if (error !== null && error) console.error(error.message);
      else {
        await queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Buildings] });
        if (d.id !== undefined)
          await queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Buildings, id] });
        else {
          setPhoto(null);
          reset({
            id: undefined,
            name: "",
            creationTime: 0,
            description: "",
          });
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setNotification(String(e.status), { model: t("_entities:entities.building") });
    }
    setSaving(false);
  };

  useEffect(() => {
    if (buildingQuery.data) {
      //* PARSING PHOTO
      setPhoto(buildingQuery.data?.image);

      //* PARSING CONTENT
      if (buildingQuery.data?.description && typeof buildingQuery.data?.description === "string") {
        const html = buildingQuery.data?.description;
        const descriptionBlock = htmlToDraft(html);
        if (descriptionBlock) {
          const descriptionState = ContentState.createFromBlockArray(descriptionBlock);
          buildingQuery.data.description = EditorState.createWithContent(descriptionState);
        }
      }
      setLastUpdate(buildingQuery?.data?.lastUpdate);
      reset({ ...buildingQuery.data });
    }

    if (!buildingQuery.data?.id) {
      setPhoto(null);
      reset({
        id: undefined,
        name: "",
        creationTime: 0,
        description: "",
      });
    }
  }, [buildingQuery.data, reset]);

  const id = getValues("id");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form mt-5 gap-5">
      <h1 className="text-2xl md:text-3xl font-bold">
        {id ? `${t("_pages:buildings.editForm")} ${id}` : t("_pages:buildings.newForm")}
      </h1>

      {buildingQuery.isLoading ? (
        <Loading
          className="bg-none w-6 h-6 mb-10"
          strokeWidth="4"
          loaderClass="!w-6"
          color="stroke-primary"
        />
      ) : id ? (
        <>
          <div className={lastUpdate?.length ? "" : "mt-5"}>
            {lastUpdate?.length && (
              <p className="text-sm mb-10">
                {t("_accessibility:labels.lastUpdate")}{" "}
                {new Date(lastUpdate).toLocaleDateString("es-ES")}
              </p>
            )}
          </div>
        </>
      ) : null}

      {/* Building Name */}
      <Controller
        control={control}
        disabled={buildingQuery.isLoading || saving}
        name="name"
        render={({ field }) => (
          <TextInput
            {...field}
            type="text"
            name="name"
            id="name"
            className="text-input peer"
            placeholder={t("_entities:building.name.placeholder")}
            label={t("_entities:building.name.label")}
            required
          />
        )}
      />

      {/* Building Creation Time */}
      <Controller
        control={control}
        disabled={buildingQuery.isLoading || saving}
        name="creationTime"
        render={({ field }) => (
          <TextInput
            {...field}
            type="number"
            name="creationTime"
            id="creationTime"
            className="text-input peer"
            placeholder={t("_entities:building.creationTime.placeholder")}
            label={t("_entities:building.creationTime.label")}
            required
          />
        )}
      />

      {/* Building Type */}
      <Controller
        control={control}
        name="typeId"
        disabled={buildingQuery.isLoading || typesQuery.isLoading || saving}
        render={({ field: { onChange, value, ...rest } }) => (
          <SelectInput
            {...rest}
            id="typeId"
            name="typeId"
            label={t("_entities:building.typeId.label")}
            options={typesList}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
            }}
          />
        )}
      />

      {/* Building Image */}
      <div className="my-5">
        {buildingQuery.isLoading ? (
          <Loading />
        ) : (
          <ImageUploader
            photo={photo}
            setPhoto={setPhoto}
            label={`${t("_entities:building.image.label")}`}
            folder={`${ReactQueryKeys.Buildings}`}
          />
        )}
      </div>

      {/* Building description */}
      <Controller
        control={control}
        name="description"
        disabled={buildingQuery.isLoading || saving}
        render={({ field: { onChange, value, ...rest } }) => (
          <HtmlInput
            label={t("_entities:building.description.label")}
            wrapperClassName="mt-5 w-full"
            {...rest}
            value={value}
            onChange={onChange}
          />
        )}
      />

      <button type="submit" disabled={buildingQuery.isLoading || saving} className="my-5 submit">
        {(buildingQuery.isLoading || saving) && (
          <Loading className="button-loading" strokeWidth="4" loaderClass="!w-6" color="stroke-white" />
        )}
        {t("_accessibility:buttons.save")}
      </button>
    </form>
  );
}

export default GeneralInfo;

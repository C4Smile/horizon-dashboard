import { ChangeEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { ConfirmationDialog, Loading } from "@sito/dashboard-app";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faAdd } from "@fortawesome/free-solid-svg-icons";

// utils
import { staticUrlPhoto } from "../utils";

// providers
import { useHorizonApiClient } from "providers";

// types
import { ImageUploaderPropsType } from "./types";

/**
 * ImageUploader component
 * @param {object} props - component props
 * @returns ImageUploader component
 */
export function ImageUploader(props: ImageUploaderPropsType) {
  const { label, folder, photo, setPhoto } = props;

  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const { t } = useTranslation();

  const museumApiClient = useHorizonApiClient();

  const onUploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    setLoadingPhoto(true);
    const files = e.target.files;
    if (files) {
      if (files.length) {
        const preview = await museumApiClient.Image.readFileAsBase64(files[0]);
        setPhoto({
          base64: preview as string,
          folder,
          fileName: files[0].name,
        });
      }
    }
    setLoadingPhoto(false);
  };

  const onDelete = () => {
    setPhoto(null);
    setConfirmingDelete(false);
  };

  const photoToShow = useMemo(() => {
    if (photo && (photo.url || photo.base64))
      return photo.base64 ?? staticUrlPhoto(photo.url ?? "");
    return null;
  }, [photo]);

  return (
    <>
      <label className="flex flex-col items-start gap-4">
        <span>{label}</span>
        {loadingPhoto ? (
          <Loading className="w-40 h-40 bg-black/20 rounded-lg" />
        ) : (
          <>
            {photoToShow && photo?.id !== 1 ? (
              <>
                <div className="flex flex-col relative">
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(true)}
                    aria-label={t("_accessibility:buttons.delete")}
                    title={t("_accessibility:buttons.delete")}
                    className="text-error bg-bg-error absolute top-2 right-2 rounded-lg w-9 h-9"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <img
                    className="tile w-40 h-40 object-cover"
                    src={photoToShow}
                    alt="upload"
                  />
                </div>
              </>
            ) : (
              <div className="flex gap-4 items-center relative">
                <input
                  accept="image/png, image/jpeg, image/jpg"
                  type="file"
                  onChange={onUploadFile}
                />
                <div className="w-40 h-40 flex items-center justify-center rounded-lg border-2 border-dashed border-primary/40">
                  <FontAwesomeIcon
                    icon={faAdd}
                    className="cursor-pointer p-4 text-2xl text-primary"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </label>

      {/* outside the label on purpose: a click inside one activates the
          label's control, and that is the file input */}
      <ConfirmationDialog
        open={confirmingDelete}
        title={t("_pages:common.actions.deleteImage.dialog.title")}
        handleClose={() => setConfirmingDelete(false)}
        handleSubmit={onDelete}
        closeOnBackdropClick
      >
        <p>{t("_pages:common.actions.deleteImage.dialog.message")}</p>
      </ConfirmationDialog>
    </>
  );
}

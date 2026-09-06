import { ChangeEvent, useCallback, useState } from "react";

// @sito/dashboard-app
import { Loading } from "@sito/dashboard-app";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faTrash } from "@fortawesome/free-solid-svg-icons";

// utils
import { staticUrlPhoto } from "../utils";

// providers
import { useHorizonApiClient } from "providers";

// types
import { ImageFormType, ImageUploaderMultiplePropsType } from "./types";

/**
 * ImageUploader component
 * @param {object} props - component props
 * @returns ImageUploaderMultiple component
 */
function ImageUploaderMultiple(props: ImageUploaderMultiplePropsType) {
  const { label, folder, photos, setPhotos } = props;

  const [loadingPhotos, setLoadingPhotos] = useState(false);

  const museumApiClient = useHorizonApiClient();

  const onUploadFile = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      setLoadingPhotos(true);
      const files = e.target.files;
      if (files) {
        if (files.length) {
          const uploads = await museumApiClient.Image.readFilesAsBase64(files);
          if (photos.length)
            setPhotos({
              type: "add",
              items: uploads.map((preview, i) => ({
                key: files[i].name,
                base64: preview as string,
                folder,
                fileName: files[i].name,
              })),
            });
          else
            setPhotos({
              type: "set",
              items: uploads.map((preview, i) => ({
                key: files[i].name,
                base64: preview as string,
                folder,
                fileName: files[i].name,
              })),
            });
        }
      }

      setLoadingPhotos(false);
    },
    [folder, museumApiClient.Image, photos.length, setPhotos],
  );

  const onDelete = async (index: number) =>
    setPhotos({ type: "delete", index });

  const photoToShow = useCallback((photo: ImageFormType) => {
    if (photo && (photo.url || photo.base64))
      return photo.base64 ?? staticUrlPhoto(photo.url ?? "");
    return null;
  }, []);

  return (
    <>
      <span>{label}</span>
      <div className="flex items-center justify-start gap-2 flex-wrap mt-5">
        {photos.length ? (
          <>
            {photos.map((photo, i) => (
              <div
                key={photo.id ?? photo.fileName}
                className="flex flex-col relative"
              >
                <button
                  type="button"
                  onClick={() => onDelete(i)}
                  className="text-secondary hover:text-white bg-white hover:bg-secondary absolute -top-2 -right-2 rounded-full w-8 h-8 transition-colors duration-300"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <img
                  className="w-20 h-20 rounded-full object-cover"
                  src={photoToShow(photo) ?? ""}
                  alt="upload"
                />
              </div>
            ))}
          </>
        ) : null}
        <label className="flex flex-col items-start gap-4">
          {loadingPhotos ? (
            <Loading className="w-20 h-20 bg-black/20 rounded-full" />
          ) : (
            <div className="flex gap-4 items-center relative">
              <input
                accept="image/png, image/jpeg, image/jpg"
                type="file"
                onChange={onUploadFile}
                multiple
              />
              <div className="w-20 h-20 flex items-center justify-center rounded-full border-2 border-dashed border-primary/40">
                <FontAwesomeIcon
                  icon={faAdd}
                  className="cursor-pointer p-4 text-2xl text-primary"
                />
              </div>
            </div>
          )}
        </label>
      </div>
    </>
  );
}

export default ImageUploaderMultiple;

import { ChangeEvent, useMemo, useState } from "react";

// @sito/dashboard
import { Loading } from "@sito/dashboard";

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
function ImageUploader(props: ImageUploaderPropsType) {
  const { label, folder, photo, setPhoto } = props;

  const [loadingPhoto, setLoadingPhoto] = useState(false);

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

  const onDelete = async () => {
    setPhoto(null);
  };

  const photoToShow = useMemo(() => {
    if (photo && (photo.url || photo.base64))
      return photo.base64 ?? staticUrlPhoto(photo.url ?? "");
    return null;
  }, [photo]);

  return (
    <label className="flex flex-col items-start gap-4">
      <span>{label}</span>
      {loadingPhoto ? (
        <Loading className="w-60 h-60 bg-black/20 rounded-full" />
      ) : (
        <>
          {photoToShow && photo.id !== 1 ? (
            <>
              <div className="flex flex-col relative">
                <button
                  type="button"
                  onClick={onDelete}
                  className="text-white bg-error absolute top-1 right-1 rounded-full w-10 h-10"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <img
                  className="w-60 h-60 rounded-full object-cover"
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
              <div className="w-20 h-20 flex items-center justify-center rounded-full border-2 border-dashed border-primary/40">
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
  );
}

export default ImageUploader;

import { useEffect, useMemo, useState } from "react";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faAdd } from "@fortawesome/free-solid-svg-icons";

// components
import Loading from "../partials/loading/Loading";

// image
import noPhoto from "../assets/images/no-product.jpg";

// utils
import { staticUrlPhoto } from "./utils";

// providers
import { useHorizonApiClient } from "../providers/HorizonApiProvider";

/**
 * ImageUploader component
 * @param {object} props - component props
 * @returns ImageUploader component
 */
function ImageUploader(props) {
  const { label, folder, photo, setPhoto } = props;

  const [preview, setPreview] = useState(null);

  const [loadingPhoto, setLoadingPhoto] = useState(false);

  const horizonApiClient = useHorizonApiClient();

  const onUploadFile = async (e) => {
    setLoadingPhoto(true);
    if (e.target.files.length) {
      const preview = await horizonApiClient.Image.readFileAsBase64(e.target.files[0]);
      setPreview(preview);
      setPhoto({ base64: preview, folder, fileName: e.target.files[0].name });
    }
    setLoadingPhoto(false);
  };

  const onDelete = async () => {
    setPhoto(null);
    setPreview(null);
  };

  const photoToShow = useMemo(() => {
    if (photo && photo.url) return staticUrlPhoto(photo.url);
    if (preview) return preview;
    return noPhoto;
  }, [photo, preview]);

  useEffect(() => {
    setPreview(photo?.url ?? null);
  }, [photo]);

  return (
    <label className="flex flex-col items-start gap-4">
      <span>{label}</span>
      {loadingPhoto ? (
        <Loading className="w-60 h-60 bg-black/20 rounded-full" />
      ) : (
        <>
          {photoToShow !== noPhoto ? (
            <>
              <div className="flex flex-col relative">
                <button
                  type="button"
                  onClick={onDelete}
                  className="text-white bg-error absolute top-1 right-1 rounded-full w-10 h-10"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <img className="w-60 h-60 rounded-full object-cover" src={photoToShow} alt="upload" />
              </div>
            </>
          ) : (
            <div className="flex gap-4 items-center relative">
              <input accept="image/png, image/jpeg, image/jpg" type="file" onChange={onUploadFile} />
              <div className="w-20 h-20 flex items-center justify-center rounded-full border-2 border-dashed border-primary/40">
                <FontAwesomeIcon icon={faAdd} className="cursor-pointer p-4 text-2xl text-primary" />
              </div>
            </div>
          )}
        </>
      )}
    </label>
  );
}

export default ImageUploader;

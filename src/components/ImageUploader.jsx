import { useState } from "react";

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
import { useMuseumApiClient } from "../providers/MuseumApiProvider";

/**
 * ImageUploader component
 * @param {object} props - component props
 * @returns ImageUploader component
 */
function ImageUploader(props) {
  const { label, folder, photo, setPhoto } = props;

  const [loadingPhoto, setLoadingPhoto] = useState(false);

  const museumApiClient = useMuseumApiClient();

  const onUploadFile = async (e) => {
    setLoadingPhoto(true);
    const uploads = await museumApiClient.Image.insertImages(e.target.files, folder);
    setPhoto(uploads[0]);
    setLoadingPhoto(false);
  };

  const onDelete = async () => {
    const error = await museumApiClient.Image.deleteImage(photo?.fileId ?? photo?.fileName);
    if (!error) setPhoto();
    // eslint-disable-next-line no-console
    else console.error(error);
  };

  return (
    <label className="flex flex-col items-start gap-4">
      <span>{label}</span>
      {loadingPhoto ? (
        <Loading className="w-60 h-60 bg-black/20 rounded-full" />
      ) : (
        <>
          {photo && photo.id ? (
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
                  src={photo?.url ? staticUrlPhoto(photo?.url) : noPhoto}
                  alt="upload"
                />
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

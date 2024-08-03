import { useState } from "react";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faTrash } from "@fortawesome/free-solid-svg-icons";

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
 * @returns ImageUploaderMultiple component
 */
function ImageUploaderMultiple(props) {
  const { label, folder, photos, setPhotos } = props;

  const [loadingPhotos, setLoadingPhotos] = useState(false);

  const museumApiClient = useMuseumApiClient();

  const onUploadFile = async (e) => {
    setLoadingPhotos(true);
    const uploads = await museumApiClient.Image.insertImages(e.target.files, folder);
    setPhotos({ type: "set", items: uploads });
    setLoadingPhotos(false);
  };

  const onDelete = async (index) => {
    const status = await museumApiClient.Image.deleteImage(photos[index]?.id);
    if (status === 200) setPhotos({ type: "delete", index });
    // eslint-disable-next-line no-console
    else console.error(status);
  };

  return (
    <>
      <span>{label}</span>
      <div className="flex items-center justify-start gap-2 flex-wrap mt-5">
        {photos.length ? (
          <>
            {photos.map((photo, i) => (
              <div key={photo.id} className="flex flex-col relative">
                <button
                  type="button"
                  onClick={() => onDelete(i)}
                  className="text-secondary hover:text-white bg-white hover:bg-secondary absolute -top-2 -right-2 rounded-full w-8 h-8 transition-colors duration-300"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <img
                  className="w-20 h-20 rounded-full"
                  src={photo?.url ? staticUrlPhoto(photo?.url) : noPhoto}
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
                <FontAwesomeIcon icon={faAdd} className="cursor-pointer p-4 text-2xl text-primary" />
              </div>
            </div>
          )}
        </label>
      </div>
    </>
  );
}

export default ImageUploaderMultiple;

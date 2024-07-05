import { useState } from "react";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faAdd } from "@fortawesome/free-solid-svg-icons";

// components
import Loading from "../partials/loading/Loading";

// image
import noPhoto from "../assets/images/no-product.jpg";

// imagekitio-react
import { IKContext, IKUpload } from "imagekitio-react";

// providers
import { useMuseumApiClient } from "../providers/MuseumApiProvider";

/**
 * ImageKitIoUploader component
 * @param {object} props
 * @returns
 */
function ImageKitIoUploader(props) {
  const { label, folder, photo, setPhoto } = props;

  const [loadingPhoto, setLoadingPhoto] = useState(false);

  const museumApiClient = useMuseumApiClient();

  const onLoading = () => {
    setLoadingPhoto(true);
  };

  /**
   *
   * @param {*} res
   */
  const onSuccess = async (res) => {
    try {
      const { url, fileId } = res;
      if (photo) await museumApiClient.ImageKitIo.deleteImage(photo.fileId);
      const { data, error } = await museumApiClient.ImageKitIo.insertImage({ url, fileId });
      if (!error) setPhoto({ fileId, url, id: data[0].id });
      // eslint-disable-next-line no-console
      else console.error(error);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    setLoadingPhoto(false);
  };

  const onError = (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    setLoadingPhoto(false);
  };

  const onDelete = async (index) => {
    const error = await museumApiClient.ImageKitIo.deleteImage(photo?.fileId ?? photo?.fileName);
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
                  src={photo?.url ?? noPhoto}
                  alt="upload"
                />
              </div>
            </>
          ) : (
            <div className="flex gap-4 items-center relative">
              <IKContext
                publicKey={museumApiClient.ImageKitIo.imageKitPublicKey}
                urlEndpoint={museumApiClient.ImageKitIo.imageKitUrl}
                authenticator={museumApiClient.ImageKitIo.authenticator}
                transformationPosition="path"
              >
                <IKUpload
                  onError={onError}
                  onChange={onLoading}
                  onSuccess={onSuccess}
                  folder={museumApiClient.ImageKitIo.generateFolder(folder)}
                />
              </IKContext>
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

export default ImageKitIoUploader;

import { useCallback, useState } from "react";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faTrash } from "@fortawesome/free-solid-svg-icons";

// components
import Loading from "../partials/loading/Loading";

// image
import noPhoto from "../assets/images/no-product.jpg";

// providers
import { useMuseumApiClient } from "../providers/MuseumApiProvider";

/**
 * ImageUploader component
 * @param {object} props
 * @returns
 */
function ImageUploaderMultiple(props) {
  const { label, folder, photos, setPhotos } = props;

  const [loadingPhotos, setLoadingPhotos] = useState(false);

  const museumApiClient = useMuseumApiClient();

  const onLoading = () => {
    setLoadingPhotos(true);
  };

  const uploadOthers = useCallback(
    async (files) => {
      const [, ...other] = files;
      const result = await museumApiClient.Image.insertImages(
        other,
        museumApiClient.Image.generateFolder(folder),
      );
      setPhotos({ type: "add", items: result });
    },
    [folder, museumApiClient.Image, setPhotos],
  );

  /**
   *
   * @param {*} res
   */
  const onSuccess = async (res) => {
    // museumApiClient.Image.generateFolder(folder)
    try {
      const { url, fileId } = res;
      const { data, error } = await museumApiClient.Image.insertImage({ url, fileId });
      if (!error) setPhotos({ type: "add", item: { fileId, url, id: data[0].id } });
      // eslint-disable-next-line no-console
      else console.error(error);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    setLoadingPhotos(false);
  };

  const onError = (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    setLoadingPhotos(false);
  };

  const onDelete = async (index) => {
    const error = await museumApiClient.Image.deleteImage(
      photos[index]?.fileId ?? photos[index]?.fileName,
    );
    if (!error) setPhotos({ type: "delete", index });
    // eslint-disable-next-line no-console
    else console.error(error);
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
                  className="text-white bg-error absolute -top-2 -right-2 rounded-full w-10 h-10"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <img className="w-20 h-20 rounded-full" src={photo?.url ?? noPhoto} alt="upload" />
              </div>
            ))}
          </>
        ) : null}
        <label className="flex flex-col items-start gap-4">
          {loadingPhotos ? (
            <Loading className="w-20 h-20 bg-black/20 rounded-full" />
          ) : (
            <div className="flex gap-4 items-center relative">
              <input type="file" />
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

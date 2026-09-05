import { useState } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Dialog } from "@sito/dashboard-app";

// images
import noProduct from "assets/images/no-product.jpg";

// utils
import { staticUrlPhoto } from "../utils";

// lib
import { PhotoDto } from "lib";

/** the photos of one table cell, and what to call them */
export type PhotoPreviewPropsType = {
  photos: PhotoDto[];
  alt: string;
};

/**
 * The thumbnails a table cell shows, each opening the full image in a dialog.
 * A cell with no photo falls back to the placeholder and stays inert, there is
 * nothing bigger to look at.
 * @param props - component props
 * @returns the cell content
 */
export function PhotoPreview(props: PhotoPreviewPropsType) {
  const { photos, alt } = props;
  const { t } = useTranslation();

  const [opened, setOpened] = useState<PhotoDto | null>(null);

  if (!photos.length)
    return (
      <img
        className="small-image rounded-full object-cover"
        src={noProduct}
        alt={alt}
      />
    );

  return (
    <>
      <div className="flex items-center justify-start">
        {photos.map((photo, i) => (
          <button
            key={photo.id ?? i}
            type="button"
            onClick={() => setOpened(photo)}
            aria-label={t("_accessibility:ariaLabels.viewImage", {
              defaultValue: alt,
            })}
            className={`cursor-pointer ${i > 0 ? "-ml-4" : ""}`}
          >
            <img
              className="small-image rounded-full object-cover border-white border-2 transition hover:brightness-110"
              src={staticUrlPhoto(photo.url)}
              alt={`${alt} ${i}`}
            />
          </button>
        ))}
      </div>

      <Dialog
        open={!!opened}
        title={opened?.fileName?.length ? opened.fileName : alt}
        handleClose={() => setOpened(null)}
        closeOnBackdropClick
      >
        {opened && (
          <img
            className="max-h-[70vh] w-full rounded-lg object-contain"
            src={staticUrlPhoto(opened.url)}
            alt={alt}
          />
        )}
      </Dialog>
    </>
  );
}

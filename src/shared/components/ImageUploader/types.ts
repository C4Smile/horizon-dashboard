import { BlobDto } from "lib";
import { ActionDispatch, Dispatch, SetStateAction } from "react";

// utils
import { PhotoReducerActionType } from "../utils";

export type ImageUploaderMultiplePropsType = {
  label?: string;
  folder: string;
  photos: ImageFormType[];
  setPhotos: ActionDispatch<[action: PhotoReducerActionType]>;
};

/**
 * A photo while a form holds it: either one the api already stored, which
 * arrives with an id and a url, or one the user just picked, which arrives as
 * a base64 blob. parseImage decides which of the two it is on the way out.
 */
export type ImageFormType = Partial<BlobDto> & {
  id?: number;
  url?: string;
};

export type ImageUploaderPropsType = {
  label?: string;
  folder: string;
  photo: ImageFormType | null;
  setPhoto: Dispatch<SetStateAction<ImageFormType | null>>;
};

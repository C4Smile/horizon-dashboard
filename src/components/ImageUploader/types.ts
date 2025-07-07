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

export interface ImageFormType extends BlobDto {
  id?: number;
  url?: string;
}

export type ImageUploaderPropsType = {
  label?: string;
  folder: string;
  photo: ImageFormType;
  setPhoto: Dispatch<SetStateAction<ImageFormType | null>>;
};

// @sito/dashboard
import { Action } from "@sito/dashboard";
import { BaseEntityDto } from "lib";

export enum BaseActions {
  Edit = "edit",
  Delete = "delete",
  Restore = "restore",
}

export interface UseActionPropTypes {
  hidden?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
}

export interface UseSingleActionPropTypes<TInDto> extends UseActionPropTypes {
  onClick: (record: TInDto) => void;
  hidden?: boolean;
}

export interface UseMultipleActionPropTypes<TInDto> extends UseActionPropTypes {
  onClick: (record: TInDto[]) => void;
  hidden?: boolean;
}

export type ActionHook<TDto extends BaseEntityDto> = {
  action: (row: TDto) => Action<TDto>;
};

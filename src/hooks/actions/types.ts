export enum BaseActions {
  Edit = "edit",
  Delete = "delete",
  Restore = "restore",
}

export interface UseActionPropTypes {
  hidden?: boolean;
  isLoading?: boolean;
}

export interface UseSingleActionPropTypes<TInDto> extends UseActionPropTypes {
  onClick: (record: TInDto) => void;
  hidden?: boolean;
}

export interface UseMultipleActionPropTypes<TInDto> extends UseActionPropTypes {
  onClick: (record: TInDto[]) => void;
  hidden?: boolean;
}

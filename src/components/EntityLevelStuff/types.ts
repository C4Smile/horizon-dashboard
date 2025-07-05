import { BaseCommonEntityDto } from "lib";
import { Control } from "react-hook-form";

export type EntityLevelFormPropsType<T extends BaseCommonEntityDto> = {
  currentList: T[];
  entities: T[];
  inputLabel: string;
  inputPlaceholder: string;
  control: Control;
  entityLabel: string;
  attributeId: keyof T;
};

export type EntityLevelRowPropsType<T extends BaseCommonEntityDto> = {
  disabled: boolean;
  entities: T[];
  value: T;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  inputLabel: string;
  entityLabel: string;
  attributeId: keyof T;
};

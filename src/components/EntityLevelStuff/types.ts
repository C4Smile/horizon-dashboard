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

import { BaseCommonEntityDto, BaseReqDto } from "lib";
import { Control } from "react-hook-form";

export interface OptionReqCommonDto extends BaseReqDto, BaseCommonEntityDto {
  value: string;
}

export type EntityLevelFormPropsType<T extends OptionReqCommonDto> = {
  currentList: T[];
  entities: T[];
  inputLabel: string;
  inputPlaceholder: string;
  control: Control;
  entityLabel: string;
  attributeId: keyof T;
};

export type EntityLevelRowPropsType<T extends OptionReqCommonDto> = {
  disabled: boolean;
  entities: T[];
  value: T;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  inputLabel: string;
  entityLabel: string;
  attributeId: keyof T;
};

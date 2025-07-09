import { BaseCommonEntityDto, BaseResourceDto, ResourceCommonDto } from "lib";
import { Control } from "react-hook-form";

export interface OptionResourceCommonDto
  extends BaseResourceDto,
    BaseCommonEntityDto {
  value: BaseResourceDto;
}

export type ResourceFormPropsType<T extends OptionResourceCommonDto> = {
  currentList: T[];
  resources: ResourceCommonDto[];
  label: string;
  inputLabel: string;
  inputPlaceholder: string;
  control: Control;
};

export type ResourceRowPropsType<T extends OptionResourceCommonDto> = {
  disabled: boolean;
  currentList: T[];
  resources: ResourceCommonDto[];
  label: string;
  value: T;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  inputLabel: string;
};

export type ResourceStuffPropsType<T extends OptionResourceCommonDto> = {
  id: number;
  label: string;
};

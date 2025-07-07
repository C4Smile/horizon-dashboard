import { QueryKey } from "@tanstack/react-query";
import { Tables } from "api";
import { BaseCommonEntityDto, BaseReqDto } from "lib";
import { Control } from "react-hook-form";
import { HTTPResponse } from "src/api/utils";

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

export type EntityLevelStuffPropsType<T extends OptionReqCommonDto> = {
  /** Entity Id */
  id: number;
  inputKey: keyof T;
  entity: Tables;
  entityToSave: Tables;
  queryFn: () => void;
  saveFn: (id: number, data: any) => Promise<HTTPResponse<T>>;
  deleteFn: (id: number, entityId: number) => Promise<HTTPResponse<number>>;
  queryKey: QueryKey;
  attributeId: keyof T;
  entities: T[];
};

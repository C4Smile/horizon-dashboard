import { QueryKey } from "@tanstack/react-query";
import { Control } from "react-hook-form";

// api
import { Tables } from "api";

// lib
import {
  BaseCommonEntityDto,
  BaseResourceDto,
  QueryResult,
  ResourceCommonDto,
} from "lib";

export interface OptionResourceCommonDto
  extends BaseResourceDto, BaseCommonEntityDto {
  value: BaseResourceDto;
}

/** what the dialog form holds, inputs give back strings */
export type ResourceFormType = {
  id?: number;
  resourceId: number | string;
  base: number | string;
  factor: number | string;
};

/** what the api takes to create or update the relation */
export type ResourceSaveDto = {
  id?: number;
  resourceId: number;
  base: number;
  factor: number;
};

export type ResourceFormPropsType<T extends OptionResourceCommonDto> = {
  currentList: T[];
  resources: ResourceCommonDto[];
  label: string;
  inputLabel: string;
  inputPlaceholder: string;
  control: Control<ResourceFormType>;
};

export type ResourceRowPropsType<T extends OptionResourceCommonDto> = {
  disabled: boolean;
  resources: ResourceCommonDto[];
  label: string;
  value: T;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  inputLabel: string;
};

export type ResourceStuffPropsType<T extends OptionResourceCommonDto> = {
  /** id of the entity the resources hang from */
  id: number;
  label: string;
  inputKey: string;
  entity: Tables;
  entityToSave: Tables;
  queryKey: QueryKey;
  /** relation endpoints answer a bare array, paged ones a QueryResult */
  queryFn: () => Promise<QueryResult<T> | T[]>;
  saveFn: (id: number, data: ResourceSaveDto) => Promise<unknown>;
  deleteFn: (id: number, resourceId: number) => Promise<unknown>;
  resources: ResourceCommonDto[];
};

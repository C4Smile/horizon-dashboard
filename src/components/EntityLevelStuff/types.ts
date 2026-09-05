import { QueryKey } from "@tanstack/react-query";
import { Control } from "react-hook-form";

// api
import { Tables } from "api";

// lib
import { BaseCommonEntityDto, BaseReqDto, QueryResult } from "lib";

export interface OptionReqCommonDto extends BaseReqDto, BaseCommonEntityDto {
  value: string;
}

/** what the dialog form holds, inputs give back strings */
export type EntityLevelFormType = {
  id?: number;
  level: number | string;
  [attribute: string]: number | string | undefined;
};

/** what the api takes to create or update the relation */
export type EntityLevelSaveDto = {
  level: number;
  [attribute: string]: number | undefined;
};

export type EntityLevelFormPropsType<T extends OptionReqCommonDto> = {
  currentList: T[];
  entities: T[];
  inputLabel: string;
  inputPlaceholder: string;
  control: Control<EntityLevelFormType>;
  entityLabel: string;
  /** name of the column that holds the required entity id, it varies per relation */
  attributeId: string;
};

export type EntityLevelRowPropsType<T extends OptionReqCommonDto> = {
  disabled: boolean;
  entities: T[];
  value: T;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  inputLabel: string;
  inputPlaceholder: string;
  entityLabel: string;
  attributeId: string;
};

export type EntityLevelStuffPropsType<T extends OptionReqCommonDto> = {
  /** id of the entity the requirements hang from */
  id: number;
  inputKey: string;
  entity: Tables;
  entityToSave: Tables;
  queryKey: QueryKey;
  /** relation endpoints answer a bare array, paged ones a QueryResult */
  queryFn: () => Promise<QueryResult<T> | T[]>;
  saveFn: (id: number, data: EntityLevelSaveDto) => Promise<unknown>;
  deleteFn: (id: number, entityId: number) => Promise<unknown>;
  attributeId: string;
  entities: T[];
};

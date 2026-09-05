import { QueryKey } from "@tanstack/react-query";
import { Control } from "react-hook-form";

// api
import { Tables } from "api";

// lib
import { BaseResourceDto, QueryResult } from "lib";

// components
import { EntityOption } from "../types";

/**
 * A row of an entity's resource relation. The component only reads the id and
 * the three numbers, so anything shaped like a resource relation fits.
 */
export type OptionResourceCommonDto = BaseResourceDto;

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
  resources: EntityOption[];
  label: string;
  inputLabel: string;
  inputPlaceholder: string;
  control: Control<ResourceFormType>;
};

export type ResourceRowPropsType<T extends OptionResourceCommonDto> = {
  disabled: boolean;
  resources: EntityOption[];
  label: string;
  value: T;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  inputLabel: string;
};

export type ResourceStuffPropsType<
  T extends OptionResourceCommonDto,
  TAddDto = ResourceSaveDto,
> = {
  /** id of the entity the resources hang from */
  id: number;
  label: string;
  inputKey: string;
  entity: Tables;
  entityToSave: Tables;
  queryKey: QueryKey;
  /** relation endpoints answer a bare array, paged ones a QueryResult */
  queryFn: () => Promise<QueryResult<T> | T[]>;
  /** only the caller knows the relation's own add dto */
  saveFn: (id: number, data: TAddDto) => Promise<unknown>;
  deleteFn: (id: number, resourceId: number) => Promise<unknown>;
  resources: EntityOption[];
};

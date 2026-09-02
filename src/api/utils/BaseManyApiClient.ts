// utils
import { fromLocal } from "../../utils/local";
import { APIClient } from "./APIClient";

// config
import config from "../../config";

// lib
import { BaseFilterDto, DeleteDto } from "lib";

// types
import { Tables } from "../types";

/**
 * @class BaseManyApiClient
 * @description BaseManyApiClient
 */
export class BaseManyApiClient<
  TDto extends DeleteDto,
  TAddDto,
  TFilter extends BaseFilterDto,
> {
  table: Tables;
  api: APIClient = new APIClient();

  /**
   *
   * @param baseUrl string url
   * @param idAttribute id url
   * @param idsAttribute ids url
   */
  constructor(table: Tables) {
    this.table = table;
  }

  /**
   * @description Get all objects
   * @param id id of main entity
   * @param query query parameters
   * @returns Result list
   */
  async get(id: number, query?: TFilter) {
    return await this.api.get<TDto, TFilter>(`${this.table}/${id}`, query, {
      Authorization: "Bearer " + fromLocal(config.user, "string"),
    });
  }

  /**
   *
   * @param id id of main entity
   * @param value data to insert
   * @returns inserted item
   */
  async insert(id: number, value: TAddDto): Promise<TDto> {
    return await this.api.post<TDto, TAddDto>(`${this.table}/${id}`, value, {
      Authorization: "Bearer " + fromLocal(config.user, "string"),
    });
  }

  /**
   *
   * @param data values to insert
   * @returns Query result
   */
  async insertMany(data: TAddDto[]): Promise<TDto> {
    return await this.api.doQuery<TDto, TAddDto[]>(
      `${this.table}/batch`,
      "POST",
      "",
      data,
      {
        Authorization: "Bearer " + fromLocal(config.user, "string"),
      },
    );
  }

  /**
   *
   * @param id id of main entity
   * @param ids id of relationship entities
   * @returns
   */
  async delete(id: number, ids: number[]): Promise<number> {
    return await this.api.delete(`${this.table}/${id}`, ids, {
      Authorization: "Bearer " + fromLocal(config.user, "string"),
    });
  }
}

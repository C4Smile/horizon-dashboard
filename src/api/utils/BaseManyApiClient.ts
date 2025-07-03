// utils
import { fromLocal } from "../../utils/local";
import { APIClient } from "./APIClient";

// config
import config from "src/config";

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
   * @param query - query parameters
   * @returns Result list
   */
  async get(query: TFilter) {
    return await this.api.get<TDto, TFilter>(`${this.table}`, query, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
  }

  /**
   *
   * @param value
   * @returns inserted item
   */
  async insert(value: TAddDto): Promise<TDto> {
    return await this.api.post<TDto, TAddDto>(`${this.table}`, value, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
  }

  /**
   *
   * @param data - values to insert
   * @returns - Query result
   */
  async insertMany(data: TAddDto[]): Promise<TDto> {
    return await this.api.doQuery<TDto, TAddDto[]>(
      `${this.table}/batch`,
      "POST",
      "",
      data,
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      }
    );
  }

  async softDelete(ids: number[]): Promise<number> {
    return await this.api.delete(`${this.table}`, ids, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
  }
}

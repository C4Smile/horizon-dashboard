// utils
import { fromLocal } from "../../utils/local";

// config
import config from "src/config";

// base
import { APIClient } from "./APIClient";

// types
import {
  BaseCommonEntityDto,
  BaseEntityDto,
  BaseFilterDto,
  DeleteDto,
  QueryResult,
} from "lib";
import { Tables } from "../types";

/**
 * @class BaseApiClient
 * @description it has all base method
 */
export class BaseApiClient<
  TDto extends BaseEntityDto,
  TCommonDto extends BaseCommonEntityDto,
  TAddDto,
  TUpdateDto extends DeleteDto,
  TFilter extends BaseFilterDto,
> {
  table: Tables;
  api: APIClient = new APIClient();

  /**
   *
   * @param table
   */
  constructor(table: Tables) {
    this.table = table;
  }

  /**
   * @param userId user locker
   * @param entityId entity id to lock
   * @returns result of http
   */
  async lock(userId: number, entityId: number) {
    return await this.api.patch(
      `${this.table}/${entityId}/lock`,
      {
        userId,
      },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      }
    );
  }

  /**
   * @param entityId entity id to lock
   * @returns result of http
   */
  async release(entityId: number) {
    return await this.api.patch(`${this.table}/${entityId}/release`, null, {
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

  /**
   *
   * @param value
   * @returns updated item
   */
  async update(value: TUpdateDto): Promise<TDto> {
    return await this.api.patch<TDto, TUpdateDto>(
      `${this.table}/${value.id}`,
      value,
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      }
    );
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
   * @param query - Where conditions (key-value)
   * @returns  - Query result
   */
  async commonGet(query: TFilter): Promise<QueryResult<TCommonDto>> {
    return await this.api.get<TCommonDto, TFilter>(
      `${this.table}/common`,
      query,
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      }
    );
  }

  /**
   *
   * @param id
   * @returns - Query result
   */
  async getById(id: number): Promise<TDto> {
    return await this.api.doQuery<TDto>(
      `${this.table}/${id}`,
      "GET",
      "",
      null,
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

  async restore(ids: number[]): Promise<number> {
    return await this.api.patch(`${this.table}/restore`, ids, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
  }
}

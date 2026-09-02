// utils
import { fromLocal } from "utils";

// config
import config from "../../config";

// base
import { APIClient } from "./APIClient";

// types
import { Tables } from "../types";

// lib
import {
  BaseCommonEntityDto,
  BaseEntityDto,
  BaseFilterDto,
  DeleteDto,
  QueryResult,
} from "lib";

// types
import { HttpRequestError } from "./types";

/**
 * @description What every form reads back from a create/update call
 */
export type SaveResult<TDto> = {
  data: TDto | null;
  status: number;
  error: HttpRequestError | null;
};

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
      },
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
    return await this.api.post<TDto, TAddDto>(this.table, value, {
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
      },
    );
  }

  /**
   *
   * @param value
   * @returns updated item
   */
  async update(value: TUpdateDto): Promise<TDto> {
    return await this.patchEntity(value);
  }

  /**
   * @description Raw patch, subclasses that override update() to take the form
   * values still reach the api through here
   * @param value
   * @returns updated item
   */
  protected async patchEntity(value: TUpdateDto): Promise<TDto> {
    return await this.api.patch<TDto, TUpdateDto>(
      `${this.table}/${value.id}`,
      value,
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
  }

  /**
   * @description Get all objects
   * @param query - query parameters
   * @returns Result list
   */
  async get(query?: TFilter): Promise<QueryResult<TDto>> {
    return await this.api.get<TDto, TFilter>(this.table, query, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
  }

  /**
   *
   * @param query - Where conditions (key-value)
   * @returns  - Query result
   */
  async commonGet(query?: TFilter): Promise<TCommonDto[]> {
    const result = await this.api.get<TCommonDto, TFilter>(
      `${this.table}/common`,
      query,
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    return result.items;
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
      },
    );
  }

  async softDelete(ids: number[]): Promise<number> {
    return await this.api.delete(this.table, ids, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
  }

  async restore(ids: number[]): Promise<number> {
    return await this.api.patch(`${this.table}/restore`, ids, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
  }

  /**
   * @description Every item, no paging, for selects and dropdowns
   * @returns Result list
   */
  async getAll(): Promise<QueryResult<TDto>> {
    return await this.get({ page: 0, count: 999 } as unknown as TFilter);
  }

  /**
   * @description Runs an api call and reports it the way the forms expect,
   * they read { status, error } instead of catching
   * @param request - api call
   * @param okStatus - status to report when it succeeds
   * @returns save result
   */
  protected async saveRequest<TResult>(
    request: () => Promise<TResult>,
    okStatus: number,
  ): Promise<SaveResult<TResult>> {
    try {
      const data = await request();
      return { data, status: okStatus, error: null };
    } catch (e) {
      const error = e as HttpRequestError;
      return { data: null, status: error?.status ?? 500, error };
    }
  }

  /**
   * @description Inserts and reports the result to the form
   * @param value - add dto
   * @returns save result
   */
  protected async saveNew(value: TAddDto): Promise<SaveResult<TDto>> {
    return await this.saveRequest(() => this.insert(value), 201);
  }

  /**
   * @description Updates and reports the result to the form
   * @param value - update dto
   * @returns save result
   */
  protected async saveExisting(value: TUpdateDto): Promise<SaveResult<TDto>> {
    return await this.saveRequest(() => this.patchEntity(value), 200);
  }
}

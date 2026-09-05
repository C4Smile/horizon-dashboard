// @sito/dashboard-app
import {
  APIClient,
  Methods,
  buildQueryUrl,
  type QueryParam,
} from "@sito/dashboard-app";

// config
import config from "../../config";

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

/** what the api falls back to when the table has not set a page size yet */
const DEFAULT_PAGE_SIZE = 20;

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
 * @description CRUD over the shared APIClient, which carries the access token
 * on every call. It does not extend the library's BaseClient: that models
 * entities as createdAt/updatedAt while horizon answers
 * dateOfCreation/lastUpdate, and it pages with `pageSize` where horizon reads
 * `count`.
 */
export class BaseApiClient<
  TDto extends BaseEntityDto,
  TCommonDto extends BaseCommonEntityDto,
  TAddDto,
  TUpdateDto extends DeleteDto,
  TFilter extends BaseFilterDto,
> {
  table: Tables;
  api: APIClient;

  /**
   * @param table - api endpoint this client reads
   */
  constructor(table: Tables) {
    this.table = table;
    this.api = new APIClient(config.apiUrl, config.user, true, undefined, {
      rememberKey: config.remember,
    });
  }

  /**
   * @param value - add dto
   * @returns inserted item
   */
  async insert(value: TAddDto): Promise<TDto> {
    return await this.api.post<TDto, TAddDto>(this.table, value);
  }

  /**
   * @param data - values to insert
   * @returns Query result
   */
  async insertMany(data: TAddDto[]): Promise<TDto> {
    return await this.api.doQuery<TDto, TAddDto[]>(
      `${this.table}/batch`,
      Methods.POST,
      data,
    );
  }

  /**
   * @param value - update dto
   * @returns updated item
   */
  async update(value: TUpdateDto): Promise<TDto> {
    return await this.patchEntity(value);
  }

  /**
   * @description Raw patch. Subclasses override update() to take the form
   * values and a photo, so the save helpers have to reach the api through
   * here or they would call the override back.
   * @param value - update dto
   * @returns updated item
   */
  protected async patchEntity(value: TUpdateDto): Promise<TDto> {
    return await this.api.patch<TDto, TUpdateDto>(
      `${this.table}/${value.id}`,
      value,
    );
  }

  /**
   * @param id - entity id
   * @returns the entity
   */
  async getById(id: number): Promise<TDto> {
    return await this.api.doQuery<TDto>(`${this.table}/${id}`, Methods.GET);
  }

  /**
   * @param ids - entities to soft delete
   * @returns how many were deleted
   */
  async softDelete(ids: number[]): Promise<number> {
    return await this.api.delete(this.table, ids);
  }

  /**
   * @param ids - entities to restore
   * @returns how many were restored
   */
  async restore(ids: number[]): Promise<number> {
    return await this.api.patch<number, number[]>(
      `${this.table}/restore`,
      ids,
    );
  }

  /**
   * @description The shared client sends `pageSize`, every horizon controller
   * reads `count`, and the ones that do not default their paging answer a 500
   * on a missing page, so both always travel.
   * @param query - table options
   * @param filters - entity filters
   * @returns the endpoint with horizon's query string
   */
  private queryUrl(endpoint: string, query?: QueryParam<TDto>, filters?: TFilter) {
    return buildQueryUrl(endpoint, {
      ...(filters ?? {}),
      ...(query?.sortingBy ? { sort: String(query.sortingBy) } : {}),
      ...(query?.sortingOrder ? { order: query.sortingOrder } : {}),
      page: query?.currentPage ?? 0,
      count: query?.pageSize ?? DEFAULT_PAGE_SIZE,
    });
  }

  async get(
    query?: QueryParam<TDto>,
    filters?: TFilter,
  ): Promise<QueryResult<TDto>> {
    return await this.api.doQuery<QueryResult<TDto>>(
      this.queryUrl(this.table, query, filters),
      Methods.GET,
    );
  }

  /**
   * @description Lightweight list used to fill entity pickers. The backend has
   * no `/common` route, so this reads the regular list endpoint: the full dto
   * is a superset of the common one.
   * @param filters - entity filters
   * @returns the rows
   */
  async commonGet(filters?: TFilter): Promise<TCommonDto[]> {
    const result = await this.api.doQuery<QueryResult<TCommonDto>>(
      this.queryUrl(this.table, undefined, filters),
      Methods.GET,
    );
    return result.items;
  }

  /**
   * @description Whole list, for the pickers that page through everything
   * @returns Result list
   */
  async getAll(): Promise<QueryResult<TDto>> {
    return await this.api.doQuery<QueryResult<TDto>>(
      this.queryUrl(this.table, { pageSize: 999 } as QueryParam<TDto>),
      Methods.GET,
    );
  }

  /**
   * @param userId user locker
   * @param entityId entity id to lock
   * @returns result of http
   */
  async lock(userId: number, entityId: number) {
    return await this.api.patch(`${this.table}/${entityId}/lock`, { userId });
  }

  /**
   * @param entityId entity id to release
   * @returns result of http
   */
  async release(entityId: number) {
    return await this.api.patch(`${this.table}/${entityId}/release`, null);
  }

  /**
   * @description Runs a mutation and reports it the way the forms read it
   * @param request - the call to make
   * @param okStatus - status to report when it goes through
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

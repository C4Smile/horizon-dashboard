// @sito/dashboard-app
import {
  BaseClient,
  type ImportPreviewDto,
  type QueryResult,
} from "@sito/dashboard-app";

// config
import config from "../../../config";

// types
import { Tables } from "api/types";

// lib
import {
  BaseCommonEntityDto,
  BaseEntityDto,
  BaseFilterDto,
  DeleteDto,
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
 * @description The shared BaseClient plus what only horizon has: row locking,
 * a picker list that reads the plain endpoint because the api exposes no
 * `/common` route, and the save wrappers the entity forms read their result
 * from.
 */
export class BaseApiClient<
  TDto extends BaseEntityDto,
  TCommonDto extends BaseCommonEntityDto,
  TAddDto,
  TUpdateDto extends DeleteDto,
  TFilter extends BaseFilterDto,
> extends BaseClient<
  Tables,
  TDto,
  TCommonDto,
  TAddDto,
  TUpdateDto,
  TFilter,
  ImportPreviewDto
> {
  /**
   * @param table - api endpoint this client reads
   */
  constructor(table: Tables) {
    super(table, config.apiUrl, config.user, true, {
      rememberKey: config.remember,
    });
  }

  /**
   * @description Lightweight list used to fill entity pickers. The backend has
   * no `/common` route, so this reads the regular list endpoint: the full dto
   * is a superset of the common one.
   * @param filters - entity filters
   * @returns the rows
   */
  async commonGet(filters?: TFilter): Promise<TCommonDto[]> {
    const result = await this.get(undefined, filters);
    return result.items as unknown as TCommonDto[];
  }

  /**
   * @description Whole list, for the pickers that page through everything
   * @returns Result list
   */
  async getAll(): Promise<QueryResult<TDto>> {
    return await this.get({ pageSize: 999 });
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

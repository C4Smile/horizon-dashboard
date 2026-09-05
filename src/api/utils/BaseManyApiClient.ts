// @sito/dashboard-app
import { APIClient, Methods, buildQueryUrl } from "@sito/dashboard-app";

// config
import config from "../../config";

// lib
import { BaseFilterDto, DeleteDto } from "lib";

// types
import { Tables } from "../types";

/**
 * @class BaseManyApiClient
 * @description Relations that hang off an entity, such as an entity's costs or
 * its requirements. These endpoints answer a bare array rather than a paged
 * result. The access token is carried by the shared APIClient.
 */
export class BaseManyApiClient<
  TDto extends DeleteDto,
  TAddDto,
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
   * @description Get all objects
   * @param id id of main entity
   * @param query query parameters
   * @returns Result list
   */
  async get(id: number, query?: TFilter): Promise<TDto[]> {
    return await this.api.doQuery<TDto[]>(
      buildQueryUrl(`${this.table}/${id}`, query),
      Methods.GET,
    );
  }

  /**
   *
   * @param id id of main entity
   * @param value data to insert
   * @returns inserted item
   */
  async insert(id: number, value: TAddDto): Promise<TDto> {
    return await this.api.post<TDto, TAddDto>(`${this.table}/${id}`, value);
  }

  /**
   *
   * @param data values to insert
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
   *
   * @param id id of main entity
   * @param ids id of relationship entities
   * @returns
   */
  async delete(id: number, ids: number[]): Promise<number> {
    return await this.api.delete(`${this.table}/${id}`, ids);
  }
}

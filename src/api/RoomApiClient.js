import { toSlug } from "some-javascript-utils";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

// services
import { makeRequest } from "../db/services";

// utils
import { SortOrder } from "../models/query/GenericFilter";

/**
 * @class RoomApiClient
 * @description RoomApiClient
 */
export class RoomApiClient {
  /**
   * @description Get all rooms
   * @param {string} sort attribute to order by
   * @param {string} order asc/desc
   * @returns {Promise<any[]>} Rooms
   */
  async getAll(sort = "lastUpdate", order = SortOrder.ASC) {
    const { error, data, status } = await makeRequest("rooms");
    if (error !== null) return { status, statusCode: status, message: error.message };
    return data;
  }

  /**
   * @description Get room by id
   * @param {string} id - Room id
   * @returns {Promise<any>} Room
   */
  async getById(id) {
    const { error, data, status } = await makeRequest(`rooms/${id}`);
    if (error !== null) return { status, statusCode: status, message: error.message };
    return data[0];
  }

  /**
   * @description Create room
   * @param {object} room - Room
   * @returns {Promise<any>} Room
   */
  async create(room) {
    // default values
    room.urlName = toSlug(room.title);
    // parsing html
    room.content = room.content ? draftToHtml(convertToRaw(room.content.getCurrentContent())) : null;
    const { error, data, status } = await makeRequest("rooms", "POST", room);
    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update room
   * @param {object} room - Room
   * @returns {Promise<any>} Room
   */
  async update(room) {
    // default values
    room.urlName = toSlug(room.title);
    // parsing html
    room.content = room.content ? draftToHtml(convertToRaw(room.content.getCurrentContent())) : null;
    // call service
    const { status, error } = await makeRequest(`rooms/${room.id}`, "PUT", room);
    if (error !== null) return { status, statusCode: error.code, message: error.message };
    return { error, status: status === 204 ? 201 : status };
  }

  /**
   * Remove elements by their id
   * @param {number[]} ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    for (const id of ids) {
      await makeRequest(`rooms/${id}`, "DELETE");
    }
    return { status: 204 };
  }
}

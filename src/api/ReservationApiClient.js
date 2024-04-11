import config from "../config";

// utils
import { fromLocal } from "../utils/local";

/**
 * @class ReservationApiClient
 * @description ReservationApiClient
 */
export class ReservationApiClient {
  /**
   * @description Get all countries
   * @returns Reservation list
   */
  async getAll() {
    const request = await fetch(`${config.apiUrl}reservation`, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    });
    return await request.json();
  }

  /**
   * @description Get reservation by id
   * @param {string} id - Reservation id
   * @returns Reservation by id
   */
  async getById(id) {
    const request = await fetch(`${config.apiUrl}reservation/${id}`, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    });
    return await request.json();
  }

  /**
   * @description Create reservation
   * @param {object} reservation - Reservation
   * @returns  Transaction status
   */
  async create(reservation) {
    const request = await fetch(`${config.apiUrl}reservation`, {
      method: "POST",
      body: JSON.stringify(reservation),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    });
    return request;
  }

  /**
   * @description Update reservation
   * @param {object} reservation - Reservation
   * @returns Transaction status
   */
  async update(reservation) {
    const request = await fetch(`${config.apiUrl}reservation/${reservation.id}`, {
      method: "PATCH",
      body: JSON.stringify(reservation),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    });
    return request;
  }

  /**
   * Remove elements by their id
   * @param {number[]} ids ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    for (const id of ids) {
      await fetch(`${config.apiUrl}reservation/${id}`, {
        method: "DELETE",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
        },
      });
    }
    return { status: 204 };
  }
}

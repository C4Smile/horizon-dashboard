import { fetchFromLocal, fetchSingleFromLocal, saveToLocal, deleteFromLocal } from "../db/connection";

/**
 * @class ReservationApiClient
 * @description ReservationApiClient
 */
export class ReservationApiClient {
  /**
   * @description Get all reservations
   * @param {string} attributes - Attributes
   * @returns Reservation list
   */
  async getAll(attributes = "*") {
    return await fetchFromLocal("reservation", attributes);
  }

  /**
   * @description Get reservation by id
   * @param {string} id - Reservation id
   * @param {string} attributes - Attributes
   * @returns Reservation by id
   */
  async getById(id, attributes = "*") {
    return await fetchSingleFromLocal("reservation", id, attributes);
  }

  /**
   * @description Create reservation
   * @param {object} reservation - Reservation
   * @returns  Transaction status
   */
  async create(reservation) {
    return await saveToLocal("reservation", reservation);
  }

  /**
   * @description Update reservation
   * @param {object} reservation - Reservation
   * @returns Transaction status
   */
  async update(reservation) {
    return await saveToLocal("reservation", reservation);
  }

  /**
   * Remove elements by their id
   * @param {number[]} ids ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    return await deleteFromLocal("reservation", ids);
  }
}

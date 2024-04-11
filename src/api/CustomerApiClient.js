import config from "../config";

// utils
import { fromLocal } from "../utils/local";

/**
 * @class CustomerApiClient
 * @description CustomerApiClient
 */
export class CustomerApiClient {
  /**
   * @description Get all countries
   * @returns Customer list
   */
  async getAll() {
    const request = await fetch(`${config.apiUrl}customer`, {
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
   * @description Get customer by id
   * @param {string} id - Customer id
   * @returns Customer by id
   */
  async getById(id) {
    const request = await fetch(`${config.apiUrl}customer/${id}`, {
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
   * @description Create customer
   * @param {object} customer - Customer
   * @returns  Transaction status
   */
  async create(customer) {
    const request = await fetch(`${config.apiUrl}customer`, {
      method: "POST",
      body: JSON.stringify(customer),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    });
    return request;
  }

  /**
   * @description Update customer
   * @param {object} customer - Customer
   * @returns Transaction status
   */
  async update(customer) {
    const request = await fetch(`${config.apiUrl}customer/${customer.id}`, {
      method: "PATCH",
      body: JSON.stringify(customer),
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
      await fetch(`${config.apiUrl}customer/${id}`, {
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

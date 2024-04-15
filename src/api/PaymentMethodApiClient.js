import config from "../config";

// utils
import { fromLocal } from "../utils/local";

/**
 * @class PaymentMethodApiClient
 * @description PaymentMethodApiClient
 */
export class PaymentMethodApiClient {
  /**
   * @description Get all payment methods
   * @returns PaymentMethod list
   */
  async getAll() {
    const request = await fetch(`${config.apiUrl}paymentMethod`, {
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
   * @description Get paymentMethod by id
   * @param {string} id - PaymentMethod id
   * @returns PaymentMethod by id
   */
  async getById(id) {
    const request = await fetch(`${config.apiUrl}paymentMethod/${id}`, {
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
   * @description Create paymentMethod
   * @param {object} paymentMethod - PaymentMethod
   * @returns  Transaction status
   */
  async create(paymentMethod) {
    const request = await fetch(`${config.apiUrl}paymentMethod`, {
      method: "POST",
      body: JSON.stringify(paymentMethod),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    });
    return request;
  }

  /**
   * @description Update paymentMethod
   * @param {object} paymentMethod - PaymentMethod
   * @returns Transaction status
   */
  async update(paymentMethod) {
    const request = await fetch(`${config.apiUrl}paymentMethod/${paymentMethod.id}`, {
      method: "PATCH",
      body: JSON.stringify(paymentMethod),
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
      await fetch(`${config.apiUrl}paymentMethod/${id}`, {
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

import config from "../config";

// utils
import { fromLocal } from "../utils/local";

/**
 * @class InvoiceApiClient
 * @description InvoiceApiClient
 */
export class InvoiceApiClient {
  /**
   * @description Get all countries
   * @returns Invoice list
   */
  async getAll() {
    const request = await fetch(`${config.apiUrl}invoice`, {
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
   * @description Get invoice by id
   * @param {string} id - Invoice id
   * @returns Invoice by id
   */
  async getById(id) {
    const request = await fetch(`${config.apiUrl}invoice/${id}`, {
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
   * @description Create invoice
   * @param {object} invoice - Invoice
   * @returns  Transaction status
   */
  async create(invoice) {
    const request = await fetch(`${config.apiUrl}invoice`, {
      method: "POST",
      body: JSON.stringify(invoice),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    });
    return request;
  }

  /**
   * @description Update invoice
   * @param {object} invoice - Invoice
   * @returns Transaction status
   */
  async update(invoice) {
    const request = await fetch(`${config.apiUrl}invoice/${invoice.id}`, {
      method: "PATCH",
      body: JSON.stringify(invoice),
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
      await fetch(`${config.apiUrl}invoice/${id}`, {
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

import { fetchFromLocal, fetchSingleFromLocal, saveToLocal, deleteFromLocal } from "../db/connection";

/**
 * @class InvoiceApiClient
 * @description InvoiceApiClient
 */
export class InvoiceApiClient {
  /**
   * @description Get all invoices
   * @param {string} attributes - Attributes
   * @returns Invoice list
   */
  async getAll(attributes = "*") {
    return await fetchFromLocal("invoice", attributes);
  }

  /**
   * @description Get invoice by id
   * @param {string} id - Invoice id
   * @param {string} attributes - Attributes
   * @returns Invoice by id
   */
  async getById(id, attributes = "*") {
    return await fetchSingleFromLocal("invoice", id, attributes);
  }

  /**
   * @description Create invoice
   * @param {object} invoice - Invoice
   * @returns  Transaction status
   */
  async create(invoice) {
    return await saveToLocal("invoice", invoice);
  }

  /**
   * @description Update invoice
   * @param {object} invoice - Invoice
   * @returns Transaction status
   */
  async update(invoice) {
    return await saveToLocal("invoice", invoice);
  }

  /**
   * Remove elements by their id
   * @param {number[]} ids ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    return await deleteFromLocal("invoice", ids);
  }
}

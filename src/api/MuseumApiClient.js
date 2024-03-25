import { CustomerApiClient } from "./CustomerApiClient";

/**
 * @class MuseumApiClient
 * @description MuseumApiClient
 */
export class MuseumApiClient {
  /**
   * @description constructor
   */
  constructor() {
    this.customer = new CustomerApiClient();
  }

  /**
   * @returns {CustomerApiClient} Customer
   */
  get Customer() {
    return this.customer;
  }
}

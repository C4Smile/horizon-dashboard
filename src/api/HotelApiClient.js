import { CustomerApiClient } from "./CustomerApiClient";

/**
 * @class HotelApiClient
 * @description HotelApiClient
 */
export class HotelApiClient {
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

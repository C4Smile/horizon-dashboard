import { CustomerApiClient } from "./CustomerApiClient";
import { RoomApiClient } from "./RoomApiClient";

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
    this.room = new RoomApiClient();
  }

  /**
   * @returns {CustomerApiClient} Customer
   */
  get Customer() {
    return this.customer;
  }

  /**
   * @returns {RoomApiClient} Room
   */
  get Room() {
    return this.Customer;
  }
}

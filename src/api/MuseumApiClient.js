import { CustomerApiClient } from "./CustomerApiClient";
import { RoomApiClient } from "./RoomApiClient";
import { UserApiClient } from "./UserApiClient";

/**
 * @class MuseumApiClient
 * @description MuseumApiClient
 */
export class MuseumApiClient {
  /**
   * @description constructor
   */
  constructor() {
    this.user = new UserApiClient();
    this.customer = new CustomerApiClient();
    this.room = new RoomApiClient();
  }

  /**
   * @returns {UserApiClient} Customer
   */
  get User() {
    return this.user;
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
    return this.room;
  }
}

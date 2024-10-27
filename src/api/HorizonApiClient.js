import { BuildingApiClient } from "./BuildingApiClient";
import { ResourceApiClient } from "./ResourceApiClient";
import { PushNotificationApiClient } from "./PushNotificationApiClient";
import { RoleApiClient } from "./RoleApiClient";
import { UserApiClient } from "./UserApiClient";
import { ImageApiClient } from "./ImageApiClient";
import { TechTypeApiClient } from "./TechTypeApiClient";
import { TechApiClient } from "./TechApiClient";

// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class HorizonApiClient
 * @description HorizonApiClient
 */
export class HorizonApiClient {
  /**
   * @description constructor
   */
  constructor() {
    this.building = new BuildingApiClient();
    this.resource = new ResourceApiClient();
    this.pushNotifications = new PushNotificationApiClient();
    this.role = new RoleApiClient();
    this.user = new UserApiClient();
    this.image = new ImageApiClient();
    this.tech = new TechApiClient();
    this.techType = new TechTypeApiClient();
  }

  /**
   * @description Get activity by id
   * @param {string} entity - Activity id
   * @returns {Promise<any>} some entity
   */
  async getEntity(entity) {
    const { data, error, status } = await makeRequest(
      `${entity}?sort=lastUpdate&order=desc&page=0&count=999`,
      "GET",
      null,
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   *
   * @param entity - entity
   * @returns string
   */
  async getChatBotContent(entity) {
    switch (entity) {
      default: //room
        return this.room.getCurrentContent();
    }
  }

  /**
   * @returns {ImageApiClient} Image
   */
  get Image() {
    return this.image;
  }

  /**
   * @returns {BuildingApiClient} Building
   */
  get Building() {
    return this.building;
  }

  /**
   * @returns {ResourceApiClient} Resource
   */
  get Resource() {
    return this.resource;
  }

  /**
   * @returns {PushNotificationApiClient} PushNotification
   */
  get PushNotification() {
    return this.pushNotifications;
  }

  /**
   * @returns {RoleApiClient} Role
   */
  get Role() {
    return this.role;
  }

  /**
   * @returns {UserApiClient} Customer
   */
  get User() {
    return this.user;
  }

  /**
   * @returns {TechApiClient} TechType
   */
  get Tech() {
    return this.tech;
  }

  /**
   * @returns {TechTypeApiClient} TechType
   */
  get TechType() {
    return this.techType;
  }
}

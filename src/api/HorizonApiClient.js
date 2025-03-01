import { BuildingApiClient } from "./BuildingApiClient";
import { ResourceApiClient } from "./ResourceApiClient";
import { PushNotificationApiClient } from "./PushNotificationApiClient";
import { RoleApiClient } from "./RoleApiClient";
import { UserApiClient } from "./UserApiClient";
import { ImageApiClient } from "./ImageApiClient";
import { TechTypeApiClient } from "./TechTypeApiClient";
import { TechApiClient } from "./TechApiClient";
import { BuildingTypeApiClient } from "./BuildingTypeApiClient.js";
import { SkillApiClient } from "./SkillApiClient.js";
import { ShipApiClient } from "./ShipApiClient.js";
import { CannonApiClient } from "./CannonApiClient.js";

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
    this.buildingType = new BuildingTypeApiClient();
    this.resource = new ResourceApiClient();
    this.pushNotifications = new PushNotificationApiClient();
    this.role = new RoleApiClient();
    this.user = new UserApiClient();
    this.image = new ImageApiClient();
    this.tech = new TechApiClient();
    this.techType = new TechTypeApiClient();
    this.skill = new SkillApiClient();
    this.ship = new ShipApiClient();
    this.cannon = new CannonApiClient();
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
   * @returns {BuildingTypeApiClient} Building
   */
  get BuildingType() {
    return this.buildingType;
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

  /**
   *
   * @returns {SkillApiClient} Skill
   */
  get Skill() {
    return this.skill;
  }

  /**
   *
   * @returns {ShipApiClient} Ship
   */
  get Ship() {
    return this.ship;
  }

  /**
   *
   * @returns {CannonApiClient} Ship
   */
  get Cannon() {
    return this.cannon;
  }
}

import { BuildingApiClient } from "./BuildingApiClient";
import { ResourceApiClient } from "./ResourceApiClient";
/* import { PushNotificationApiClient } from "./PushNotificationApiClient"; */
import { UserApiClient } from "./UserApiClient";
import { ImageApiClient } from "./ImageApiClient";
import { TechTypeApiClient } from "./TechTypeApiClient";
import { TechApiClient } from "./TechApiClient";
import { BuildingTypeApiClient } from "./BuildingTypeApiClient";
import { SkillApiClient } from "./SkillApiClient";
import { ShipApiClient } from "./ShipApiClient";
import { CannonApiClient } from "./CannonApiClient";
import { AuthApiClient } from "./AuthApiClient";

// services
import { makeRequest } from "./utils/";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class HorizonApiClient
 * @description HorizonApiClient
 */
export class HorizonApiClient {
  building: BuildingApiClient;
  buildingType: BuildingTypeApiClient;
  resource: ResourceApiClient;
  /* pushNotifications: PushNotificationApiClient; */
  user: UserApiClient;
  image: ImageApiClient;
  tech: TechApiClient;
  techType: TechTypeApiClient;
  skill: SkillApiClient;
  ship: ShipApiClient;
  cannon: CannonApiClient;
  auth: AuthApiClient;

  /**
   * @description constructor
   */
  constructor() {
    this.building = new BuildingApiClient();
    this.buildingType = new BuildingTypeApiClient();
    this.resource = new ResourceApiClient();
    /* this.pushNotifications = new PushNotificationApiClient(); */
    this.user = new UserApiClient();
    this.image = new ImageApiClient();
    this.tech = new TechApiClient();
    this.techType = new TechTypeApiClient();
    this.skill = new SkillApiClient();
    this.ship = new ShipApiClient();
    this.cannon = new CannonApiClient();
    this.auth = new AuthApiClient();
  }

  /**
   * @description Get activity by id
   * @param entity - Activity id
   * @returns some entity
   */
  async getEntity(entity: string) {
    const { data, error, status } = await makeRequest(
      `${entity}?sort=lastUpdate&order=desc&page=0&count=999`,
      "GET",
      null,
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      }
    );
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   * @returns Image
   */
  get Image() {
    return this.image;
  }

  /**
   * @returns Building
   */
  get Building() {
    return this.building;
  }

  /**
   * @returns Building
   */
  get BuildingType() {
    return this.buildingType;
  }

  /**
   * @returns Resource
   */
  get Resource() {
    return this.resource;
  }

  /**
   * @returns PushNotification
   */
  /* get PushNotification() {
    return this.pushNotifications;
  } */

  /**
   * @returns Customer
   */
  get User() {
    return this.user;
  }

  /**
   * @returns TechType
   */
  get Tech() {
    return this.tech;
  }

  /**
   * @returns TechType
   */
  get TechType() {
    return this.techType;
  }

  /**
   *
   * @returns Skill
   */
  get Skill() {
    return this.skill;
  }

  /**
   *
   * @returns Ship
   */
  get Ship() {
    return this.ship;
  }

  /**
   *
   * @returns Ship
   */
  get Cannon() {
    return this.cannon;
  }

  /**
   * @returns Auth
   */
  get Auth() {
    return this.auth;
  }
}

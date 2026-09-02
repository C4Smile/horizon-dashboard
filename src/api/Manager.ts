import { IManager } from "@sito/dashboard-app";

// clients
import { BuildingApiClient } from "./BuildingApiClient";
import { BuildingTypeApiClient } from "./BuildingTypeApiClient";
import { CannonApiClient } from "./CannonApiClient";
import { HorizonAuthClient } from "./HorizonAuthClient";
import { ImageApiClient } from "./ImageApiClient";
import { ResourceApiClient } from "./ResourceApiClient";
import { ShipApiClient } from "./ShipApiClient";
import { SkillApiClient } from "./SkillApiClient";
import { TechApiClient } from "./TechApiClient";
import { TechTypeApiClient } from "./TechTypeApiClient";
import { UserApiClient } from "./UserApiClient";

// config
import config from "../config";

/**
 * @class Manager
 * @description root manager, exposes every domain client plus the shared auth
 * client the dashboard-app providers consume
 */
export class Manager extends IManager {
  auth: HorizonAuthClient;

  building: BuildingApiClient = new BuildingApiClient();
  buildingType: BuildingTypeApiClient = new BuildingTypeApiClient();
  cannon: CannonApiClient = new CannonApiClient();
  image: ImageApiClient = new ImageApiClient();
  resource: ResourceApiClient = new ResourceApiClient();
  ship: ShipApiClient = new ShipApiClient();
  skill: SkillApiClient = new SkillApiClient();
  tech: TechApiClient = new TechApiClient();
  techType: TechTypeApiClient = new TechTypeApiClient();
  user: UserApiClient = new UserApiClient();

  constructor() {
    super(config.apiUrl, config.user, {
      rememberKey: config.remember,
    });
    this.auth = new HorizonAuthClient(config.apiUrl, config.user, {
      rememberKey: config.remember,
    });
  }

  get Auth(): HorizonAuthClient {
    return this.auth;
  }

  get Building(): BuildingApiClient {
    return this.building;
  }

  get BuildingType(): BuildingTypeApiClient {
    return this.buildingType;
  }

  get Cannon(): CannonApiClient {
    return this.cannon;
  }

  get Image(): ImageApiClient {
    return this.image;
  }

  get Resource(): ResourceApiClient {
    return this.resource;
  }

  get Ship(): ShipApiClient {
    return this.ship;
  }

  get Skill(): SkillApiClient {
    return this.skill;
  }

  get Tech(): TechApiClient {
    return this.tech;
  }

  get TechType(): TechTypeApiClient {
    return this.techType;
  }

  get User(): UserApiClient {
    return this.user;
  }
}

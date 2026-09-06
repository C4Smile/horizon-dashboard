import { IManager } from "@sito/dashboard-app";

// clients
import { BuildingApiClient } from "../../features/buildings/api/BuildingApiClient";
import { BuildingTypeApiClient } from "../../features/buildingTypes/api/BuildingTypeApiClient";
import { CannonApiClient } from "../../features/cannons/api/CannonApiClient";
import { HorizonAuthClient } from "api/HorizonAuthClient";
import { ImageApiClient } from "api/ImageApiClient";
import { ResourceApiClient } from "../../features/resources/api/ResourceApiClient";
import { RoleApiClient } from "api/RoleApiClient";
import { ShipApiClient } from "../../features/ships/api/ShipApiClient";
import { SkillApiClient } from "../../features/skills/api/SkillApiClient";
import { TechApiClient } from "../../features/techs/api/TechApiClient";
import { TechTypeApiClient } from "../../features/techTypes/api/TechTypeApiClient";
import { UserApiClient } from "../../features/users/api/UserApiClient";

// config
import config from "../../config";

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
  role: RoleApiClient = new RoleApiClient();
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

  get Role(): RoleApiClient {
    return this.role;
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

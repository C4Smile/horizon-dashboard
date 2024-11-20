import { Entity } from "../entity/Entity";

/**
 * @class Ship
 * @description Represents a ship
 */
export class Ship extends Entity {
  name = "";
  capacity = 0;
  baseSpeed = 0;
  crew = 0;
  creationTime = 0;
  urlName = "";
  description = "";
  imageId = 0;

  static className = "ship";
  static costs = "shipCosts";
  static upkeeps = "shipUpkeeps";
  static techRequirement = "shipReqTechs";
  static shipRequirement = "shipReqBuildings";

  /**
   * @param {number} id - Ship id
   * @param {string} name - Ship name
   * @param {Date} dateOfCreation - Ship date of creation
   * @param {Date} lastUpdate - Ship last update
   * @param {boolean} deleted - Ship deleted
   */
  constructor(
    id = 0,
    name = "",
    dateOfCreation = new Date(),
    lastUpdate = new Date(),
    deleted = false,
  ) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.name = name;
  }
}
import { Entity } from "../entity/Entity";

/**
 * @class Skill
 * @description Represents a skill
 */
export class Skill extends Entity {
  name = "";
  urlName = "";
  description = "";
  image = {};

  static className = "skill";

  /**
   * @param {number} id - Skill id
   * @param {string} name - Skill name
   * @param {Date} dateOfCreation - Skill date of creation
   * @param {Date} lastUpdate - Skill last update
   * @param {boolean} deleted - Skill deleted
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

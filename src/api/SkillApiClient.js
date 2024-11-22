import { toSlug } from "some-javascript-utils";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

// services
import { makeRequest } from "../db/services";

// base
import { BaseApiClient } from "./utils/BaseApiClient";

// types
import { Skill } from "../models/skill/Skill.js";
import { Photo } from "../models/photo/Photo.js";

/**
 * @class SkillApiClient
 * @description SkillApiClient
 */
export class SkillApiClient extends BaseApiClient {
  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "skills";
  }

  /**
   * @description Create skill
   * @param {Skill} skill - Skill
   * @param {Photo} photo - Photo
   * @returns Transaction status
   */
  async create(skill, photo) {
    // default values
    skill.urlName = toSlug(skill.name);
    // parsing html
    skill.description = draftToHtml(convertToRaw(skill.description.getCurrentContent()));
    // saving photo
    if (photo) skill.image = photo;
    // call service
    const { error, data, status } = await makeRequest("skills", "POST", skill, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, error: { message: error.message } };

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update skill
   * @param {Skill} skill - Skill
   * @param {Photo} photo - photo
   * @returns Transaction status
   */
  async update(skill, photo) {
    // default values
    skill.urlName = toSlug(skill.name);
    // parsing html
    skill.description = draftToHtml(convertToRaw(skill.description.getCurrentContent()));
    // saving photo
    if (photo) skill.image = photo;
    // call service
    const { status, error } = await makeRequest(
      `skills/${skill.id}`,
      "PATCH",
      {
        ...skill,
        lastUpdate: new Date().toISOString(),
      },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    if (error !== null) return { status, error: { message: error.message } };

    return { error, status: status === 204 ? 201 : status };
  }
}

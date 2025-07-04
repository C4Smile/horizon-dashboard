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
import { Skill } from "../lib/models/skill/Skill.js";
import { Photo } from "../lib/models/photo/Photo.js";

// lib
import {
  SkillDto,
  SkillCommonDto,
  SkillAddDto,
  SkillUpdateDto,
  SkillFilterDto,
} from "lib";
import { Tables } from "./types/dbUtils.js";

/**
 * @class SkillApiClient
 * @description SkillApiClient
 */
export class SkillApiClient extends BaseApiClient<
  SkillDto,
  SkillCommonDto,
  SkillAddDto,
  SkillUpdateDto,
  SkillFilterDto
> {
  /**
   * create base api client
   */
  constructor() {
    super(Tables.Skills);
  }

  /**
   * @description Create skill
   * @param skill - Skill
   * @param photo - Photo
   * @returns Transaction status
   */
  async create(skill: Skill, photo: Photo) {
    // default values
    skill.urlName = toSlug(skill.name);
    // parsing html
    skill.description = draftToHtml(
      convertToRaw(skill.description.getCurrentContent())
    );
    // saving photo
    if (photo) skill.image = photo;
  }

  /**
   * @description Update skill
   * @param skill - Skill
   * @param photo - photo
   * @returns Transaction status
   */
  async update(skill: Skill, photo: Photo) {
    // default values
    skill.urlName = toSlug(skill.name);
    // parsing html
    skill.description = draftToHtml(
      convertToRaw(skill.description.getCurrentContent())
    );
    // saving photo
    if (photo) skill.image = photo;
  }
}

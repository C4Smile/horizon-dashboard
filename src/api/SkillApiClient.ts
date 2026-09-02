import { toSlug } from "some-javascript-utils";

// base
import { BaseApiClient } from "./utils/";
import { FormPhoto, parseHtml, parseImage } from "./utils/formToDto";

// types
import { Tables } from "./types/";

// lib
import {
  SkillDto,
  SkillCommonDto,
  SkillAddDto,
  SkillUpdateDto,
  SkillFilterDto,
} from "lib";

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
   * @description Maps the form values to what the api stores
   * @param skill - form values
   * @param photo - ImageUploader state
   * @returns skill dto
   */
  private toDto(skill: SkillDto, photo: FormPhoto) {
    return {
      name: skill.name,
      urlName: toSlug(skill.name),
      description: parseHtml(skill.description),
      ...parseImage(photo),
    };
  }

  /**
   * @description Create skill
   * @param skill - Skill
   * @param photo - Photo
   * @returns Transaction status
   */
  async create(skill: SkillDto, photo: FormPhoto) {
    return await this.saveNew(this.toDto(skill, photo) as SkillAddDto);
  }

  /**
   * @description Update skill
   * @param skill - Skill
   * @param photo - photo
   * @returns Transaction status
   */
  async update(skill: SkillDto, photo: FormPhoto) {
    return await this.saveExisting({
      id: skill.id,
      ...this.toDto(skill, photo),
    } as SkillUpdateDto);
  }
}

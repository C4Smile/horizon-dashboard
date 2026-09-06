
// base
import { BaseApiClient } from "api/utils";
import { FormPhoto, parseHtml, parseImage, parseNumber } from "api/utils/formToDto";

// types
import { Tables } from "api/types";

// lib
import { FormValues } from "lib";
import { SkillAddDto, SkillCommonDto, SkillDto, SkillFilterDto, SkillUpdateDto } from "../lib";

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
  private toDto(skill: FormValues<SkillDto>, photo: FormPhoto) {
    return {
      name: skill.name ?? "",
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
  async createFromForm(skill: FormValues<SkillDto>, photo: FormPhoto) {
    return await this.saveNew(this.toDto(skill, photo));
  }

  /**
   * @description Update skill
   * @param skill - Skill
   * @param photo - photo
   * @returns Transaction status
   */
  async updateFromForm(skill: FormValues<SkillDto>, photo: FormPhoto) {
    return await this.saveExisting({
      id: parseNumber(skill.id),
      ...this.toDto(skill, photo),
    });
  }
}

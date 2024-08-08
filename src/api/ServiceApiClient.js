import { toSlug } from "some-javascript-utils";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

// entity
import { Service } from "../models/service/Service";

// services
import { makeRequest } from "../db/services";

// utils
import { parseManyToMany } from "./utils/relationships";
import { fromLocal } from "../utils/local";

// config
import config from "../config";

// base
import { BaseApiClient } from "./utils/BaseApiClient";

// apis
import { ServiceSchedulesApiClient } from "./ServiceSchedulesApiClient";

/**
 * @class ServiceApiClient
 * @description ServiceApiClient
 */
export class ServiceApiClient extends BaseApiClient {
  serviceSchedules = new ServiceSchedulesApiClient();

  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "service";
  }

  /**
   * @description Create service
   * @param {Service} service - Service
   * @param {object} photo - Service photo
   * @returns {Promise<Service>} Service
   */
  async create(service, photo) {
    // default values
    service.urlName = toSlug(service.name);
    // parsing html
    service.content = service.content
      ? draftToHtml(convertToRaw(service.content.getCurrentContent()))
      : "";
    // parsing places
    // parsing schedule
    const scheduleToKeep = parseManyToMany(
      "id",
      service.newServiceHasSchedule,
      service.serviceHasSchedule,
    );
    // cleaning relation ships
    delete service.newServiceHasSchedule;
    // saving image
    if (photo) service.imageId = photo.id;
    // call service
    const { error, data, status } = await makeRequest(this.baseUrl, "POST", service, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, error: { message: error.message } };
    // saving schedule
    for (const schedule of scheduleToKeep)
      await this.serviceSchedules.create({
        serviceId: data[0].id,
        description: schedule.description,
        date: schedule.date,
      });

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update service
   * @param {Service} service - Service
   * @param {object} photo - Photo to keep
   * @returns {Promise<Service>} Service
   */
  async update(service, photo) {
    // default values
    service.urlName = toSlug(service.name);
    // parsing html
    service.content = service.content
      ? draftToHtml(convertToRaw(service.content.getCurrentContent()))
      : "";
    // saving photo
    if (photo) service.imageId = photo.id;
    // parsing schedule
    const scheduleToKeep = parseManyToMany(
      "id",
      service.newServiceHasSchedule,
      service.serviceHasSchedule,
    );
    // cleaning relation ships
    delete service.serviceHasSchedule;
    delete service.newServiceHasSchedule;
    // call service
    // call service
    const { status, error } = await makeRequest(
      `${this.baseUrl}/${service.id}`,
      "PATCH",
      {
        ...service,
        lastUpdate: new Date().toISOString(),
      },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    if (error !== null) return { status, error: { message: error.message } };
    // saving schedule
    for (const schedule of scheduleToKeep) {
      if (schedule.delete) await this.serviceSchedules.deleteSingle(schedule.id);
      await this.serviceSchedules.create({
        serviceId: service.id,
        description: schedule.description,
        date: schedule.date,
      });
    }
    return { error, status: status === 204 ? 201 : status };
  }
}

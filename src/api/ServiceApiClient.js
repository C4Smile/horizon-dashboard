import { toSlug } from "some-javascript-utils";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

// entity
import { Service } from "../models/service/Service";

// services
import { makeRequest } from "../db/services";

// utils
import { SortOrder } from "../models/query/GenericFilter";
import { parseManyToMany } from "./utils/relationships";
import { fromLocal } from "../utils/local";

// config
import config from "../config";

// apis
import { ServiceSchedulesApiClient } from "./ServiceSchedulesApiClient";

/**
 * @class ServiceApiClient
 * @description ServiceApiClient
 */
export class ServiceApiClient {
  serviceSchedules = new ServiceSchedulesApiClient();

  /**
   * @description Get all service
   * @param {string} sort attribute to order by
   * @param {string} order asc/desc
   * @returns {Promise<Service[]>} Services
   */
  async getAll(sort = "lastUpdate", order = SortOrder.ASC) {
    const { error, data, status } = await makeRequest(`service?sort=${sort}&order=${order}`);
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   * @description Get service by id
   * @param {string} id - Service id
   * @returns {Promise<Service>} Service
   */
  async getById(id) {
    const { error, data, status } = await makeRequest(`service/${id}`);
    if (error !== null) return { status, error: { message: error.message } };
    return data[0];
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
      : null;
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
    const { error, data, status } = await makeRequest("service", "POST", service, {
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
      : null;
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
      `service/${service.id}`,
      "PUT",
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

  /**
   * Remove elements by their id
   * @param {number[]} ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    for (const id of ids)
      await makeRequest(`service/${id}`, "DELETE", null, {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      });
    return { status: 204 };
  }
}

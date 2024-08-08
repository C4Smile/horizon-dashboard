import { toSlug } from "some-javascript-utils";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

// services
import { makeRequest } from "../db/services";

// utils
import { parseManyToMany } from "./utils/relationships";
import { fromLocal } from "../utils/local";

// apis
import { TagsEventsApiClient } from "./TagsEventsApiClient";
import { ImagesEventsApiClient } from "./ImagesEventsApiClient";
import { EventSchedulesApiClient } from "./EventSchedulesApiClient";
import { EventLinksApiClient } from "./EventLinksApiClient";

// config
import config from "../config";

// base
import { BaseApiClient } from "./utils/BaseApiClient";

/**
 * @class EventApiClient
 * @description EventApiClient
 */
export class EventApiClient extends BaseApiClient {
  tagsEvents = new TagsEventsApiClient();
  photosEvents = new ImagesEventsApiClient();
  eventSchedules = new EventSchedulesApiClient();
  eventLinks = new EventLinksApiClient();

  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "event";
  }

  /**
   * @description Create event
   * @param {Event} event - Event
   * @param {object[]} photos - Event photos
   * @returns {Promise<Event>} Event
   */
  async create(event, photos) {
    // default values
    event.urlName = toSlug(event.title);
    // parsing html
    event.content = event.content ? draftToHtml(convertToRaw(event.content.getCurrentContent())) : "";
    // parsing links
    const linksToKeep = parseManyToMany("linkId", event.newEventHasLink, event.eventHasLink);
    // parsing schedule
    const scheduleToKeep = parseManyToMany("id", event.newEventHasSchedules, event.eventHasSchedules);
    // parsing tags
    const tagsToKeep = event.tagsId.map((tag) => tag.id);
    // cleaning relation ships
    delete event.tagsId;
    delete event.newEventHasLink;
    delete event.newEventHasSchedules;
    // call service
    const { error, data, status } = await makeRequest(this.baseUrl, "POST", event, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, error: { message: error.message } };
    // adding relationships
    // saving links
    for (const link of linksToKeep)
      await this.eventLinks.create({ eventId: data[0].id, linkId: link.linkId, url: link.url });

    // saving schedule
    for (const schedule of scheduleToKeep)
      await this.eventSchedules.create({
        eventId: data[0].id,
        description: schedule.description,
        date: schedule.date,
      });
    // saving tags
    for (const tag of tagsToKeep) await this.tagsEvents.create({ eventId: data[0].id, tagId: tag });
    // saving image
    if (photos)
      for (const photo of photos)
        await this.photosEvents.create({ eventId: data[0].id, imageId: photo.id });

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update event
   * @param {Event} event - Event
   * @param {object[]} photos - Photos to keep
   * @returns {Promise<Event>} Event
   */
  async update(event, photos) {
    // default values
    event.urlName = toSlug(event.title);
    // parsing html
    event.content = event.content ? draftToHtml(convertToRaw(event.content.getCurrentContent())) : "";
    // parsing links
    const linksToKeep = parseManyToMany("linkId", event.newEventHasLink, event.eventHasLink);
    // parsing schedule
    const scheduleToKeep = parseManyToMany("id", event.newEventHasSchedules, event.eventHasSchedules);
    // parsing tags
    const tagsToKeep = parseManyToMany("tagId", event.tagsId, event.eventHasTag);
    // saving photos
    const newPhotos = [];
    for (const newPhoto of photos) {
      const found = event.eventHasImage.some((value) => value.imageId.id === newPhoto.id);
      if (!found) newPhotos.push(newPhoto);
    }
    // cleaning relation ships
    delete event.tagsId;
    delete event.eventHasTag;
    delete event.eventHasImage;
    delete event.newEventHasLink;
    delete event.eventHasLink;
    delete event.eventHasSchedules;
    delete event.newEventHasSchedules;
    // call service
    const { status, error } = await makeRequest(
      `${this.baseUrl}/${event.id}`,
      "PATCH",
      {
        ...event,
        lastUpdate: new Date().toISOString(),
      },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    if (error !== null) return { status, error: { message: error.message } };
    // do relationship updates
    // saving links
    for (const link of linksToKeep) {
      if (link.delete) await this.eventSchedules.deleteByUrl(link.linkId, link.url);
      else await this.eventLinks.create({ eventId: event.id, linkId: link.linkId, url: link.url });
    }
    // saving schedule
    for (const schedule of scheduleToKeep) {
      if (schedule.delete) await this.eventSchedules.deleteSingle(schedule.id);
      await this.eventSchedules.create({
        eventId: event.id,
        description: schedule.description,
        date: schedule.date,
      });
    }
    // saving tags
    for (const tag of tagsToKeep) {
      if (tag.delete) this.tagsEvents.deleteByEvent(tag.tagId, event.id);
      else this.tagsEvents.create({ eventId: event.id, tagId: tag.tagId });
    }
    // saving photo
    if (newPhotos.length)
      for (const newPhoto of newPhotos)
        this.photosEvents.create({ eventId: event.id, imageId: newPhoto.id });
    return { error, status: status === 204 ? 201 : status };
  }
}

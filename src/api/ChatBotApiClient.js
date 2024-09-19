// db
import { makeRequest } from "../db/services";

// config
import config from "../config";

// utils
import { fromLocal } from "../utils/local";

/**
 * @class Message
 */
export class Message {
  id = undefined;
  message = "";
  userId = 0;
  sentDate = new Date();
}

/**
 * @class ChatBotApiClient
 * @description ChatBotApiClient
 */
export class ChatBotApiClient {
  /**
   * create base api client
   */
  constructor() {
    this.baseUrl = "chatBot";
  }

  /**
   * Load previous context
   * @returns data
   */
  async loadContext() {
    const { data, error, status } = await makeRequest(`${this.baseUrl}`, "GET", null, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    })
      .from("chatBotSettings")
      .select("*");
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   *
   * @param {string} instructions - given instructions to the bot
   * @param {number} id - instructions id
   * @returns previous context
   */
  async updateContext(instructions, id) {
    try {
      const response = await makeRequest(
        `${config.chatBotUrl}ia-instructions/${id}`,
        "PUT",
        {
          data: { instructions },
        },
        {
          Authorization: `Bearer ${config.chatBotToken}`,
        },
      );

      const { status, error } = response;

      if (error !== null) return { status, error: { message: error.message } };

      const result = await makeRequest(`${this.baseUrl}/update`, "POST", instructions, {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      });

      if (result.error !== null)
        return { status: result.status, error: { message: result.error.message } };

      return { status: 200 };
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  /**
   *
   * @param {string} instructions - given instructions to the bot
   * @returns result
   */
  async createContext(instructions) {
    try {
      const response = await makeRequest(
        `${config.chatBotUrl}ia-instructions`,
        "POST",
        {
          instructions,
          response: "Entiendo solo responderé sobre la base de lo descrito anteriormente",
          entity: 1,
        },
        {
          Authorization: `Bearer ${config.chatBotToken}`,
        },
      );

      const { data, status, error } = response;
      let dataToSave = data;

      if (error !== null) return { status, error: { message: error.message } };

      if (data.data) dataToSave = data;
      dataToSave.dateOfCreation = dataToSave.createdAt;
      delete dataToSave.response;
      delete dataToSave.createdAt;
      delete dataToSave.updatedAt;
      delete dataToSave.publishedAt;

      const result = await makeRequest(`${this.baseUrl}`, "POST", dataToSave, {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      });

      if (result.error !== null)
        return { status: result.status, error: { message: result.error.message } };

      return { status: 200 };
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }
}

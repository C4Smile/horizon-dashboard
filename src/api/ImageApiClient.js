// config
import config from "../config";

// utils
import { fromLocal } from "../utils/local";

// services
import { makeRequest } from "../db/services";

// types
import { Photo } from "../models/photo/Photo.js";

/**
 * ImageApiClient
 */
export class ImageApiClient {
  /**
   * Generate image folder
   * @param {string} dirPath folder path
   * @returns {string} folder path
   */
  generateFolder(dirPath) {
    return `${config.appName}/${dirPath.toLowerCase()}`;
  }

  /**
   * Save photo into database
   * @param {Photo} photo photo object
   * @returns {Promise<{data: any, error: any}>} response
   */
  async insertImage(photo) {
    const { error, data, status } = await makeRequest("images", "POST", photo, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * Read file as base64
   * @param {File} file file to read
   * @returns {Promise<string>} base64 string
   */
  async readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   *
   * @param {Photo[]} photos list of images
   * @param {string} folder where to save images
   * @returns {Promise<any[]>} uploaded images
   */
  async insertImages(photos, folder) {
    const uploads = [];

    for (const photo of photos) {
      const base64 = await this.readFileAsBase64(photo);
      const { data, error } = await makeRequest(
        "images",
        "POST",
        { base64, folder, fileName: photo.name },
        {
          Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
        },
      );

      if (error) {
        // eslint-disable-next-line no-console
        console.error(error.message);
        return { error };
      }
      uploads.push({ fileId: data[0].fileName, url: data[0].url, id: data[0].id });
    }

    return uploads;
  }

  /**
   * Deletes an image
   * @param {string} id image id
   * @returns {Promise<any>} response
   */
  async deleteImage(id) {
    const { error } = await makeRequest(`images/${id}`, "DELETE", null, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error) return error.status;
    return 200;
  }
}

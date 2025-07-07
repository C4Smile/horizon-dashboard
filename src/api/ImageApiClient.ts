// config
import config from "../config.js";

// utils
import { fromLocal } from "../utils/local.js";

// services
import { makeRequest } from "./utils/";

// types
import { BlobDto, PhotoDto } from "lib";

/**
 * ImageApiClient
 */
export class ImageApiClient {
  /**
   * Generate image folder
   * @param dirPath folder path
   * @returns folder path
   */
  generateFolder(dirPath: string) {
    return `${config.appName}/${dirPath.toLowerCase()}`;
  }

  /**
   * Save photo into database
   * @param photo photo object
   * @returns response
   */
  async insertImage(photo: BlobDto) {
    const { error, data, status } = await makeRequest("images", "POST", photo, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * Read file as base64
   * @param file file to read
   * @returns base64 string
   */
  async readFileAsBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Read file as base64
   * @param files files to read
   * @returns base64 string
   */
  async readFilesAsBase64(files: FileList[]) {
    const parsed = [];
    for (const file of files) {
      const parsedFile = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file as unknown as File);
      });
      parsed.push(parsedFile);
    }
    return parsed;
  }

  /**
   *
   * @param photos list of images
   * @param folder where to save images
   * @returns uploaded images
   */
  async insertImages(photos: File[], folder: string) {
    const uploads = [];

    for (const photo of photos) {
      const base64 = await this.readFileAsBase64(photo);
      const { data, error } = await makeRequest<BlobDto, PhotoDto[]>(
        "images",
        "POST",
        { base64: base64 as string, folder, fileName: photo.name },
        {
          Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
        }
      );

      if (error) {
        console.error(error.message);
        return { error };
      }
      uploads.push({
        fileId: data[0].fileName,
        url: data[0].url,
        id: data[0].id,
      });
    }

    return uploads;
  }

  /**
   * Deletes an image
   * @param id image id
   * @returns response
   */
  async deleteImage(id: string) {
    const { error } = await makeRequest(`images/${id}`, "DELETE", null, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error) return error.status;
    return 200;
  }
}

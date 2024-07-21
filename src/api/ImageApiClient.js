// import imagekit from "imagekit";

// config
import config from "../config";

// db
import supabase from "../db/connection";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

/**
 * Image kit io auth response type
 */
// eslint-disable-next-line no-unused-vars
class ImageKitIoAuthResponse {
  signature = "";
  expire = "";
  token = "";
}

/**
 * ImageKitIoApiClient
 */
export class ImageKitIoApiClient {
  /**
   *
   * @returns {ImageKitIoAuthResponse} imagekit auth response
   */
  async authenticator() {
    try {
      // You can also pass headers and validate the request source in the backend, or you can use headers for any other use case.
      const response = await fetch(images, {
        headers,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  }

  /**
   * Generate image folder
   * @param {string} dirPath 
   * @returns
   */
  generateFolder(dirPath) {
    return `${config.appName}/${dirPath.toLowerCase()}`;
  }

  /**
   * Save photo into supabase
   * @param {object} photo
   */
  async insertImage(photo) {
    const { data, error } = await supabase
      .from("images")
      .insert({ url: photo.url, fileName: photo.fileId })
      .select("id");
    return { data, error };
  }

  /**
   * Read file as base64
   * @param {File} file
   * @returns {Promise<string>}
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
   * @param {object[]} photos list of images
   * @param {string} folder where to save images
   * @returns
   */
  async insertImages(photos, folder) {
    const uploads = [];

    for (const photo of photos) {
      const base64 = await this.readFileAsBase64(photo);
      const response = await fetch(imagekitUploadUrl, {
        headers,
        method: "POST",
        body: JSON.stringify({ base64, folder, fileName: photo.name }),
      });
      const result = await response.json();
      if (!result.error) {
        const { url, fileId } = result;
        const { data, error } = await this.insertImage({ url, fileId });
        if (!error) uploads.push({ fileId, url, id: data[0].id });
        else {
          await this.deleteImage(fileId);
          // eslint-disable-next-line no-console
          console.error(error.details);
        }
      }
    }

    return uploads;
  }

  /**
   * Deletes an image
   * @param {string} id
   * @returns
   */
  async deleteImage(id) {
    try {
      const response = await fetch(imagekitDeleteUrl, {
        headers,
        method: "POST",
        body: JSON.stringify({ imageId: id }),
      });
      const result = response.status;
      if (result === 200) {
        const { error } = await supabase.from("images").delete().eq("fileName", id);
        return error;
      }
      return 200;
    } catch (err) {
      return err;
    }
  }
}

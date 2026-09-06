/**
 * ImageApiClient
 * @description Reads files the ImageUploader picks. Images themselves travel
 * inside the entity dto as a base64 blob and the server creates them, so this
 * client makes no requests of its own.
 */
export class ImageApiClient {
  /**
   * Read file as base64
   * @param file file to read
   * @returns base64 string
   */
  async readFileAsBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result), {
        once: true,
      });
      reader.addEventListener("error", reject, { once: true });
      reader.readAsDataURL(file);
    });
  }

  /**
   * Read files as base64
   * @param files files to read
   * @returns base64 strings
   */
  async readFilesAsBase64(files: FileList) {
    const parsed = [];
    for (const file of files) {
      const parsedFile = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => resolve(reader.result), {
          once: true,
        });
        reader.addEventListener("error", reject, { once: true });
        reader.readAsDataURL(file);
      });
      parsed.push(parsedFile);
    }
    return parsed;
  }
}

/**
 * Convert a string from camel case to sentence case
 * @param {string} word
 */
export function camelCaseToSentence(word) {
  // Use a regular expression to split the word by capital letters
  // and then join the resulting array with spaces
  return word
    .replace(/([A-Z])/g, " $1")
    .trim()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Extract keys from an object
 * @param {object} obj - object to extract keys from
 * @param {string[]} except - keys to exclude
 * @returns - keys from the object
 */
export function extractKeysFromObject(obj, except) {
  const keys = Object.getOwnPropertyNames(obj);
  return keys.filter((key) => !except.includes(key));
}

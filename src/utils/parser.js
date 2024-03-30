/**
 * Convert a string from camel case to sentence case
 * @param {string} word - string to convert
 * @returns - sentence case string
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
 * Turns first character of a string to uppercase
 * @param {string} word - string to convert
 * @returns - capitalize string
 */
export function toCapitalize(word) {
  return `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`;
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

/**
 * Converts an Enum type to a list of EnumListItems[] (i.e. tuples of {id-name})
 * This method is mostly used with Select UI controls.
 * @param enumType Enum type
 * @returns EnumListItems list
 */
export const getEnumIdValueTuple = (enumType) => {
  // If the Enum has values of type number, Object.values() return both the enum
  // keys (as strings) AND values (as numbers). If Enum has type string, it only returns the keys as strings.
  //
  // In order to deal with both cases, we try to intersect the arrays returned by Object.keys() and Object.values()
  // so that we can determine exactly what is a key and what is a value based. If Enum has values of
  // type number, intersecting keys() and values() and keeping only the elements in the values() array
  // will gives us the true values. If Enum has values of type strings, that intersection will return an empty
  // array, so we can confidently keep the values() without any further treatment.

  const keys = Object.keys(enumType).filter((x) => Object.values(enumType).includes(x));

  let values = Object.values(enumType).filter((x) => !Object.keys(enumType).includes(x));
  if (!values.length) {
    values = Object.values(enumType);
  }

  return keys.map((k) => {
    return { id: k, value: toCapitalize(k) };
  });
};

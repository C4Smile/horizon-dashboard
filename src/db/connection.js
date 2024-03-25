/**
 * Save to db
 * @param {string} k - key
 * @param {object} d - data
 * @returns information of the transaction
 */
export const saveToLocal = async (k, d) => {
  try {
    const fromLocal = localStorage.getItem(k);
    if (fromLocal) {
      const parsedList = JSON.parse(fromLocal);
      parsedList.push({ ...d, id: parsedList.length });
      localStorage.setItem(k, JSON.stringify(parsedList));
    } else {
      localStorage.setItem(k, JSON.stringify([d]));
    }
    return { error: null, status: 200 };
  } catch (err) {
    return { error: err, status: 500 };
  }
};

/**
 * Fetch from db
 * @param {string} k - key
 * @param {string} query - query
 * @returns result of the query
 */
export const fetchFromLocal = async (k, query) => {
  try {
    const fromLocal = localStorage.getItem(k);
    let data = [];
    if (fromLocal) {
      const parsedList = JSON.parse(fromLocal);
      if (query) {
        // do query here
      }
      data = parsedList;
    }
    return { error: null, status: 200, data };
  } catch (err) {
    return { error: err, status: 500 };
  }
};

/**
 * Fetch a single element by id
 * @param {string} k - key
 * @param {string} id - id
 * @param {string} query - query
 * @returns A single element
 */
export const fetchSingleFromLocal = async (k, id, query) => {
  try {
    const fromLocal = localStorage.getItem(k);
    let data = [];
    if (fromLocal) {
      const parsedList = JSON.parse(fromLocal);
      if (query) {
        // do query here
      }
      const filtered = parsedList.filter((item) => item.id === id)[0];
      data = filtered;
    }
    return { error: null, status: 200, data };
  } catch (err) {
    return { error: err, status: 500 };
  }
};

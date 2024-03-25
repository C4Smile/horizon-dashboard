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
      if (d.id === undefined) d.id = parsedList.length;
      // looking for update
      const filtered = parsedList.findIndex((item) => item.id === d.id);
      if (filtered >= 0) parsedList[filtered] = d;
      else parsedList.push(d);
      localStorage.setItem(k, JSON.stringify(parsedList));
    } else {
      localStorage.setItem(k, JSON.stringify([{ ...d, id: 0 }]));
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
      const filtered = parsedList.find((item) => item.id === Number(id));
      data = filtered;
    }
    return { error: null, status: 200, data };
  } catch (err) {
    return { error: err, status: 500 };
  }
};

/**
 * Remove 'n' elements by their id
 * @param {string} k - key
 * @param {number[]} ids - array of ids
 * @returns transaction status
 */
export const deleteFromLocal = async (k, ids) => {
  try {
    const fromLocal = localStorage.getItem(k);
    if (fromLocal) {
      const parsedList = JSON.parse(fromLocal);
      ids.forEach((id) => {
        const i = parsedList.findIndex((el) => el.id === id);
        if (i >= 0) parsedList.splice(i, 1);
      });
      localStorage.setItem(k, JSON.stringify(parsedList));
    }
    return { error: null, status: 200 };
  } catch (err) {
    return { error: err, status: 500 };
  }
};

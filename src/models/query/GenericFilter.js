export const SortOrder = {
  ASC: "ASC",
  DESC: "DESC",
};

/**
 * Generic Filter class
 */
export class GenericFilter {
  page = 1;
  pageSize = 10;
  orderBy = "dateOfCreation";
  sortOrder = SortOrder.DESC;

  /**
   * Creates a simple Generic Filter
   * @param {number} page - current page to fetch
   * @param {number} pageSize - count of element to fetch
   * @param {string} orderBy - which attribute to order by
   * @param {SortOrder} sortOrder - sort order (ASC/DESC)
   */
  constructor(page = 1, pageSize = 10, orderBy = "id", sortOrder = SortOrder.DESC) {
    this.page = page;
    this.pageSize = pageSize;
    this.orderBy = orderBy;
    this.sortOrder = sortOrder;
  }

  /**
   * Turns to query
   * @param {object} object - object to transform
   * @returns a string in query shape
   */
  static toQuery = (object) => {
    return `?page=${object.page}&pageSize=${object.pageSize}&orderBy=${object.orderBy}&sortOrder=${object.sortOrder}`;
  };
}

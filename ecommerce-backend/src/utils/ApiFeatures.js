// ApiFeatures helps us handle product listing features like:
// - Searching by keyword
// - Filtering by category, price, etc.
// - Sorting (price high to low, newest, etc.)
// - Pagination (page 1, page 2...)
//
// We pass in the Mongoose query and the request query string,
// then chain the methods we need before finally calling .query in the controller.

class ApiFeatures {
  constructor(mongooseQuery, requestQuery) {
    // mongooseQuery is something like Product.find()
    this.query = mongooseQuery;
    // requestQuery is req.query from Express (the URL parameters)
    this.requestQuery = requestQuery;
  }

  // Search by product name using a case-insensitive regex
  search() {
    if (this.requestQuery.keyword) {
      const keyword = this.requestQuery.keyword;
      this.query = this.query.find({
        name: { $regex: keyword, $options: "i" },
      });
    }
    return this;
  }

  // Filter by fields like category, price range, etc.
  // We remove special query params (page, sort, limit, keyword) before filtering
  filter() {
    const queryObject = { ...this.requestQuery };
    const excludedFields = ["page", "sort", "limit", "keyword", "fields"];

    excludedFields.forEach(function (field) {
      delete queryObject[field];
    });

    // Convert filter operators like gte, lte to MongoDB operators ($gte, $lte)
    // Example: price[gte]=100 becomes { price: { $gte: 100 } }
    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      function (match) {
        return "$" + match;
      }
    );

    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  // Sort results. Default is newest first (-createdAt)
  sort() {
    if (this.requestQuery.sort) {
      const sortBy = this.requestQuery.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  // Paginate results. Default is 12 products per page.
  paginate(resultsPerPage) {
    const page = Number(this.requestQuery.page) || 1;
    const limit = Number(this.requestQuery.limit) || resultsPerPage;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApiFeatures;

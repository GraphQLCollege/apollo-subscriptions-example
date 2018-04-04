const knex = require("knex")(
  require("./knexfile")[process.env.NODE_ENV || "development"]
);

module.exports = knex;

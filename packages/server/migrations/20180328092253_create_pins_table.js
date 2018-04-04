exports.up = knex =>
  knex.schema.createTable("pins", t => {
    t.increments("id").primary();
    t.string("title");
    t.string("link");
    t.string("image");
  });

exports.down = knex => knex.schema.dropTableIfExists("pins");

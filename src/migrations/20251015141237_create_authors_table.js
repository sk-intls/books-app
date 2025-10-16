/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('authors', function(table) {
    table.increments('id').primary();
    table.string('name', 255).notNullable().unique();
    table.integer('birth_year').nullable();
    table.integer('death_year').nullable();
    
    table.index(['name']);
    table.index(['birth_year']);
    
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('authors');
};

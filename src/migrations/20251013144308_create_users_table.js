/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('username', 255).notNullable().unique();
    table.string('password', 255).notNullable();
    table.string('first_name', 255).notNullable();
    table.string('last_name', 255).notNullable();
    table.string('birth_date', 10).notNullable(); // Format: YYYY-MM-DD
    table.timestamps(true, true); // created_at and updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};

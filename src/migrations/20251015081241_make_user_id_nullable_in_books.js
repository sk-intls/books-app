/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('books', function(table) {
    table.dropForeign(['user_id']);
    table.integer('user_id').unsigned().nullable().alter();
    table.foreign('user_id').references('id').inTable('users').onDelete('SET NULL');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('books', function(table) {
    table.dropForeign(['user_id']);
    table.integer('user_id').unsigned().notNullable().alter();
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
  });
};

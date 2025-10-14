/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('books', function(table) {
    table.increments('id').primary();
    table.string('title', 500).notNullable();
    table.string('author', 255).notNullable();
    
    // Foreign key to users table
    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    
    // Indexes for performance
    table.index(['user_id']);
    table.index(['author']);
    table.index(['title']);
    
    table.timestamps(true, true); // created_at and updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('books');
};

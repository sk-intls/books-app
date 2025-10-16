/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  
  await knex.schema.createTable('user_books', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('book_id').unsigned().notNullable();
    table.timestamp('acquired_at').defaultTo(knex.fn.now());
    
    
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('book_id').references('id').inTable('books').onDelete('CASCADE');
    
    
    table.unique(['user_id', 'book_id']);
    
    
    table.index(['user_id']);
    table.index(['book_id']);
    
    table.timestamps(true, true);
  });
  
  
  const booksWithUsers = await knex('books')
    .whereNotNull('user_id')
    .select('id', 'user_id');
  
  for (const book of booksWithUsers) {
    await knex('user_books').insert({
      user_id: book.user_id,
      book_id: book.id,
      acquired_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    });
  }
  
  
  await knex.schema.alterTable('books', function(table) {
    table.dropForeign(['user_id']);
    table.dropColumn('user_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('user_books');
};

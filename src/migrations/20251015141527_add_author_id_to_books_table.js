/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.alterTable('books', function(table) {
    table.integer('author_id').unsigned().nullable();
    table.foreign('author_id').references('id').inTable('authors').onDelete('RESTRICT');
    table.index(['author_id']);
  });

  const books = await knex('books').select('author').distinct();

  for (const book of books) {
    if (book.author) {
      await knex('authors').insert({
        name: book.author,
        created_at: new Date(),
        updated_at: new Date()
      }).onConflict('name').ignore();
      const author = await knex('authors').where('name', book.author).first();
      
      await knex('books')
        .where('author', book.author)
        .update({ author_id: author.id });
    }
  }
  await knex.schema.alterTable('books', function(table) {
    table.integer('author_id').notNullable().alter();
    table.dropColumn('author');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.alterTable('books', function(table) {
    table.string('author', 255).nullable();
  });

  const books = await knex('books')
    .join('authors', 'books.author_id', 'authors.id')
    .select('books.id', 'authors.name as author_name');
    
  for (const book of books) {
    await knex('books')
      .where('id', book.id)
      .update({ author: book.author_name });
  }
  await knex.schema.alterTable('books', function(table) {
    table.string('author', 255).notNullable().alter();
    table.dropForeign(['author_id']);
    table.dropColumn('author_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Clear existing entries in correct order (FK constraints)
  await knex('user_books').del();
  await knex('books').del();
  await knex('authors').del();
  await knex('users').del();
  
  // Insert famous authors
  await knex('authors').insert([
    {
      id: 1,
      name: 'J.R.R. Tolkien',
      birth_year: 1892,
      death_year: 1973
    },
    {
      id: 2,
      name: 'Robert Ludlum',
      birth_year: 1927,
      death_year: 2001
    },
    {
      id: 3,
      name: 'Lee Child',
      birth_year: 1954,
      death_year: null
    },
    {
      id: 4,
      name: 'Jack Finney',
      birth_year: 1911,
      death_year: 1995
    }
  ]);
};
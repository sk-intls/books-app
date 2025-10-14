/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('users').del();
  
  await knex('users').insert([
    {
      username: 'johndoe',
      password: 'password123', //TODO: hash this
      first_name: 'John',
      last_name: 'Doe',
      birth_date: '1990-01-15'
    },
    {
      username: 'janesmith',
      password: 'password123',
      first_name: 'Jane',
      last_name: 'Smith',
      birth_date: '1985-08-22'
    },
    {
      username: 'mikejohnson',
      password: 'password123',
      first_name: 'Mike',
      last_name: 'Johnson',
      birth_date: '1992-12-03'
    }
  ]);
};

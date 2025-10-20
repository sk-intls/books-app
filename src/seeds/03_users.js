const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  await knex('users').insert([
    {
      username: 'mscott',
      password: hashedPassword,
      first_name: 'Michael',
      last_name: 'Scott',
      birth_date: '1964-03-15'
    },
    {
      username: 'jhalpert',
      password: hashedPassword,
      first_name: 'Jim',
      last_name: 'Halpert',
      birth_date: '1978-10-01'
    },
    {
      username: 'pbeesly',
      password: hashedPassword,
      first_name: 'Pam',
      last_name: 'Beesly',
      birth_date: '1979-03-25'
    },
    {
      username: 'dschrute',
      password: hashedPassword,
      first_name: 'Dwight',
      last_name: 'Schrute',
      birth_date: '1970-01-20'
    },
    {
      username: 'shudson',
      password: hashedPassword,
      first_name: 'Stanley',
      last_name: 'Hudson',
      birth_date: '1958-02-19'
    },
    {
      username: 'kmalone',
      password: hashedPassword,
      first_name: 'Kevin',
      last_name: 'Malone',
      birth_date: '1968-06-01'
    },
    {
      username: 'amartin',
      password: hashedPassword,
      first_name: 'Angela',
      last_name: 'Martin',
      birth_date: '1971-06-25'
    },
    {
      username: 'tflenderson',
      password: hashedPassword,
      first_name: 'Toby',
      last_name: 'Flenderson',
      birth_date: '1963-02-22'
    },
    {
      username: 'rhoward',
      password: hashedPassword,
      first_name: 'Ryan',
      last_name: 'Howard',
      birth_date: '1979-05-05'
    },
    {
      username: 'alevinson',
      password: hashedPassword,
      first_name: 'Andy',
      last_name: 'Bernard',
      birth_date: '1973-01-24'
    },
    {
      username: 'ckapoor',
      password: hashedPassword,
      first_name: 'Kelly',
      last_name: 'Kapoor',
      birth_date: '1980-02-05'
    },
    {
      username: 'cbratton',
      password: hashedPassword,
      first_name: 'Creed',
      last_name: 'Bratton',
      birth_date: '1943-02-08'
    },
    {
      username: 'mpalmer',
      password: hashedPassword,
      first_name: 'Meredith',
      last_name: 'Palmer',
      birth_date: '1959-11-12'
    },
    {
      username: 'ovance',
      password: hashedPassword,
      first_name: 'Oscar',
      last_name: 'Martinez',
      birth_date: '1972-11-18'
    },
    {
      username: 'pvance',
      password: hashedPassword,
      first_name: 'Phyllis',
      last_name: 'Vance',
      birth_date: '1965-07-10'
    },
    {
      username: 'jlevinson',
      password: hashedPassword,
      first_name: 'Jan',
      last_name: 'Levinson',
      birth_date: '1961-05-11'
    },
    {
      username: 'dphilbin',
      password: hashedPassword,
      first_name: 'Darryl',
      last_name: 'Philbin',
      birth_date: '1971-10-25'
    },
    {
      username: 'erin',
      password: hashedPassword,
      first_name: 'Erin',
      last_name: 'Hannon',
      birth_date: '1986-05-01'
    },
    {
      username: 'glewis',
      password: hashedPassword,
      first_name: 'Gabe',
      last_name: 'Lewis',
      birth_date: '1982-08-19'
    },
    {
      username: 'nate',
      password: hashedPassword,
      first_name: 'Nate',
      last_name: 'Nickerson',
      birth_date: '1985-04-15'
    }
  ]);
};
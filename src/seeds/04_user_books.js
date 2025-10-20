/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  const users = await knex('users').select('id', 'username');
  const books = await knex('books').select('id', 'title');
  
  const findUser = (username) => users.find(u => u.username === username)?.id;
  const findBook = (title) => books.find(b => b.title === title)?.id;
  
  const userBooks = [];
  
  const michael = findUser('mscott');
  if (michael) {
    userBooks.push(
      { user_id: michael, book_id: findBook('The Hobbit') },
      { user_id: michael, book_id: findBook('The Fellowship of the Ring') },
      { user_id: michael, book_id: findBook('The Bourne Identity') }
    );
  }
  
  const jim = findUser('jhalpert');
  if (jim) {
    userBooks.push(
      { user_id: jim, book_id: findBook('Killing Floor') },
      { user_id: jim, book_id: findBook('Die Trying') },
      { user_id: jim, book_id: findBook('The Bourne Identity') },
      { user_id: jim, book_id: findBook('The Bourne Supremacy') },
      { user_id: jim, book_id: findBook('Time and Again') }
    );
  }
  
  const pam = findUser('pbeesly');
  if (pam) {
    userBooks.push(
      { user_id: pam, book_id: findBook('The Hobbit') },
      { user_id: pam, book_id: findBook('The Fellowship of the Ring') },
      { user_id: pam, book_id: findBook('The Two Towers') },
      { user_id: pam, book_id: findBook('The Return of the King') },
      { user_id: pam, book_id: findBook('Invasion of the Body Snatchers') }
    );
  }
  
  const dwight = findUser('dschrute');
  if (dwight) {
    userBooks.push(
      { user_id: dwight, book_id: findBook('The Enemy') },
      { user_id: dwight, book_id: findBook('One Shot') },
      { user_id: dwight, book_id: findBook('Without Fail') },
      { user_id: dwight, book_id: findBook('The Bourne Ultimatum') },
      { user_id: dwight, book_id: findBook('Assault on a Queen') }
    );
  }
  
  const stanley = findUser('shudson');
  if (stanley) {
    userBooks.push(
      { user_id: stanley, book_id: findBook('The Scarlatti Inheritance') },
      { user_id: stanley, book_id: findBook('The Osterman Weekend') },
      { user_id: stanley, book_id: findBook('The Third Level') }
    );
  }
  
  const kevin = findUser('kmalone');
  if (kevin) {
    userBooks.push(
      { user_id: kevin, book_id: findBook('Good Neighbor Sam') },
      { user_id: kevin, book_id: findBook('Five Against the House') },
      { user_id: kevin, book_id: findBook('The Hobbit') }
    );
  }
  
  const angela = findUser('amartin');
  if (angela) {
    userBooks.push(
      { user_id: angela, book_id: findBook('The Bourne Identity') },
      { user_id: angela, book_id: findBook('The Bourne Supremacy') },
      { user_id: angela, book_id: findBook('The Bourne Ultimatum') }
    );
  }
  
  const ryan = findUser('rhoward');
  if (ryan) {
    userBooks.push(
      { user_id: ryan, book_id: findBook('Personal') },
      { user_id: ryan, book_id: findBook('Make Me') },
      { user_id: ryan, book_id: findBook('Night School') },
      { user_id: ryan, book_id: findBook('Blue Moon') }
    );
  }
  

  const creed = findUser('cbratton');
  if (creed) {
    userBooks.push(
      { user_id: creed, book_id: findBook('The Woodrow Wilson Dime') },
      { user_id: creed, book_id: findBook('I Love Galesburg in the Springtime') },
      { user_id: creed, book_id: findBook('The Clock of Time') },
      { user_id: creed, book_id: findBook('Marion\'s Wall') }
    );
  }
  
  const validUserBooks = userBooks.filter(ub => ub.user_id && ub.book_id);
  
  if (validUserBooks.length > 0) {
    await knex('user_books').insert(validUserBooks);
  }
};
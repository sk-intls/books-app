/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  
  // Insert books by author
  await knex('books').insert([
    // J.R.R. Tolkien books (author_id: 1)
    { title: 'The Hobbit', author_id: 1 },
    { title: 'The Fellowship of the Ring', author_id: 1 },
    { title: 'The Two Towers', author_id: 1 },
    { title: 'The Return of the King', author_id: 1 },
    { title: 'The Silmarillion', author_id: 1 },
    { title: 'Unfinished Tales', author_id: 1 },
    { title: 'The Children of Húrin', author_id: 1 },
    
    // Robert Ludlum books (author_id: 2)
    { title: 'The Bourne Identity', author_id: 2 },
    { title: 'The Bourne Supremacy', author_id: 2 },
    { title: 'The Bourne Ultimatum', author_id: 2 },
    { title: 'The Scarlatti Inheritance', author_id: 2 },
    { title: 'The Osterman Weekend', author_id: 2 },
    { title: 'The Matlock Paper', author_id: 2 },
    { title: 'The Rhinemann Exchange', author_id: 2 },
    { title: 'The Gemini Contenders', author_id: 2 },
    { title: 'The Chancellor Manuscript', author_id: 2 },
    { title: 'The Holcroft Covenant', author_id: 2 },
    { title: 'The Matarese Circle', author_id: 2 },
    { title: 'The Parsifal Mosaic', author_id: 2 },
    
    // Lee Child books (author_id: 3) - Jack Reacher series
    { title: 'Killing Floor', author_id: 3 },
    { title: 'Die Trying', author_id: 3 },
    { title: 'Tripwire', author_id: 3 },
    { title: 'Running Blind', author_id: 3 },
    { title: 'Echo Burning', author_id: 3 },
    { title: 'Without Fail', author_id: 3 },
    { title: 'Persuader', author_id: 3 },
    { title: 'The Enemy', author_id: 3 },
    { title: 'One Shot', author_id: 3 },
    { title: 'The Hard Way', author_id: 3 },
    { title: 'Bad Luck and Trouble', author_id: 3 },
    { title: '61 Hours', author_id: 3 },
    { title: 'Worth Dying For', author_id: 3 },
    { title: 'The Affair', author_id: 3 },
    { title: 'A Wanted Man', author_id: 3 },
    { title: 'Never Go Back', author_id: 3 },
    { title: 'Personal', author_id: 3 },
    { title: 'Make Me', author_id: 3 },
    { title: 'Night School', author_id: 3 },
    { title: 'No Middle Name', author_id: 3 },
    { title: 'The Midnight Line', author_id: 3 },
    { title: 'Past Tense', author_id: 3 },
    { title: 'Blue Moon', author_id: 3 },
    { title: 'The Sentinel', author_id: 3 },
    
    // Jack Finney books (author_id: 4)
    { title: 'Invasion of the Body Snatchers', author_id: 4 },
    { title: 'Time and Again', author_id: 4 },
    { title: 'From Time to Time', author_id: 4 },
    { title: 'The Woodrow Wilson Dime', author_id: 4 },
    { title: 'Marion\'s Wall', author_id: 4 },
    { title: 'Assault on a Queen', author_id: 4 },
    { title: 'Good Neighbor Sam', author_id: 4 },
    { title: 'The House of Numbers', author_id: 4 },
    { title: 'Five Against the House', author_id: 4 },
    { title: 'The Third Level', author_id: 4 },
    { title: 'I Love Galesburg in the Springtime', author_id: 4 },
    { title: 'The Clock of Time', author_id: 4 }
  ]);
};
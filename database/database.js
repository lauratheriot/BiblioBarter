/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/indent */

const Sequelize = require('sequelize');
require('dotenv').config();

// eslint-disable-next-line max-len
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  operatorsAliases: false, // may not possibly need
  define: {
    timestamps: false, // will not create createdAt and updatedAt column for each table
  },
  pool: { // currently not sure if needed
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// connect to db instance
sequelize
  .authenticate()
  .then(() => {
      console.log('Database connection established successfully.');
  })
  .catch((err) => {
      console.error('Unable to connect to the database:', err);
  });


// SCHOOL table is the user's school, takes in geo location so that we can access map proximity for filter feature
const School = sequelize.define('school', {
  id_school: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_school: Sequelize.TEXT,
  geo_latitude: Sequelize.DECIMAL,
  geo_longitude: Sequelize.DECIMAL,
});

// user table, holds data for each user
const User = sequelize.define('user', {
  id_user: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_name: {
    type: Sequelize.STRING,
    unique: true,
  },
  id_school: {
    type: Sequelize.INTEGER,
    references: {
      model: School,
      key: 'id_school',
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
    },
  },
  address: Sequelize.TEXT,
  email: Sequelize.TEXT,
  phone_number: Sequelize.TEXT,
  name_first: Sequelize.TEXT,
  name_last: Sequelize.TEXT,
  link_image: Sequelize.TEXT,
  search_radius: Sequelize.INTEGER,
});


// WANT table is the books the user would like / need
const Want = sequelize.define('want', {
  id_want: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_user: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: 'id_user',
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
    },
  },
  isbn: Sequelize.BIGINT,
  condition: Sequelize.TEXT,
});
// User.hasMany(Want);
// Want.belongsTo(User);

// BOOK table is the table that has all books for offering
const Book = sequelize.define('book', {
  id_book: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  isbn: Sequelize.BIGINT,
  title: Sequelize.TEXT,
  condition: Sequelize.TEXT,
});

// LISTING table is the books the user has to offer
const Listing = sequelize.define('listing', {
  id_listing: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_user: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: 'id_user',
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
    },
  },
  id_book: {
    type: Sequelize.INTEGER,
    references: {
      model: Book,
      key: 'id_book',
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
    },
  },
  date_created: Sequelize.DATE,
});

// OFFER table holds information on offer made between two people, negative money equals money out of listing owner
const Offer = sequelize.define('offer', {
  id_offer: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_listing_recipient: Sequelize.INTEGER,
  id_offer_prev: Sequelize.INTEGER,
  id_listing_sending: Sequelize.INTEGER,
  money_exchange: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
  accepted: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    defaultValue: null,
  },
});

// OFFER LISTING table ties a user making an offer to a listing
const Offer_Listing = sequelize.define('offer_listing', {
  id_offer_listing: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_offer: {
    type: Sequelize.INTEGER,
    references: {
      model: Offer,
      key: 'id_offer',
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
    },
  },
  id_listing: {
    type: Sequelize.INTEGER,
    references: {
      model: Listing,
      key: 'id_listing',
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
    },
  },
});

// create a user for testing
// force: true will drop the table if it already exists
// User.create({
//   user_name: 'Magic Sprinkles',
//   id_school: 'U of Uni',
//   address: '123 Rainbow Rd',
//   email: 'sprinkles@gmail.com',
//   phone_number: 8884581234,
//   name_first: 'Charlie',
//   name_last: 'Springfield',
//   link_image: 'www.imglink.com',
//   search_radius: 20,
// }).then(()=> {
//   console.log('user saved');
// }).catch((err) => {
//   console.log(`$err, there was`);
// })
// User.sync({ force: true }).then(() => {
//   // Table created
//   return User.create({
//     user_name: 'Magic Sprinkles',
//     id_school: 'U of Uni',
//     address: '123 Rainbow Rd',
//     email: 'sprinkles@gmail.com',
//     phone_number: 8884581234,
//     name_first: 'Charlie',
//     name_last: 'Springfield',
//     link_image: 'www.imglink.com',
//     search_radius: 20,
//   });
// }).catch((err) => {
//   console.log(err, 'where is charlie');
// });

// /////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////

// comment out if no longer need to rebuild the tables!
// uncomment to rebuild
sequelize.sync({ force: true });

module.exports = {
  School,
  User,
  Want,
  Book,
  Listing,
  Offer,
  Offer_Listing,
};

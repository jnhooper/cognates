import Sequelize from 'sequelize';

console.log(
  '<><><><><<><><><><><><><><>'
);
console.log(process.env.DATABASE);
const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: 'postgres',
    host: process.env.POSTGRES_CONTAINER,
  }
);

const models = {
  User: sequelize.import('./user'),
  Cognate: sequelize.import(
    './cognate'
  ),
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };
export default models;
// let users = {
//   1: {
//     id: '1',
//     username: 'Robin Wieruch',
//     messageIds: [1],
//   },
//   2:
//     id: '2',
//     username: 'Dave Davids',
//     messageIds: [2],
//   },
// };

// let messages = {
//   1: {
//     id: '1',
//     text: 'Hello World',
//     userId: '1',
//   },
//   2: {
//     id: '2',
//     text: 'By World',
//     userId: '2',
//   },
// };

// export default {
//   users,
//   messages,
// };

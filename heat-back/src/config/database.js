const { Sequelize } = require("sequelize");
const pg = require("pg");

// const sequelize = new Sequelize(process.env.DB_DEPLOY, {
//RAILWAY
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: "postgres",
//     logging: false,
//   }
// );

sequelize
  .authenticate()
  .then(() => console.log("Conexión a la base de datos PostgreSQL exitosa"))
  .catch((err) => console.error("Error conectando a la base de datos:", err));

module.exports = sequelize;

const { Sequelize } = require("sequelize");
require("dotenv").config({ path: "../../VirtualIntership/.env" });

const sequelize = new Sequelize(process.env.PG_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

module.exports = sequelize;
import { Sequelize } from "sequelize";
import { config } from "../config";

const sequelize = new Sequelize(
    config.database.database,
    config.database.user,
    config.database.password,
    {
        dialect: "postgres",
        host: config.database.host,
        port: +config.database.port,
        logging: false,
    }
);
sequelize.sync({ alter: true });

sequelize
    .authenticate()
    .then(() => {
        console.log("Databases connected.");
    })
    .catch((err) => {
        console.error("Database connection error: ", err);
    });
console.log(1);
export default sequelize;

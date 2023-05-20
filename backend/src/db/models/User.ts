import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";

export class User extends Model {
    declare id: number;
    declare login: string;
    declare firstName: string;
    declare lastName: string;
    declare middleName: string;
    declare password: string;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        login: {
            type: DataTypes.STRING,
            unique: true,
        },
        firstName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        middleName: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "users",
        sequelize,
    }
);
// User.findAll().then(console.log);
// // Process.truncate();
// User.destroy({ where: { id: 5 } });
// User.create({
//     login: "admin",
//     firstName: "Дмитрий",
//     lastName: "Стефановский",
//     middleName: "Владимирович",
//     password: "admin",
// });

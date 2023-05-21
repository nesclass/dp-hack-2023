import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";
import { User } from "./index";

export class Process extends Model {
    declare id: number;
    declare fileHash: string;
    declare fileName: string;
    declare userId: number;
    declare status: "PENDING" | "RESOLVED" | "REJECTED";
    declare type: "participant" | "result";
    declare message: string;
}

Process.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        fileName: {
            type: DataTypes.STRING,
        },
        fileHash: {
            type: DataTypes.STRING,
            unique: true,
        },
        type: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "PENDING",
        },
        message: {
            type: DataTypes.STRING,
        },
    },
    {
        tableName: "processes",
        sequelize,
    }
);

User.hasMany(Process, {
    foreignKey: "userId",
});

// Process.truncate();

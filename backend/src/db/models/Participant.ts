import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";

export class Participant extends Model {
    declare id: number;
    declare firstName: string;
    declare lastName: string;
    declare middleName: string;
    declare fio: string;
    declare gender: number;
    declare dob: string;
    declare participating: boolean;
    declare competitions: any[];
    declare work: any;
    declare rosatomStarted: string;
    declare education: any[];
}

Participant.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
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
        fio: {
            type: DataTypes.STRING,
        },
        gender: {
            type: DataTypes.INTEGER,
        },
        dob: {
            type: DataTypes.STRING,
        },
        participating: {
            type: DataTypes.BOOLEAN,
        },
        competitions: {
            type: DataTypes.JSONB,
            defaultValue: [],
        },
        work: {
            type: DataTypes.JSONB,
        },
        rosatomStarted: {
            type: DataTypes.STRING,
        },
        education: {
            type: DataTypes.JSONB,
            defaultValue: [],
        },
    },
    {
        tableName: "participants",
        sequelize,
    }
);

import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";

export class Dashboard extends Model {
    declare id: number;
    declare name: string;
    declare data: any;
}

Dashboard.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
        data: {
            type: DataTypes.JSONB,
        },
    },
    {
        tableName: "dashboards",
        sequelize,
    }
);

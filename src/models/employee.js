import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const User = sequelize.define(
	'User',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		positionId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		positionName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		parentId: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
	},
	{
		tableName: 'Users',
		indexes: [
			{
				fields: ['parentId'],
				name: 'parent_id_idx',
			},
			{
				fields: ['positionId'],
				name: 'position_id_idx',
			},
		],
	}
)

export default User

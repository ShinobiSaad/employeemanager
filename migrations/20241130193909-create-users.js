'use strict'

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			positionId: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			positionName: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			parentId: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		})

		await queryInterface.addIndex('Users', ['parentId'])
		await queryInterface.addIndex('Users', ['positionId'])
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('Users')
	},
}

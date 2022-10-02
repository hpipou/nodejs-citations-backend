'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Citations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      post: {
        allowNull: false,
        type: Sequelize.STRING
      },
      idUser: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{
          model:'Users',
          key:'id'
        }
      },
      idProfil: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{
          model:'Profils',
          key:'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Citations');
  }
};
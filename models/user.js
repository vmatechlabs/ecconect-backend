const bcrypt = require('bcrypt')
const constants = require('../config/constants')

module.exports = (sequelize, Sequelize) => {
    const users = sequelize.define('users', {
        user_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: Sequelize.STRING(20),
            allowNull: false,
            unique: true
        },
        display_picture: {
            type: Sequelize.STRING,
        },
        first_name: {
            type: Sequelize.STRING(24)
        },
        last_name: {
            type: Sequelize.STRING(24)
        },
        email_address: {
            type: Sequelize.STRING(150),
        },
        mobile_number: {
            type: Sequelize.STRING(10),
        },
        password: {
            type: Sequelize.STRING,
        },
        user_login_time: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        user_otp: {
            type: Sequelize.INTEGER,
            defaultValue: null
        },
        user_role: {
            type: Sequelize.STRING,
            ENUM: ["Admin", "Basic"],
            defaultValue: "Basic"
        },
        active_status: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },

    })
    users.beforeCreate(async (user, options) => {
        const hashedPassword = await bcrypt.hash(user.password, constants.genSalt);
        user.password = hashedPassword;
    });
    return users;
};
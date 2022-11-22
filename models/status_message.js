module.exports = (sequelize, Sequelize) => {
    const statusMessage = sequelize.define('status_message', {
        message_id: {
            type: Sequelize.STRING,
            primaryKey: true,
            unique: true,
        },
        message_description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        message_date: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
        message_time: {
            type: Sequelize.TIME,
            allowNull: false
        },
        source: {
            type: Sequelize.STRING,
        },
        destination: {
            type: Sequelize.STRING,
            allowNull: false
        },
        integration_status: {
            type: Sequelize.STRING,
            allowNull: false,
            ENUM: ["success", "failure", "pending"]
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: Sequelize.NOW
        },
        updated_at: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: Sequelize.NOW
        }
    })
    return statusMessage;
}
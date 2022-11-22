

module.exports = (sequelize, Sequelize) => {
    const contactDetails = sequelize.define('contact_details', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        user_address: {
            type: Sequelize.STRING,
            allowNull: false
        },
        user_city: {
            type: Sequelize.STRING(150),
            allowNull: false
        },
        user_state: {
            type: Sequelize.STRING(150),
            allowNull: false
        },
        user_pincode: {
            type: Sequelize.STRING(16),
            allowNull: false
        },
        last_update: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: Sequelize.NOW
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "user_id"
            }
        }
    })
    return contactDetails;
}
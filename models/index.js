const dbConfig = require('../config/db_config');
const Sequelize = require('sequelize');
const fs = require('fs');
let dbDetails = 'postgres://' + dbConfig.USER + ':' + dbConfig.PASSWORD + '@' + dbConfig.HOST + ":" + dbConfig.PORT + "/" + dbConfig.DB;

const sequelize = new Sequelize(dbDetails, {
    dialect: dbConfig.dialect,
    define: {
        timestamps: false,
        freezeTableName: true
    }
})
let db = {};

db.sequelize = sequelize;

const dir = './models';
const files = fs.readdirSync(dir);
for (const file of files) {
    if (file != 'index.js') {
        db[file.slice(0, -3)] = require("./" + file)(sequelize, Sequelize);
    }
}

// User and Address table relationship

db.contact_details.belongsTo(db.user, { as: "user_details", foreignKey: "user_id" });




module.exports = db;
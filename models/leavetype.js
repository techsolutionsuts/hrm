'use strict';
const {
    Model
} = require('sequelize');
// const User = require('./user-model');
module.exports = (sequelize, DataTypes) => {
    let LeaveType = sequelize.define('LeaveType', {
        leaveType: DataTypes.STRING,
        description: DataTypes.STRING(1000),
        nofdays: DataTypes.INTEGER,
        carryon: DataTypes.BOOLEAN
    }, {});

    LeaveType.associate = function(models) {
        // User.hasMany(models.LeaveType);
        LeaveType.belongsTo(models.User);
    };
    return LeaveType;
    // class LeaveType extends Model {
    //     /**
    //      * Helper method for defining associations.
    //      * This method is not a part of Sequelize lifecycle.
    //      * The `models/index` file will call this method automatically.
    //      */
    //     static associate(models) {
    //         User.hasMany(LeaveType);
    //         LeaveType.belongsTo(User);
    //     }
    // };
    // LeaveType.init({
    //     leaveType: DataTypes.STRING,
    //     description: DataTypes.STRING(1000),
    //     nofdays: DataTypes.INTEGER,
    //     carryon: DataTypes.BOOLEAN,
    // }, {
    //     sequelize,
    //     modelName: 'LeaveType',
    // });
    // return LeaveType;
};
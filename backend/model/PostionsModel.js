const { model, default: mongoose } = require('mongoose');

const {PositionsSchema} = require('../schema/PostionsSchema');

const PositionsModel  =mongoose.model("postion" , PositionsSchema)

module.exports = PositionsModel;
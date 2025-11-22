const mongoose = require('mongoose');
const { HoldingsSchema } = require('../schema/HoldingsSchema');

const HoldingsModel = mongoose.model('holding', HoldingsSchema);

module.exports = HoldingsModel; // ❌ not { HoldingsModel }

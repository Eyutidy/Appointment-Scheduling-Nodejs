const mongoose = require("mongoose");

const systemPrefSchema = new mongoose.Schema({
  availabilityTime: {
    type: Object,
    allowNull: true,
  },
});

const SystemPref = mongoose.model("SystemPref", systemPrefSchema);

module.exports = SystemPref;

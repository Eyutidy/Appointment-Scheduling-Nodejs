const DeletedAppointment = require("../models/deletedAppointment");
const renderDeletedAppointments = async (req, res) => {
  try {
    const deletedAppointments = await DeletedAppointment.find({});
    res.render("deletedAppointments", { deletedAppointments });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
module.exports = { renderDeletedAppointments };

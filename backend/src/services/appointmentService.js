import { sequelize } from "../config/database.js";
import initModels from "../models/init-models.js";
let model = initModels(sequelize);

export const bookAppointmentService = async (data) => {
  try {
    const { user_id, work_schedule_id, guest_name, guest_email, status } = data;

    if (user_id) {
      const user = await model.User.findByPk(user_id);
      if (!user) {
        return { message: "User not found" };
      }
      const newBooking = await model.Booking.create({
        user_id,
        work_schedule_id,
        status: status || "pending",
      });
      return {
        message: newBooking,
      };
    }
    if (guest_name && guest_email) {
      const newBooking = await model.Booking.create({
        work_schedule_id,
        guest_name,
        guest_email,
        status: status || "pending",
      });
      return {
        message: newBooking,
      };
    }
  } catch (error) {
    throw error;
  }
};

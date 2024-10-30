import { bookAppointmentService } from "../services/appointmentService.js";

export const bookAppointment = async (req, res) => {
  const { user_id, work_schedule_id, guest_name, guest_email, status } =
    req.body;
  const data = { user_id, work_schedule_id, guest_name, guest_email, status };
  try {
    const result = await bookAppointmentService(data);
    return res.status(200).json({ status: 200, data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

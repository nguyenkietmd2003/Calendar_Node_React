import {
  createScheduleService,
  deleteScheduleService,
  getAllScheduleService,
  updateScheduleService,
} from "../services/scheduleService.js";

export const getAllSchedule = async (req, res) => {
  try {
    const result = await getAllScheduleService();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createSchedule = async (req, res) => {
  const {
    user_id,
    title,
    description,
    start_time,
    end_time,
    priority,
    notification_time,
    is_canceled,
  } = req.body;
  const data = {
    user_id,
    title,
    description,
    start_time,
    end_time,
    priority,
    notification_time,
    is_canceled,
  };
  try {
    const result = await createScheduleService(data);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const updateSchedule = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const result = await updateScheduleService(id, data);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const deleteSchedule = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteScheduleService(id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

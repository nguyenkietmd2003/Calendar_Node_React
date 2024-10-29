import { sequelize } from "../config/database.js";
import crypto from "crypto";
import initModels from "../models/init-models.js";
import { Op } from "sequelize";

let model = initModels(sequelize);

export const getAllScheduleService = async () => {
  try {
    const data = await model.WorkSchedule.findAll();
    if (!data) return { message: "No work schedule " };
    return { message: data };
  } catch (error) {
    throw error;
  }
};

export const createScheduleService = async (data) => {
  const {
    user_id,
    title,
    description,
    start_time,
    end_time,
    priority,
    notification_time,
    is_canceled,
  } = data;

  try {
    // 1. Kiểm tra lịch đã tồn tại có trùng thời gian không
    const conflictingSchedules = await model.WorkSchedule.findAll({
      where: {
        user_id: user_id,
        // Kiểm tra xem khoảng thời gian có trùng với lịch khác không
        [Op.or]: [
          {
            start_time: {
              [Op.between]: [start_time, end_time], // Lịch bắt đầu trong khoảng thời gian mới
            },
          },
          {
            end_time: {
              [Op.between]: [start_time, end_time], // Lịch kết thúc trong khoảng thời gian mới
            },
          },
          {
            [Op.and]: [
              { start_time: { [Op.lte]: start_time } }, // Lịch bao trùm cả khoảng thời gian mới
              { end_time: { [Op.gte]: end_time } },
            ],
          },
        ],
      },
    });

    if (conflictingSchedules.length > 0) {
      return { message: "Schedule conflicts with existing schedules" };
    }

    // 2. Tạo lịch mới nếu không trùng
    const newSchedule = await model.WorkSchedule.create({
      user_id,
      title,
      description,
      start_time,
      end_time,
      priority,
      notification_time,
      is_canceled,
    });

    if (!newSchedule) return { message: "Cannot create new schedule" };

    return { message: "New schedule created successfully", data: newSchedule };
  } catch (error) {
    throw error;
  }
};

export const updateScheduleService = async (id, data) => {
  try {
    // 1. Tìm lịch cần cập nhật
    const checkSchedule = await model.WorkSchedule.findOne({
      where: { id },
    });

    if (!checkSchedule) {
      return { message: "Schedule not found" };
    }

    // 2. Kiểm tra trùng lặp với các lịch khác của user
    const conflictingSchedules = await model.WorkSchedule.findAll({
      where: {
        user_id: user_id,
        id: { [Op.ne]: id }, // Loại trừ lịch hiện tại khỏi kết quả tìm kiếm
        [Op.or]: [
          {
            start_time: {
              [Op.between]: [start_time, end_time], // Lịch bắt đầu trong khoảng thời gian mới
            },
          },
          {
            end_time: {
              [Op.between]: [start_time, end_time], // Lịch kết thúc trong khoảng thời gian mới
            },
          },
          {
            [Op.and]: [
              { start_time: { [Op.lte]: start_time } }, // Lịch bao trùm cả khoảng thời gian mới
              { end_time: { [Op.gte]: end_time } },
            ],
          },
        ],
      },
    });

    if (conflictingSchedules.length > 0) {
      return { message: "Schedule conflicts with existing schedules" };
    }

    // 3. Cập nhật lịch nếu không trùng
    const updateSchedule = await checkSchedule.update(data);
    return { message: "Schedule updated successfully", data: updateSchedule };
  } catch (error) {
    throw error;
  }
};

export const deleteScheduleService = async (id) => {
  try {
    const checkSchedule = await model.WorkSchedule.findOne({
      where: { id },
    });
    if (!checkSchedule) return { message: "schedule not found" };
    const deleteSchedule = await checkSchedule.destroy();
    return { message: "Schedule deleted successfully", data: deleteSchedule };
  } catch (error) {
    throw error;
  }
};

export const sharedScheduleService = async (id) => {
  try {
    const existingLink = await model.PublicLink.findOne({
      where: { user_id: id },
    });
    if (existingLink) {
      return { message: existingLink.link };
    }
    const domain = "https://myapp.com";
    const path = "schedule";
    const randomString = crypto.randomInt(5).toString("hex");
    const generateLink = `${domain}/${path}/${randomString}`;
    console.log(generateLink);
    const newLink = await model.PublicLink.create({
      user_id: id,
      link: generateLink,
    });
    return { message: "Schedule shared successfully", data: newLink };
  } catch (error) {
    throw error;
  }
};

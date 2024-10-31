import { sequelize } from "../config/database.js";
import crypto from "crypto";
import { Op } from "sequelize";
import initModels from "../models/init-models.js";

let model = initModels(sequelize);

//
export const getScheduleByIDService = async (id) => {
  try {
    const checkUser = await model.User.findOne({
      where: { id },
    });
    if (!checkUser) return { message: "User not found" };
    const schedule = await model.WorkSchedule.findAll({
      where: { user_id: id },
    });
    if (schedule && schedule.length > 0) {
      return { message: schedule };
    }
  } catch (error) {
    throw error;
  }
};

//
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
    start_time,
    end_time,
    priority,
    notification_time,
    is_canceled,
  } = data;

  // Kiểm tra thời gian bắt đầu và kết thúc
  if (new Date(start_time) >= new Date(end_time)) {
    return { message: "Start time must be before end time" };
  }

  try {
    // 1. Kiểm tra lịch đã tồn tại có trùng thời gian không
    const conflictingSchedules = await model.WorkSchedule.findAll({
      where: {
        user_id: user_id,
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
      description: "",
      start_time,
      end_time,
      priority,
      notification_time,
      is_canceled,
    });

    if (!newSchedule) return { message: "Cannot create new schedule" };

    // 3. Thêm vào bảng Notification nếu notification_time = true
    if (notification_time) {
      const notificationTime = new Date(start_time);
      notificationTime.setMinutes(notificationTime.getMinutes() - 5); // Trừ 5 phút từ start_time

      await model.Notification.create({
        work_schedule_id: newSchedule.id,
        user_id,
        notification_time: notificationTime,
        message: `Reminder for your schedule: ${title}`,
      });
    }

    return { message: "New schedule created successfully", data: newSchedule };
  } catch (error) {
    throw error;
  }
};

export const updateScheduleService = async (id, data) => {
  const { user_id, start_time, end_time } = data;

  // Kiểm tra thời gian bắt đầu và kết thúc
  if (new Date(start_time) >= new Date(end_time)) {
    return { message: "Start time must be before end time" };
  }

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
    console.log(id);
    // Kiểm tra xem lịch làm việc có tồn tại không
    const checkSchedule = await model.WorkSchedule.findOne({
      where: { id: id },
    });

    if (!checkSchedule) {
      return { message: "Schedule not found" };
    } else {
      console.log(checkSchedule.dataValues);
    }

    // Tìm tất cả các đặt chỗ liên quan đến lịch làm việc này
    const bookings = await model.Booking.findOne({
      where: { work_schedule_id: id },
    });

    const notification = await model.Notification.findOne({
      where: {
        work_schedule_id: id,
      },
    });

    // Nếu không có đặt chỗ, hãy xóa lịch làm việc
    if (!bookings && !notification) {
      const deleteSchedule = await checkSchedule.destroy();
      return { message: "Schedule deleted successfully", data: deleteSchedule };
    }

    // Nếu có đặt chỗ hoặc thông báo, xóa chúng trước
    if (bookings) {
      await bookings.destroy();
    }

    if (notification) {
      await notification.destroy();
    }

    // Cuối cùng, xóa lịch làm việc
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

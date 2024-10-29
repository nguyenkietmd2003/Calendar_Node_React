import { sequelize } from "../config/database.js";
import initModels from "../models/init-models.js";
let model = initModels(sequelize);

export const bookAppointmentService = async () => {
  try {
  } catch (error) {
    throw error;
  }
};

// CREATE TABLE Booking (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     work_schedule_id INT NOT NULL,
//     guest_name VARCHAR(255) NOT NULL,
//     guest_email VARCHAR(255) NOT NULL,
//     status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
//     FOREIGN KEY (work_schedule_id) REFERENCES WorkSchedule(id)
// );

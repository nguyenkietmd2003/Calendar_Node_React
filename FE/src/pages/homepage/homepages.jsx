import { useEffect, useState } from "react";
import "../test1.css";
import "../test2.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCalendar, faL } from "@fortawesome/free-solid-svg-icons";
import {
  createSchedule,
  deleteSchedule,
  getScheduleById,
} from "../../util/api";

const HomePage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [endTimeOptions, setEndTimeOptions] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    startTime: "",
    endTime: "",
    priority: "",
    notification_time: false,
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // State cho thông báo
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);
  const notifications = [
    "Thông báo 1: Bạn có một cuộc họp lúc 10h.",
    "Thông báo 2: Đừng quên nộp báo cáo vào cuối ngày.",
  ];

  // State cho chế độ hiển thị
  const [isAppointmentMode, setIsAppointmentMode] = useState(false);

  //

  const [apiSchedules, setApiSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const getInfo = localStorage.getItem("info");
        const user = JSON.parse(getInfo);
        const response = await getScheduleById(user.data.user.id);
        // Kiểm tra response.message trước khi thiết lập state
        setApiSchedules(
          Array.isArray(response.message) ? response.message : []
        );
        console.log(response.message);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
      }
    };

    fetchSchedules();
  }, []);

  //

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsFormVisible(true);
    console.log("B1 CHỌN DATE ===> Mở MODAL", date);
  };

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    const newValue = type === "checkbox" ? checked : value; // Kiểm tra loại input
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const date = convertDate(selectedDate);
    const startTime = convertTime(formData.startTime);
    const endTime = convertTime(formData.endTime);
    const user_id = JSON.parse(localStorage.getItem("info")).data.user.id;
    const newSchedule = {
      user_id: user_id, // Lấy user_id từ localStorage
      title: formData.title,
      start_time: `${date}T${startTime}`,
      end_time: `${date}T${endTime}`,
      priority: formData.priority || "low",
      notification_time: formData.notification_time,
    };
    console.log(newSchedule);
    try {
      const result = await createSchedule(newSchedule);
      console.log("Data trước khi call API Create New Schedule", newSchedule);
      console.log(result);
      if (result.status === 200) {
        setApiSchedules((prevSchedules) => {
          if (Array.isArray(prevSchedules)) {
            return [...prevSchedules, { ...newSchedule }];
          } else {
            console.error("prevSchedules is not an array", prevSchedules);
            return [{ ...newSchedule }]; // Hoặc một giá trị mặc định khác
          }
        });
        resetForm();
      } else {
        console.log("Error creating Schedule");
      }
    } catch (error) {
      console.error("Lỗi khi tạo lịch làm việc:", error);
    }

    setIsFormVisible(false);
  };

  const resetForm = () => {
    setFormData({
      startTime: "",
      endTime: "",
      title: "",
      priority: "",
      notification_time: false,
    });
    setIsFormVisible(false);
  };

  const renderSchedules = (date) => {
    // Ngày hiện tại theo định dạng địa phương
    const dateString = date.toLocaleDateString();

    // Kiểm tra xem apiSchedules có phải là một mảng không
    if (!Array.isArray(apiSchedules)) {
      return <div className=""></div>;
    }

    // Lọc lịch trình theo ngày
    const daySchedules = apiSchedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.start_time).toLocaleDateString(); // Chuyển đổi ngày từ lịch trình
      return scheduleDate === dateString; // So sánh ngày
    });

    // Kiểm tra nếu không có lịch trình nào trong ngày
    if (daySchedules.length === 0) {
      return <div className=""></div>;
    }

    // Chọn tối đa 2 lịch trình để hiển thị
    const displaySchedules = daySchedules.slice(0, 2);
    const remainingCount = daySchedules.length - displaySchedules.length; // Tính số lịch trình còn lại

    return (
      <div>
        {displaySchedules.map((schedule, index) => (
          <div
            className="schedule"
            key={index}
            onClick={(e) => {
              e.stopPropagation(); // Ngăn chặn sự kiện click từ propagating lên thẻ cha
              handleScheduleClick(schedule); // Gọi hàm xử lý sự kiện click
            }}
          >
            {schedule.title}
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="schedule">{`Còn ${remainingCount} lịch khác`}</div>
        )}
      </div>
    );
  };

  // Hàm xử lý sự kiện click
  const handleScheduleClick = (schedule) => {
    console.log("Lịch trình đã chọn:", schedule);
    setSelectedSchedule(schedule); // Lưu thông tin lịch trình vào state
    setIsModalVisible(true); // Hiển thị modal
  };

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const renderCalendar = () => {
    const daysOfWeek = ["CN", "TH 2", "TH 3", "TH 4", "TH 5", "TH 6", "TH 7"];
    const totalDays = daysInMonth(currentMonth, currentYear);
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const startDay = firstDayOfMonth.getDay();
    const calendarDays = [];

    // Render days of the week at the top
    calendarDays.push(
      ...daysOfWeek.map((day, index) => (
        <div key={`day-${index}`} className="day header-day">
          {day}
        </div>
      ))
    );

    for (let i = startDay; i > 0; i--) {
      const lastMonthDate = new Date(currentYear, currentMonth, 0);
      calendarDays.push(
        <div key={`empty-${i}`} className="day empty">
          {`${lastMonthDate.getDate() - i + 1}/${lastMonthDate.getMonth()}`}
        </div>
      );
    }

    // Add the actual days of the month
    for (let i = 1; i <= totalDays; i++) {
      const currentDate = new Date(currentYear, currentMonth, i);
      calendarDays.push(
        <div
          key={currentDate.toISOString()}
          className="day"
          onClick={() => handleDateClick(currentDate)}
        >
          {currentDate.getDate()}
          {isAppointmentMode && renderSchedules(currentDate)}
        </div>
      );
    }

    const remainingDays = (7 - ((totalDays + startDay) % 7)) % 7;
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonthDate = new Date(currentYear, currentMonth + 1, i);
      const day = nextMonthDate.getDate(); // Ngày trong tháng kế tiếp
      const month = nextMonthDate.getMonth() + 1; // Tháng kế tiếp (tăng 1 do getMonth() trả về từ 0-11)

      calendarDays.push(
        <div key={`next-month-${i}`} className="day empty">
          {`${day} thg ${month}`}
        </div>
      );
    }

    return calendarDays;
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prevYear) => prevYear - 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth - 1);
    }
  };

  const gotoNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prevYear) => prevYear + 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth + 1);
    }
  };

  // Hàm để chuyển đổi trạng thái hiển thị thông báo
  const toggleNotifications = () => {
    setIsNotificationsVisible((prev) => !prev);
  };
  const handleEdit = (schedule) => {
    setFormData({
      title: schedule.title,
      startTime: "10:00 AM",
      endTime: "11:00 PM",
      priority: schedule.priority,
      notification_time: schedule.notification_time,
    });
    console.log("Updated formData:", {
      title: schedule.title,
      startTime: "12:00 AM",
      endTime: "11:00 PM",
      priority: schedule.priority,
      notification_time: schedule.notification_time,
    });
    setIsFormVisible(true);
    setIsModalVisible(false);
  };

  const handleDelete = async (id) => {
    try {
      const data = await deleteSchedule(id);
      console.log(data);
      if (data.status === 200) {
        setApiSchedules((prevSchedules) => {
          if (Array.isArray(prevSchedules)) {
            return prevSchedules.filter((schedule) => schedule.id !== id);
          } else {
            console.error("prevSchedules is not an array", prevSchedules);
            return []; // Hoặc một giá trị mặc định khác
          }
        });
        setIsModalVisible(false);
      }
      console.log("error delete data", data);
    } catch (error) {
      console.log(error);
    }
  };

  //

  //

  //

  //

  const populateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      const period = hour < 12 ? "AM" : "PM";
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const minutes = ["00", "30"];

      minutes.forEach((minute) => {
        const timeOption = `${displayHour}:${minute} ${period}`;
        times.push(timeOption);
      });
    }
    return times;
  };

  const timeOptions = populateTimeOptions();

  // Cập nhật tùy chọn giờ kết thúc dựa trên giờ bắt đầu
  const updateEndTimeOptions = (selectedStartTime) => {
    const startIndex = timeOptions.findIndex(
      (time) => time === selectedStartTime
    );

    // Lọc các tùy chọn thời gian kết thúc có sẵn
    const availableEndTimes = timeOptions.filter(
      (time, index) => index > startIndex
    );

    setEndTimeOptions(availableEndTimes);

    // Đặt lại endTime trong formData
    setFormData((prevData) => ({
      ...prevData,
      endTime: "",
    }));
  };

  const convertTime = (time12h) => {
    const regex = /(\d{1,2}):(\d{2})\s?(AM|PM)/i;
    const match = time12h.trim().match(regex);

    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = match[2];
      const period = match[3].toUpperCase();

      if (period === "PM" && hours !== 12) {
        hours += 12;
      } else if (period === "AM" && hours === 12) {
        hours = 0;
      }

      const time24h = `${hours.toString().padStart(2, "0")}:${minutes}:00`;
      return time24h;
    } else {
      console.log("Loi Convert time");
    }
  };
  const convertDate = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  return (
    <div className="calendar">
      <div className="header">
        <button className="month-button previous" onClick={goToPreviousMonth}>
          &#60;
        </button>
        <h1> {`Tháng ${currentMonth + 1}, ${currentYear}`}</h1>
        <button className="month-button next" onClick={gotoNextMonth}>
          &#62;
        </button>
        <button
          className="appointment border w-[110px] h-[30px] rounded-2xl mr-[55px]"
          onClick={() => setIsAppointmentMode(true)}
        >
          Lịch Hẹn
        </button>

        {isNotificationsVisible && (
          <div className="notification-dropdown">
            {notifications.map((notification, index) => (
              <div key={index} className="notification-item">
                {notification}
              </div>
            ))}
          </div>
        )}
        <button className="notification-button" onClick={toggleNotifications}>
          <FontAwesomeIcon icon={faBell} />
        </button>
        <button onClick={() => setIsAppointmentMode(false)}>
          <FontAwesomeIcon icon={faCalendar} />
        </button>
      </div>
      <div className="grid">{renderCalendar()}</div>
      {isModalVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalVisible(false)}>
              &times;
            </span>
            {selectedSchedule && (
              <div>
                <h2>{selectedSchedule.title}</h2>
                <p>
                  <strong>Mô tả:</strong> {selectedSchedule.description}
                </p>
                <p>
                  <strong>Thời gian bắt đầu:</strong>{" "}
                  {new Date(selectedSchedule.start_time).toLocaleString()}
                </p>
                <p>
                  <strong>Thời gian kết thúc:</strong>{" "}
                  {new Date(selectedSchedule.end_time).toLocaleString()}
                </p>
                <p>
                  <strong>Ưu tiên:</strong> {selectedSchedule.priority}
                </p>
                <div>
                  <button onClick={() => handleEdit(selectedSchedule)}>
                    Chỉnh sửa
                  </button>
                  <button onClick={() => handleDelete(selectedSchedule.id)}>
                    Xóa
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {isFormVisible && (
        <div className="form-overlay">
          <form className="schedule-form" onSubmit={handleSubmit}>
            <div className="close-form" onClick={() => resetForm()}>
              ICON CLOSE
            </div>
            <div className="form-input">
              <label className="title-input">
                Tiêu đề
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <div className="time-input">
                <select
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={(e) => {
                    const selectedStartTime = e.target.value;
                    setFormData((prevData) => ({
                      ...prevData,
                      startTime: selectedStartTime,
                      endTime: "", // Reset endTime when startTime changes
                    }));
                    updateEndTimeOptions(selectedStartTime);
                  }}
                  required
                >
                  <option value="">-- Chọn giờ bắt đầu --</option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>

                <select
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={(e) => {
                    const selectedEndTime = e.target.value;
                    setFormData((prevData) => ({
                      ...prevData,
                      endTime: selectedEndTime,
                    }));
                  }}
                  required={!!formData.startTime}
                  disabled={!formData.startTime}
                >
                  <option value="">-- Chọn giờ kết thúc --</option>
                  {endTimeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <div className="importance-level">
                <label>Mức độ quan trọng</label>
                <div className="importance-options">
                  <label>
                    <input
                      type="radio"
                      name="priority"
                      value="high"
                      checked={formData.priority === "high"}
                      onChange={handleInputChange}
                    />
                    <span className="high">High</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="priority"
                      value="medium"
                      checked={formData.priority === "medium"}
                      onChange={handleInputChange}
                    />
                    <span className="medium">Medium</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="priority"
                      value="low"
                      checked={formData.priority === "low"}
                      onChange={handleInputChange}
                    />
                    <span className="low">Low</span>
                  </label>
                </div>
              </div>

              <label className="notification-checkbox">
                <input
                  type="checkbox"
                  name="notification_time"
                  checked={formData.notification_time}
                  onChange={handleInputChange}
                />
                Nhận thông báo khi gần đến
              </label>
            </div>
            <button className="button-form">OK</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default HomePage;

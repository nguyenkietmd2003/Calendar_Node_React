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
    "Thông báo 3: Lịch trình đã được cập nhật.",
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
        setApiSchedules(response.message); // Lưu dữ liệu vào state
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
    const newSchedule = {
      user_id: JSON.parse(localStorage.getItem("info")).data.user.id, // Lấy user_id từ localStorage
      title: formData.title,
      start_time: formData.startTime,
      end_time: formData.endTime,
      priority: formData.priority,
      notification_time: formData.notification_time,
    };

    console.log(newSchedule);
    try {
      const result = await createSchedule(newSchedule);
      console.log("Data truoc khi call API Create New Schedule", newSchedule);
      console.log(result);
      if (result.status === 201) {
        setApiSchedules((prevSchedules) => [
          ...prevSchedules,
          { ...newSchedule },
        ]);
        resetForm();
      } else {
        console.log("Error creating Schedule");
      }
    } catch (error) {
      console.error("Lỗi khi tạo lịch làm việc:", error);
    }

    setFormData({
      startTime: "",
      endTime: "",
      title: "",
      priority: "",
      notification_time: false,
    });
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
    const dateString = date.toLocaleDateString(); // Ngày hiện tại theo định dạng địa phương
    const daySchedules = apiSchedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.start_time).toLocaleDateString(); // Chuyển đổi ngày từ lịch trình
      return scheduleDate === dateString; // So sánh ngày
    });
    const displaySchedules = daySchedules.slice(0, 2);
    const remainingCount = daySchedules.length - 2;

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
    // Điều hướng đến trang chỉnh sửa hoặc mở modal chỉnh sửa
    console.log("Chỉnh sửa lịch trình:", schedule);
    setFormData({
      title: schedule.title,
      startTime: schedule.start_time,
      endTime: schedule.end_time,
      priority: schedule.priority,
      notification_time: schedule.notification_time,
    });
    setIsFormVisible(true);
    setIsModalVisible(false);
    // Thêm logic để mở modal chỉnh sửa hoặc điều hướng đến trang chỉnh sửa
  };

  const handleDelete = async (id) => {
    try {
      const data = await deleteSchedule(id);
      console.log(data);
      setApiSchedules((prevSchedules) =>
        prevSchedules.filter((schedule) => schedule.id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  //

  //

  //

  //
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
                <label className="label"> Thời gian </label>
                <div className="time-range">
                  Từ
                  <input
                    type="text"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                  />
                  <span>-</span>
                  <input
                    type="text"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
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

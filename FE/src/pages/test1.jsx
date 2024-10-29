import { useState } from "react";
import "./Test1.css";
import "./Test2.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCalendarAlt,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";

const Test2 = () => {
  const [schedules, setSchedules] = useState({});
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    content: "",
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // State cho thông báo
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);
  const notifications = [
    "Thông báo 1: Bạn có một cuộc họp lúc 10h.",
    "Thông báo 2: Đừng quên nộp báo cáo vào cuối ngày.",
    "Thông báo 3: Lịch trình đã được cập nhật.",
  ];

  // State cho chế độ hiển thị
  const [isAppointmentMode, setIsAppointmentMode] = useState(false);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsFormVisible(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dateString = selectedDate.toISOString().split("T")[0];
    const newSchedule = { ...formData };
    setSchedules((prev) => {
      const daySchedules = prev[dateString] || [];
      return {
        ...prev,
        [dateString]: [...daySchedules, newSchedule],
      };
    });
    setFormData({ startTime: "", endTime: "", content: "" });
    setIsFormVisible(false);
  };
  const resetForm = () => {
    setFormData({ startTime: "", endTime: "", content: "" });
    setIsFormVisible(false);
  };

  const renderSchedules = (date) => {
    const dateString = date.toISOString().split("T")[0];
    const daySchedules = schedules[dateString] || [];
    const displaySchedules = daySchedules.slice(0, 2);
    const remainingCount = daySchedules.length - 2;
    return (
      <div>
        {displaySchedules.map((schedule, index) => (
          <div className="schedule" key={index}>
            {schedule.content}
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="schedule">{`Còn ${remainingCount} lịch khác`}</div>
        )}
      </div>
    );
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
          className="appointment"
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
                  onChange="{handleInputChange}"
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
                    onChange="{handleInputChange}"
                    required
                  />
                  <span>-</span>
                  <input
                    type="text"
                    name="endTime"
                    onChange="{handleInputChange}"
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
                      name="importance"
                      value="high"
                      checked={formData.importance === "high"}
                      onChange={handleInputChange}
                    />
                    <span className="high">High</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="importance"
                      value="medium"
                      checked={formData.importance === "medium"}
                      onChange={handleInputChange}
                    />
                    <span className="medium">Medium</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="importance"
                      value="low"
                      checked={formData.importance === "low"}
                      onChange={handleInputChange}
                    />
                    <span className="low">Low</span>
                  </label>
                </div>
              </div>

              <label className="notification-checkbox">
                <input
                  type="checkbox"
                  name="notify"
                  onChange="{handleInputChange}"
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

export default Test2;

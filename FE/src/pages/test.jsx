import React, { useState } from "react";
import "./Test.css";

const Test = () => {
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

  // Chuyển đến tháng chứa ngày hôm nay
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

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
    //
    const newSchedule = { ...formData };
    // data form data
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
  //

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const renderCalendar = () => {
    const totalDays = daysInMonth(currentMonth, currentYear);
    const calendarDays = Array.from({ length: totalDays }, (_, i) => {
      const currentDate = new Date(currentYear, currentMonth, i + 1);
      return (
        <div
          className="day"
          key={currentDate.toISOString()}
          onClick={() => handleDateClick(currentDate)}
        >
          {currentDate.getDate()}
          {renderSchedules(currentDate)}
        </div>
      );
    });

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

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prevYear) => prevYear + 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth + 1);
    }
  };

  return (
    <div className="calendar">
      <div className="header">
        <button className="month-button" onClick={goToPreviousMonth}>
          &#60;
        </button>
        <h1>Lịch Làm Việc - {`${currentMonth + 1}/${currentYear}`}</h1>
        <button className="month-button" onClick={goToNextMonth}>
          &#62;
        </button>
        <button className="today-button" onClick={goToToday}>
          Hôm nay
        </button>
      </div>
      <div className="grid">{renderCalendar()}</div>
      {isFormVisible && (
        <div className="form-overlay">
          <form className="schedule-form" onSubmit={handleSubmit}>
            <h2>Đặt Lịch Làm Việc</h2>
            <label>
              Thời gian bắt đầu:
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Thời gian kết thúc:
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Nội dung:
              <input
                type="text"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
              />
            </label>
            <button type="submit">Lưu</button>
            <button type="button" onClick={() => setIsFormVisible(false)}>
              Đóng
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Test;

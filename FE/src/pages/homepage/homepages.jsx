import { useContext, useEffect, useState } from "react";
import "../test1.css";
import "../test2.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCalendar,
  faL,
  faSquareShareNodes,
} from "@fortawesome/free-solid-svg-icons";
import {
  acceptBooking,
  createSchedule,
  deleteSchedule,
  getBooking,
  getScheduleById,
  rejectBooking,
  shareLink,
  updateSchedule,
} from "../../util/api";
import { AuthContext } from "../../context/wrapContext";

const HomePage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [endTimeOptions, setEndTimeOptions] = useState([]);
  const [formDataEdit, setFormDataEdit] = useState({
    id: 0,
    updateTitle: "",
    updateStartTime: "",
    updateEndTime: "",
    updatePriority: "",
    updateNotification_time: false,
  });
  const [formShareLink, setFormShareLink] = useState({
    link: "",
  });
  const [formData, setFormData] = useState({
    title: "",
    startTime: "",
    endTime: "",
    priority: "",
    notification_time: false,
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isFormEdit, setIsFormEdit] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalBooking, setIsModalBooking] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState(null);

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
    const getInfo = localStorage.getItem("info");
    const user = JSON.parse(getInfo);

    const fetchSchedules = async () => {
      try {
        const response = await getScheduleById(user?.data?.user?.id);
        const schedules = Array.isArray(response.message)
          ? response.message
          : [];
        return schedules.map((schedule) => ({ ...schedule, type: "schedule" })); // Gắn thêm type 'schedule'
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API (schedules):", error);
        return []; // Trả về mảng rỗng nếu có lỗi
      }
    };

    const fetchBooking = async () => {
      try {
        const response = await getBooking(user?.data?.user?.id);
        const bookings = Array.isArray(response.message)
          ? response.message
          : [];
        return bookings.map((booking) => ({ ...booking, type: "booking" })); // Gắn thêm type 'booking'
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API (bookings):", error);
        return []; // Trả về mảng rỗng nếu có lỗi
      }
    };

    const fetchAllData = async () => {
      const schedules = await fetchSchedules();
      const bookings = await fetchBooking();
      const combinedData = [...schedules, ...bookings]; // Kết hợp dữ liệu từ cả hai
      console.log(combinedData);
      setApiSchedules(combinedData); // Cập nhật state với dữ liệu đã kết hợp
    };

    fetchAllData();
  }, []);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsFormVisible(true);
    console.log("B1 CHỌN DATE ===> Mở MODAL", date);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "startTime") {
    }
  };
  const handleUpdateInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormDataEdit((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "startTime") {
    }
  };

  const resetForm = () => {
    setFormData({
      startTime: "",
      endTime: "",
      title: "",
      priority: "",
      notification_time: false,
    });
    setFormDataEdit({
      updateTitle: "",
      updateStartTime: "",
      updateEndTime: "",
      updatePriority: "",
      updateNotification_time: false,
    });
    setIsFormEdit(false);
    setIsFormVisible(false);
  };
  const renderSchedules = (date) => {
    const dateString = date.toLocaleDateString();

    if (!Array.isArray(apiSchedules)) {
      return <div className=""></div>;
    }

    const daySchedules = apiSchedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.start_time).toLocaleDateString();
      return scheduleDate === dateString;
    });

    if (daySchedules.length === 0) {
      return <div className=""></div>;
    }

    const displaySchedules = daySchedules.slice(0, 2);
    const remainingCount = daySchedules.length - displaySchedules.length;

    return (
      <div>
        {displaySchedules.map((schedule, index) => (
          <div
            className={`schedule ${
              schedule.type === "booking"
                ? schedule.status === "approved"
                  ? "approved bg-red-600" // Lớp cho booking đã được chấp nhận
                  : "pending bg-red-900" // Lớp cho booking đang chờ
                : ""
            }`}
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              handleScheduleClick(schedule);
            }}
          >
            {schedule.type === "booking" ? schedule.content : schedule.title}
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="schedule">{`Còn ${remainingCount} lịch khác`}</div>
        )}
      </div>
    );
  };

  // const renderSchedules = (date) => {
  //   // Ngày hiện tại theo định dạng địa phương
  //   const dateString = date.toLocaleDateString();

  //   // Kiểm tra xem apiSchedules có phải là một mảng không
  //   if (!Array.isArray(apiSchedules)) {
  //     return <div className=""></div>;
  //   }

  //   // Lọc lịch trình theo ngày
  //   const daySchedules = apiSchedules.filter((schedule) => {
  //     const scheduleDate = new Date(schedule.start_time).toLocaleDateString(); // Chuyển đổi ngày từ lịch trình
  //     return scheduleDate === dateString; // So sánh ngày
  //   });

  //   // Kiểm tra nếu không có lịch trình nào trong ngày
  //   if (daySchedules.length === 0) {
  //     return <div className=""></div>;
  //   }

  //   // Chọn tối đa 2 lịch trình để hiển thị
  //   const displaySchedules = daySchedules.slice(0, 2);
  //   const remainingCount = daySchedules.length - displaySchedules.length; // Tính số lịch trình còn lại

  //   return (
  //     <div>
  //       {displaySchedules.map((schedule, index) => (
  //         <div
  //           className={`schedule ${
  //             schedule.type === "booking" ? "booking" : ""
  //           }`} // Thêm lớp bg-yellow nếu là lịch booking
  //           key={index}
  //           onClick={(e) => {
  //             e.stopPropagation(); // Ngăn chặn sự kiện click từ propagating lên thẻ cha
  //             handleScheduleClick(schedule); // Gọi hàm xử lý sự kiện click
  //           }}
  //         >
  //           {schedule.type === "booking" ? schedule.content : schedule.title}{" "}
  //           {/* Hiển thị content nếu là booking, title nếu là schedule */}
  //         </div>
  //       ))}
  //       {remainingCount > 0 && (
  //         <div className="schedule">{`Còn ${remainingCount} lịch khác`}</div>
  //       )}
  //     </div>
  //   );
  // };

  const handleScheduleClick = (schedule) => {
    if (schedule.type === "booking") {
      console.log("Thông tin booking:", schedule);
      setSelectedBookings(schedule);
      setIsModalBooking(true);

      // Nếu booking là pending hoặc approved, bạn có thể thêm logic ở đây nếu cần
      if (schedule.status === "pending") {
        console.log("Booking đang chờ phê duyệt.");
        // Thêm logic cụ thể cho trạng thái pending nếu cần
      } else if (schedule.status === "approved") {
        console.log("Booking đã được phê duyệt.");
        // Thêm logic cụ thể cho trạng thái approved nếu cần
      }
    } else if (schedule.type === "schedule") {
      console.log("Thông tin schedule:", schedule);
      setSelectedSchedule(schedule);
      setIsModalVisible(true);
    }
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
    const start_timee = convertTo12HourFormat(schedule.start_time);
    const end_timee = convertTo12HourFormat(schedule.end_time);
    console.log(schedule.id);
    console.log(start_timee, end_timee, "check starttime endTime");
    setFormDataEdit({
      id: schedule.id,
      updateTitle: schedule.title,
      updateStartTime: start_timee,
      updateEndTime: end_timee || "", //
      updatePriority: schedule.priority,
      updateNotification_time: schedule.notification_time,
    });

    updateEndTimeOptions(start_timee);
    setIsFormEdit(true);
    setIsModalVisible(false);
  };

  const handleDelete = async (id) => {
    try {
      const data = await deleteSchedule(id);
      console.log(data);
      if (data.status === 200) {
        setApiSchedules((prevSchedules) => {
          if (prevSchedules) {
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

  const updateEndTimeOptions = (selectedStartTime) => {
    const startIndex = timeOptions.findIndex(
      (time) => time === selectedStartTime
    );

    const availableEndTimes = timeOptions.filter(
      (time, index) => index > startIndex
    );

    setEndTimeOptions(availableEndTimes);

    setFormData((prevData) => ({
      ...prevData,
      endTime: "", // Reset endTime to an empty string
    }));

    console.log("Available End Times:", availableEndTimes);
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
  const convertTo12HourFormat = (isoString) => {
    const date = new Date(isoString);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // Chuyển sang định dạng 12 giờ

    return `${hours}:${minutes} ${ampm}`;
  };

  const handleShareLink = async () => {
    const user = JSON.parse(localStorage.getItem("info"));
    console.log(user);
    const userID = user?.data?.user?.id;
    console.log(userID);
    try {
      const getLink = await shareLink(userID);
      console.log(getLink);
    } catch (error) {
      console.log(error);
    }
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

  const handleSumitUpdate = async (e) => {
    e.preventDefault();
    const date = convertDate(selectedSchedule.start_time);

    const startTime = convertTime(formDataEdit.updateStartTime);
    const endTime = convertTime(formDataEdit.updateEndTime);
    const user_id = JSON.parse(localStorage.getItem("info")).data.user.id;
    const id = formDataEdit.id;
    console.log(date);
    const updatedSchedule = {
      id: formDataEdit.id,
      user_id: user_id, // Lấy user_id từ localStorage
      title: formDataEdit.updateTitle,
      start_time: `${date}T${startTime}`,
      end_time: `${date}T${endTime}`,
      priority: formDataEdit.updatePriority || "low",
      notification_time: formDataEdit.updateNotification_time,
    };

    console.log(updatedSchedule);

    try {
      const result = await updateSchedule(id, updatedSchedule);
      console.log("Data trước khi call API Update Schedule", updatedSchedule);
      console.log(result);

      if (result.status === 200) {
        setApiSchedules((prevSchedules) => {
          if (Array.isArray(prevSchedules)) {
            return prevSchedules.map((schedule) =>
              schedule.id === id
                ? { ...schedule, ...updatedSchedule }
                : schedule
            );
          } else {
            console.error("prevSchedules is not an array", prevSchedules);
          }
        });
        resetForm();
      } else {
        console.log("Error updating Schedule");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật lịch làm việc:", error);
    }

    setIsFormVisible(false);
  };
  const handleRejectBooking = async (booking) => {
    try {
      const data = await rejectBooking(booking.id_booking);
      console.log(data);
      if (data.status === 200) {
        console.log("ok");
        setApiSchedules((prevSchedules) =>
          prevSchedules.filter(
            (item) => item.id !== booking.id || item.type !== "booking"
          )
        );
      }
      setIsModalBooking(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleAcceptBooking = async (booking) => {
    try {
      const data = await acceptBooking(booking.id_booking);
      console.log(data);
      if (data.status === 200) {
        console.log("ok");
        setApiSchedules((prevSchedules) =>
          prevSchedules.map(
            (item) =>
              item.id === booking.id ? { ...item, status: "approved" } : item // Cập nhật booking
          )
        );

        setIsModalBooking(false);
      }
    } catch (error) {
      console.log(error);
    }
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
        <button onClick={() => handleShareLink()}>
          <FontAwesomeIcon icon={faSquareShareNodes} />
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
      {isModalBooking && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalBooking(false)}>
              &times;
            </span>
            {selectedBookings && (
              <div>
                <h2>{selectedBookings.guest_name}</h2>
                <h2>{selectedBookings.guest_email}</h2>
                <p>
                  <strong>Thời gian bắt đầu:</strong>{" "}
                  {new Date(selectedBookings.start_time).toLocaleString()}
                </p>
                <p>
                  <strong>Thời gian kết thúc:</strong>{" "}
                  {new Date(selectedBookings.end_time).toLocaleString()}
                </p>
                <div>
                  <button onClick={() => handleRejectBooking(selectedBookings)}>
                    Từ Chối
                  </button>
                  <button onClick={() => handleAcceptBooking(selectedBookings)}>
                    Xác nhận
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
                      endTime: "", // Reset endTime khi thay đổi startTime
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
                  disabled={!formData.startTime} // Chỉ cho phép chọn khi có giá trị startTime
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
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {isFormEdit && (
        <div className="form-overlay">
          <form className="schedule-form" onSubmit={handleSumitUpdate}>
            <div className="close-form" onClick={() => resetForm()}>
              ICON CLOSE
            </div>
            <div className="form-input">
              <label className="title-input">
                Tiêu đề
                <input
                  type="text"
                  name="updateTitle"
                  value={formDataEdit.updateTitle}
                  onChange={handleUpdateInputChange}
                  required
                />
              </label>
              <div className="time-input">
                <select
                  id="updateStartTime"
                  name="updateStartTime"
                  value={formDataEdit.updateStartTime}
                  onChange={(e) => {
                    const selectedStartTime = e.target.value;
                    setFormDataEdit((prevData) => ({
                      ...prevData,
                      updateStartTime: selectedStartTime,
                      updateEndTimeo: "", // Reset endTime khi thay đổi startTime
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
                  id="updateEndTime"
                  name="updateEndTime"
                  value={formDataEdit.updateEndTime}
                  onChange={(e) => {
                    const selectedEndTime = e.target.value;
                    setFormDataEdit((prevData) => ({
                      ...prevData,
                      updateEndTime: selectedEndTime,
                    }));
                  }}
                  required={!!formDataEdit.updateStartTime}
                  disabled={!formDataEdit.updateStartTime} // Chỉ cho phép chọn khi có giá trị startTime
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
                      name="updatePriority"
                      value="high"
                      checked={formDataEdit.updatePriority === "high"}
                      onChange={handleUpdateInputChange}
                    />
                    <span className="high">High</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="updatePriority"
                      value="medium"
                      checked={formDataEdit.updatePriority === "medium"}
                      onChange={handleUpdateInputChange}
                    />
                    <span className="medium">Medium</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="updatePriority"
                      value="low"
                      checked={formDataEdit.updatePriority === "low"}
                      onChange={handleUpdateInputChange}
                    />
                    <span className="low">Low</span>
                  </label>
                </div>
              </div>
              <label className="notification-checkbox">
                <input
                  type="checkbox"
                  name="updateNotification_time"
                  checked={formDataEdit.updateNotification_time}
                  onChange={handleUpdateInputChange}
                />
                Nhận thông báo khi gần đến
              </label>
            </div>
            <button className="button-form">Update</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default HomePage;

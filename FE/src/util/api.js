import axios from "./axiosCustom";

export const loginAPI = (email, password) => {
  const URL_API = "v1/apiUser/login";
  return axios.post(URL_API, { email: email, password: password });
};
export const registerAPI = (name, password, email, phone) => {
  const URL_API = "/v1/apiUser/register";
  return axios.post(URL_API, { name, password, email, phone });
};
//
export const getSchedule = (id) => {
  const URL_API = "v1/apiSchedule/get-schedule";
  return axios.get(URL_API, { id });
};
export const getScheduleById = (id) => {
  const URL_API = `/v1/apiSchedule/get-schedule/${id}`;
  return axios.post(URL_API, { id });
};
export const createSchedule = (data) => {
  const URL_API = "v1/apiSchedule/create-schedule";
  return axios.post(URL_API, data);
};
export const deleteSchedule = (id) => {
  const URL_API = `/v1/apiSchedule/delete-schedule/${id}`;
  return axios.post(URL_API);
};

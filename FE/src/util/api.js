import axios from "./axiosCustom";

export const getAllUser = () => {
  const URL_API = "/v1/apiUser/getAllUser";

  return axios.get(URL_API);
};

export const loginAPI = (email, password) => {
  const URL_API = "/v1/apiUser/login-user";
  return axios.post(URL_API, { email: email, password: password });
};
export const registerAPI = (name, password, email, phone) => {
  const URL_API = "/v1/apiUser/register-user";
  return axios.post(URL_API, { name, password, email, phone });
};
//
export const getProductByTag = (id_tag) => {
  const URL_API = `/v1/apiProduct/get-product-by-tag/${id_tag}`;
  return axios.post(URL_API);
};

export const getDetailProduct = (id) => {
  const URL_API = `/v1/apiProduct/get-product-by-id/${id}`;
  return axios.post(URL_API);
};

export const getCart = (id) => {
  const URL_API = `/v1/apiCart/get-cart/${id}`;
  return axios.get(URL_API);
};

export const order = (id, data) => {
  const URL_API = `/v1/apiOrder/order/${id}`;
  return axios.post(URL_API, data);
};
export const deleteCart = (id) => {
  const URL_API = `/v1/apiCart/delete-cart`;
  return axios.post(URL_API, { id: id });
};
export const forgotPassword = (email) => {
  const URL_API = `/v1/apiUser/forgot-password-user`;
  return axios.post(URL_API, { email: email });
};
export const verifyCOde = (data) => {
  const URL_API = `/v1/apiUser/verify-code`;
  return axios.post(URL_API, data);
};

export const resetPassword = (data) => {
  const URL_API = `/v1/apiUser/reset-pass`;
  return axios.post(URL_API, data);
};
export const addCart = (data) => {
  const URL_API = `/v1/apiCart/add-cart`;
  return axios.post(URL_API, data);
};

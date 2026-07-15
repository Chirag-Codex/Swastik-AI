import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { getToken, setToken, removeToken, setUser, removeUser } from '../../utils/auth';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
} from './ActionType';

export const register = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, userData);
    const data = response.data;
    setToken(data.token);
    setUser({ email: data.email, fullName: data.fullName, role: data.role });
    dispatch({ type: REGISTER_SUCCESS, payload: data });
    return data;
  } catch (error) {
    console.log('Register error:', error.response?.data || error.message);
    throw error;
  }
};

export const login = (credentials) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, credentials);
    const data = response.data;
    setToken(data.token);
    setUser({ email: data.email, fullName: data.fullName, role: data.role });
    dispatch({ type: LOGIN_SUCCESS, payload: data });
    return data;
  } catch (error) {
    console.log('Login error:', error.response?.data || error.message);
    throw error;
  }
};

export const getProfile = () => async (dispatch) => {
  dispatch({ type: GET_PROFILE_REQUEST });
  try {
    const token = getToken();
    const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: GET_PROFILE_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    console.log('Get profile error:', error.response?.data || error.message);
    throw error;
  }
};

export const logout = () => (dispatch) => {
  removeToken();
  removeUser();
  dispatch({ type: LOGOUT });
};
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { getToken } from '../../utils/auth';
import {
  GET_REMINDERS_REQUEST,
  GET_REMINDERS_SUCCESS,
  ADD_REMINDER_REQUEST,
  ADD_REMINDER_SUCCESS,
  UPDATE_REMINDER_REQUEST,
  UPDATE_REMINDER_SUCCESS,
  DELETE_REMINDER_REQUEST,
  DELETE_REMINDER_SUCCESS,
  TOGGLE_REMINDER_REQUEST,
  TOGGLE_REMINDER_SUCCESS,
} from './ActionType';

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const getReminders = () => async (dispatch) => {
  dispatch({ type: GET_REMINDERS_REQUEST });
  try {
    const response = await axios.get(`${API_BASE_URL}/api/reminders`, getAuthHeaders());
    dispatch({ type: GET_REMINDERS_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    console.log('Get reminders error:', error.response?.data || error.message);
    throw error;
  }
};

export const addReminder = (reminderData) => async (dispatch) => {
  dispatch({ type: ADD_REMINDER_REQUEST });
  try {
    const response = await axios.post(`${API_BASE_URL}/api/reminders`, reminderData, getAuthHeaders());
    dispatch({ type: ADD_REMINDER_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    console.log('Add reminder error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateReminder = (id, reminderData) => async (dispatch) => {
  dispatch({ type: UPDATE_REMINDER_REQUEST });
  try {
    const response = await axios.put(`${API_BASE_URL}/api/reminders/${id}`, reminderData, getAuthHeaders());
    dispatch({ type: UPDATE_REMINDER_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    console.log('Update reminder error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteReminder = (id) => async (dispatch) => {
  dispatch({ type: DELETE_REMINDER_REQUEST });
  try {
    await axios.delete(`${API_BASE_URL}/api/reminders/${id}`, getAuthHeaders());
    dispatch({ type: DELETE_REMINDER_SUCCESS, payload: id });
  } catch (error) {
    console.log('Delete reminder error:', error.response?.data || error.message);
    throw error;
  }
};

export const toggleReminder = (id, active) => async (dispatch) => {
  dispatch({ type: TOGGLE_REMINDER_REQUEST });
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/reminders/${id}/toggle?active=${active}`,
      {},
      getAuthHeaders()
    );
    dispatch({ type: TOGGLE_REMINDER_SUCCESS, payload: { id, active } });
    return response.data;
  } catch (error) {
    console.log('Toggle reminder error:', error.response?.data || error.message);
    throw error;
  }
};
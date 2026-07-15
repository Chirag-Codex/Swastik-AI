import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { getToken } from '../../utils/auth';
import {
  GET_NOTIFICATIONS_REQUEST,
  GET_NOTIFICATIONS_SUCCESS,
  MARK_READ_REQUEST,
  MARK_READ_SUCCESS,
  MARK_ALL_READ_REQUEST,
  MARK_ALL_READ_SUCCESS,
  GET_UNREAD_COUNT_REQUEST,
  GET_UNREAD_COUNT_SUCCESS,
} from './ActionType';

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const getNotifications = () => async (dispatch) => {
  dispatch({ type: GET_NOTIFICATIONS_REQUEST });
  try {
    const response = await axios.get(`${API_BASE_URL}/api/notifications`, getAuthHeaders());
    dispatch({ type: GET_NOTIFICATIONS_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    console.log('Get notifications error:', error.response?.data || error.message);
    throw error;
  }
};

export const markRead = (id) => async (dispatch) => {
  dispatch({ type: MARK_READ_REQUEST });
  try {
    await axios.patch(`${API_BASE_URL}/api/notifications/${id}/read`, {}, getAuthHeaders());
    dispatch({ type: MARK_READ_SUCCESS, payload: id });
  } catch (error) {
    console.log('Mark read error:', error.response?.data || error.message);
    throw error;
  }
};

export const markAllRead = () => async (dispatch) => {
  dispatch({ type: MARK_ALL_READ_REQUEST });
  try {
    await axios.patch(`${API_BASE_URL}/api/notifications/mark-all-read`, {}, getAuthHeaders());
    dispatch({ type: MARK_ALL_READ_SUCCESS });
  } catch (error) {
    console.log('Mark all read error:', error.response?.data || error.message);
    throw error;
  }
};

export const getUnreadCount = () => async (dispatch) => {
  dispatch({ type: GET_UNREAD_COUNT_REQUEST });
  try {
    const response = await axios.get(`${API_BASE_URL}/api/notifications/unread/count`, getAuthHeaders());
    dispatch({ type: GET_UNREAD_COUNT_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    console.log('Get unread count error:', error.response?.data || error.message);
    throw error;
  }
};
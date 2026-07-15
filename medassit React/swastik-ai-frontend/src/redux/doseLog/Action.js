import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { getToken } from '../../utils/auth';
import {
  GET_DOSE_LOGS_REQUEST,
  GET_DOSE_LOGS_SUCCESS,
  LOG_DOSE_REQUEST,
  LOG_DOSE_SUCCESS,
  CONFIRM_DOSE_REQUEST,
  CONFIRM_DOSE_SUCCESS,
} from './ActionType';

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const getDoseLogs = () => async (dispatch) => {
  dispatch({ type: GET_DOSE_LOGS_REQUEST });
  try {
    const response = await axios.get(`${API_BASE_URL}/api/doselogs`, getAuthHeaders());
    dispatch({ type: GET_DOSE_LOGS_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    console.log('Get dose logs error:', error.response?.data || error.message);
    throw error;
  }
};

export const logDose = (reminderId, taken, late) => async (dispatch) => {
  dispatch({ type: LOG_DOSE_REQUEST });
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/doselogs?reminderId=${reminderId}&taken=${taken}&late=${late}`,
      {},
      getAuthHeaders()
    );
    dispatch({ type: LOG_DOSE_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    console.log('Log dose error:', error.response?.data || error.message);
    throw error;
  }
};

export const confirmDoseTaken = (reminderId, late = false) => async (dispatch) => {
  dispatch({ type: CONFIRM_DOSE_REQUEST });
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/doselogs?reminderId=${reminderId}&taken=true&late=${late}`,
      {},
      getAuthHeaders()
    );
    dispatch({ type: CONFIRM_DOSE_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    console.log('Confirm dose error:', error.response?.data || error.message);
    throw error;
  }
};
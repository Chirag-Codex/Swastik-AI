import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { getToken } from '../../utils/auth';
import {
  GET_DASHBOARD_REQUEST,
  GET_DASHBOARD_SUCCESS,
  GET_ADHERENCE_REQUEST,
  GET_ADHERENCE_SUCCESS,
} from './ActionType';

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const getDashboard = () => async (dispatch) => {
  dispatch({ type: GET_DASHBOARD_REQUEST });
  try {
    const response = await axios.get(`${API_BASE_URL}/api/dashboard/adherence`, getAuthHeaders());
    dispatch({ type: GET_DASHBOARD_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    console.log('Get dashboard error:', error.response?.data || error.message);
    throw error;
  }
};

export const getAdherence = (days = 30) => async (dispatch) => {
  dispatch({ type: GET_ADHERENCE_REQUEST });
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/dashboard/adherence?days=${days}`,
      getAuthHeaders()
    );
    dispatch({ type: GET_ADHERENCE_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    console.log('Get adherence error:', error.response?.data || error.message);
    throw error;
  }
};
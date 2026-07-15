import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { getToken } from '../../utils/auth';
import {
  GET_MEDICINES_REQUEST,
  GET_MEDICINES_SUCCESS,
  ADD_MEDICINE_REQUEST,
  ADD_MEDICINE_SUCCESS,
  UPDATE_MEDICINE_REQUEST,
  UPDATE_MEDICINE_SUCCESS,
  DELETE_MEDICINE_REQUEST,
  DELETE_MEDICINE_SUCCESS,
  GET_MEDICINE_INFO_REQUEST,
  GET_MEDICINE_INFO_SUCCESS,
  CLEAR_MEDICINE_INFO,
} from './ActionType';

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const getMedicines = () => async (dispatch) => {
  dispatch({ type: GET_MEDICINES_REQUEST });
  try {
    const response = await axios.get(`${API_BASE_URL}/api/medicines`, getAuthHeaders());
    dispatch({ type: GET_MEDICINES_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    console.log('Get medicines error:', error.response?.data || error.message);
    throw error;
  }
};

export const addMedicine = (medicineData) => async (dispatch) => {
  dispatch({ type: ADD_MEDICINE_REQUEST });
  try {
    const response = await axios.post(`${API_BASE_URL}/api/medicines`, medicineData, getAuthHeaders());
    dispatch({ type: ADD_MEDICINE_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    console.log('Add medicine error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateMedicine = (id, medicineData) => async (dispatch) => {
  dispatch({ type: UPDATE_MEDICINE_REQUEST });
  try {
    const response = await axios.put(`${API_BASE_URL}/api/medicines/${id}`, medicineData, getAuthHeaders());
    dispatch({ type: UPDATE_MEDICINE_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    console.log('Update medicine error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteMedicine = (id) => async (dispatch) => {
  dispatch({ type: DELETE_MEDICINE_REQUEST });
  try {
    await axios.delete(`${API_BASE_URL}/api/medicines/${id}`, getAuthHeaders());
    dispatch({ type: DELETE_MEDICINE_SUCCESS, payload: id });
  } catch (error) {
    console.log('Delete medicine error:', error.response?.data || error.message);
    throw error;
  }
};

export const getMedicineInfo = (name) => async (dispatch) => {
  dispatch({ type: GET_MEDICINE_INFO_REQUEST });
  try {
    // Using the assistant chat endpoint to get medicine info
    const response = await axios.post(
      `${API_BASE_URL}/api/assistant/chat`,
      { message: `Tell me about the medicine: ${name}. What is it used for, dosage, and precautions?` },
      getAuthHeaders()
    );
    dispatch({ type: GET_MEDICINE_INFO_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    console.log('Get medicine info error:', error.response?.data || error.message);
    throw error;
  }
};

export const clearMedicineInfo = () => (dispatch) => {
  dispatch({ type: CLEAR_MEDICINE_INFO });
};
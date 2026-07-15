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

const initialState = {
  medicines: [],
  loading: false,
  error: null,
  medicineInfo: null,
  infoLoading: false,
};

const medicineReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MEDICINES_REQUEST:
    case ADD_MEDICINE_REQUEST:
    case UPDATE_MEDICINE_REQUEST:
    case DELETE_MEDICINE_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_MEDICINES_SUCCESS:
      return { ...state, loading: false, medicines: action.payload, error: null };

    case ADD_MEDICINE_SUCCESS:
      return {
        ...state,
        loading: false,
        medicines: [...state.medicines, action.payload],
        error: null,
      };

    case UPDATE_MEDICINE_SUCCESS:
      return {
        ...state,
        loading: false,
        medicines: state.medicines.map((m) =>
          m.id === action.payload.id ? action.payload : m
        ),
        error: null,
      };

    case DELETE_MEDICINE_SUCCESS:
      return {
        ...state,
        loading: false,
        medicines: state.medicines.filter((m) => m.id !== action.payload),
        error: null,
      };

    case GET_MEDICINE_INFO_REQUEST:
      return { ...state, infoLoading: true, error: null };

    case GET_MEDICINE_INFO_SUCCESS:
      return {
        ...state,
        infoLoading: false,
        medicineInfo: action.payload,
        error: null,
      };

    case CLEAR_MEDICINE_INFO:
      return { ...state, medicineInfo: null, infoLoading: false };

    default:
      return state;
  }
};

export default medicineReducer;
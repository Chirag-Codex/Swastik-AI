import {
  GET_DOSE_LOGS_REQUEST,
  GET_DOSE_LOGS_SUCCESS,
  LOG_DOSE_REQUEST,
  LOG_DOSE_SUCCESS,
  CONFIRM_DOSE_REQUEST,
  CONFIRM_DOSE_SUCCESS,
} from './ActionType';

const initialState = {
  doseLogs: [],
  loading: false,
  error: null,
};

const doseLogReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DOSE_LOGS_REQUEST:
    case LOG_DOSE_REQUEST:
    case CONFIRM_DOSE_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_DOSE_LOGS_SUCCESS:
      return { ...state, loading: false, doseLogs: action.payload, error: null };

    case LOG_DOSE_SUCCESS:
    case CONFIRM_DOSE_SUCCESS:
      return {
        ...state,
        loading: false,
        doseLogs: [action.payload, ...state.doseLogs],
        error: null,
      };

    default:
      return state;
  }
};

export default doseLogReducer;
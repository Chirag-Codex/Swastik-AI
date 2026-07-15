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

const initialState = {
  reminders: [],
  loading: false,
  error: null,
};

const reminderReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REMINDERS_REQUEST:
    case ADD_REMINDER_REQUEST:
    case UPDATE_REMINDER_REQUEST:
    case DELETE_REMINDER_REQUEST:
    case TOGGLE_REMINDER_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_REMINDERS_SUCCESS:
      return { ...state, loading: false, reminders: action.payload, error: null };

    case ADD_REMINDER_SUCCESS:
      return {
        ...state,
        loading: false,
        reminders: [...state.reminders, action.payload],
        error: null,
      };

    case UPDATE_REMINDER_SUCCESS:
      return {
        ...state,
        loading: false,
        reminders: state.reminders.map((r) =>
          r.id === action.payload.id ? action.payload : r
        ),
        error: null,
      };

    case DELETE_REMINDER_SUCCESS:
      return {
        ...state,
        loading: false,
        reminders: state.reminders.filter((r) => r.id !== action.payload),
        error: null,
      };

    case TOGGLE_REMINDER_SUCCESS:
      return {
        ...state,
        loading: false,
        reminders: state.reminders.map((r) =>
          r.id === action.payload.id ? { ...r, active: action.payload.active } : r
        ),
        error: null,
      };

    default:
      return state;
  }
};

export default reminderReducer;
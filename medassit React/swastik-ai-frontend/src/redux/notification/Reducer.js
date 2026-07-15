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

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_NOTIFICATIONS_REQUEST:
    case MARK_READ_REQUEST:
    case MARK_ALL_READ_REQUEST:
    case GET_UNREAD_COUNT_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: action.payload,
        error: null,
      };

    case MARK_READ_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, readFlag: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
        error: null,
      };

    case MARK_ALL_READ_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: state.notifications.map((n) => ({ ...n, readFlag: true })),
        unreadCount: 0,
        error: null,
      };

    case GET_UNREAD_COUNT_SUCCESS:
      return {
        ...state,
        loading: false,
        unreadCount: action.payload,
        error: null,
      };

    default:
      return state;
  }
};

export default notificationReducer;
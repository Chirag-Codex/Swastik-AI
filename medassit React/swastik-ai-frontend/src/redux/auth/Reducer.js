import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
} from './ActionType';
import { getUser, isAuthenticated } from '../../utils/auth';

const initialState = {
  user: getUser(),
  isAuthenticated: isAuthenticated(),
  loading: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
    case GET_PROFILE_REQUEST:
      return { ...state, loading: true, error: null };

    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: {
          email: action.payload.email,
          fullName: action.payload.fullName,
          role: action.payload.role,
        },
        error: null,
      };

    case GET_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        error: null,
      };

    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      };

    default:
      return state;
  }
};

export default authReducer;
import {
  GET_DASHBOARD_REQUEST,
  GET_DASHBOARD_SUCCESS,
  GET_ADHERENCE_REQUEST,
  GET_ADHERENCE_SUCCESS,
} from './ActionType';

const initialState = {
  dashboard: null,
  adherence: null,
  loading: false,
  error: null,
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DASHBOARD_REQUEST:
    case GET_ADHERENCE_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_DASHBOARD_SUCCESS:
      return { ...state, loading: false, dashboard: action.payload, error: null };

    case GET_ADHERENCE_SUCCESS:
      return { ...state, loading: false, adherence: action.payload, error: null };

    default:
      return state;
  }
};

export default dashboardReducer;
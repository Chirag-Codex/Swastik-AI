import { ADD_MESSAGE, CLEAR_CHAT } from './ActionType';

const initialState = {
  messages: [],
  loading: false,
  error: null,
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case CLEAR_CHAT:
      return {
        ...state,
        messages: [],
        error: null,
      };

    default:
      return state;
  }
};

export default chatReducer;
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { getToken } from '../../utils/auth';
import {
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_SUCCESS,
  SEND_MEDIA_REQUEST,
  SEND_MEDIA_SUCCESS,
  ADD_MESSAGE,
  CLEAR_CHAT,
} from './ActionType';

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const sendMessage = (message) => async (dispatch) => {
  dispatch({ type: SEND_MESSAGE_REQUEST });
  try {
    // Add user message immediately
    dispatch({ type: ADD_MESSAGE, payload: { role: 'user', content: message } });

    const response = await axios.post(
      `${API_BASE_URL}/api/assistant/chat`,
      { message },
      getAuthHeaders()
    );

    // Add AI response
    const aiMessage = {
      role: 'assistant',
      content: response.data.reply || response.data,
    };
    dispatch({ type: ADD_MESSAGE, payload: aiMessage });
    dispatch({ type: SEND_MESSAGE_SUCCESS, payload: response.data });

    return response.data;
  } catch (error) {
    console.log('Send message error:', error.response?.data || error.message);
    // Add error message
    dispatch({
      type: ADD_MESSAGE,
      payload: {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        error: true,
      },
    });
    throw error;
  }
};

// `preview` is the base64 data URL built client-side (FileReader) for images —
// it's the only thing that can actually go in an <img src>. Voice notes have
// no visual preview, so they fall back to a text label instead.
export const sendMedia = (file, message = '', preview = null) => async (dispatch) => {
  dispatch({ type: SEND_MEDIA_REQUEST });
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (message) {
      formData.append('message', message);
    }

    const isImage = file.type?.startsWith('image/');
    const isAudio = file.type?.startsWith('audio/');

    // `content` holds the renderable preview: a base64 data URL for images,
    // an object URL for recorded audio (so the sender can play back what they
    // sent). `caption` holds whatever text they typed alongside it, kept
    // separate so it isn't lost when there's also a media preview to show.
    const userMessage = {
      role: 'user',
      content: (isImage || isAudio) ? preview : null,
      caption: message,
      hasMedia: true,
      mediaType: file.type,
    };
    dispatch({ type: ADD_MESSAGE, payload: userMessage });

    const response = await axios.post(
      `${API_BASE_URL}/api/assistant/chat/media`,
      formData,
      {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      }
    );

    const aiMessage = {
      role: 'assistant',
      content: response.data.reply || response.data,
    };
    dispatch({ type: ADD_MESSAGE, payload: aiMessage });
    dispatch({ type: SEND_MEDIA_SUCCESS, payload: response.data });

    return response.data;
  } catch (error) {
    console.log('Send media error:', error.response?.data || error.message);
    dispatch({
      type: ADD_MESSAGE,
      payload: {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your media. Please try again.',
        error: true,
      },
    });
    throw error;
  }
};

export const addMessage = (message) => (dispatch) => {
  dispatch({ type: ADD_MESSAGE, payload: message });
};

export const clearChat = () => (dispatch) => {
  dispatch({ type: CLEAR_CHAT });
};
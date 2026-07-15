import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';  // ← Named import, not default
import authReducer from './auth/Reducer';
import medicineReducer from './medicine/Reducer';
import reminderReducer from './reminder/Reducer';
import doseLogReducer from './doseLog/Reducer';
import dashboardReducer from './dashboard/Reducer';
import chatReducer from './chat/Reducer';
import notificationReducer from './notification/Reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  medicine: medicineReducer,
  reminder: reminderReducer,
  doseLog: doseLogReducer,
  dashboard: dashboardReducer,
  chat: chatReducer,
  notification: notificationReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
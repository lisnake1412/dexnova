import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

const PERSISTED_KEYS = ['user', 'application', 'transactions', 'lists', 'farm'];

// Custom save middleware function
const saveToLocalStorage = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('states', serializedState);
  } catch (err) {
    // Handle save error
    console.error('Failed to save state to local storage:', err);
  }
};

// Custom load middleware function
const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('states');
    if (serializedState === null) {
      return undefined;
    }
    const parsedState = JSON.parse(serializedState);

    // Only return the slices specified in PERSISTED_KEYS
    return Object.keys(parsedState).reduce((acc: any, key) => {
      if (PERSISTED_KEYS.includes(key)) {
        acc[key] = parsedState[key];
      }
      return acc;
    }, {});
  } catch (err) {
    // Handle load error
    console.error('Failed to load state from local storage:', err);
    return undefined;
  }
};

// Your reducers
import swap from './swap/reducer';
import lists from './lists/reducer';
import application from './application/reducer';
import multicall from './multicall/reducer';
import transactions from './transactions/reducer';
import mint from './mint/reducer';
import user from './user/reducer';
import connection from './user/reducer';
import farm from './farm/reducer';

const rootReducer = {
  swap,
  lists,
  application,
  multicall,
  transactions,
  mint,
  user,
  connection,
  farm
};

// Create the Redux store with custom middleware
const store = configureStore({
  reducer: rootReducer,
  middleware: [
    ...getDefaultMiddleware(),
    (store) => (next) => (action) => {
      const result = next(action);
      saveToLocalStorage(store.getState()); // Save state to local storage after every action
      return result;
    },
  ] as const, // Specify the type of middleware as `const` to resolve the type error
  preloadedState: loadFromLocalStorage(), // Load state from local storage on store initialization
});

export default store;
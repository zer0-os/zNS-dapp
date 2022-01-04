import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';

import createRootReducer from './reducers';
import { rootSaga } from './sagas';

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// History to be used in router
export const history = createBrowserHistory();

// Root Reducer
const rootReducer = createRootReducer(history);

// Middleweares
const middlewares = [routerMiddleware(history), sagaMiddleware];
// if (process.env.NODE_ENV === 'development') {
// 	middlewares.push(logger);
// }

// Mount it on the Store
const store = createStore(
	rootReducer,
	{},
	composeWithDevTools(applyMiddleware(...middlewares)),
);

// Run the saga
sagaMiddleware.run(rootSaga);

// Export App State
export type AppState = ReturnType<typeof rootReducer>;

export default store;

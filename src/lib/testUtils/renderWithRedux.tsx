import * as React from 'react';
import * as redux from 'react-redux';
import { Router, Switch } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import store from 'store/index';
import { render } from '@testing-library/react';
import { notificationsReady } from 'store/notifications/notifications.mockData';
import { currencyReady } from 'store/currency/currency.mockData';
import { mintReady } from 'store/mint/mint.mockData';

export const renderWithRedux = (
	component: React.ReactNode,
	state = {},
	reduxState = {},
	initialHistoryEntries = ['/'],
) => {
	const history = createMemoryHistory({
		initialEntries: initialHistoryEntries,
	});

	// TODO Add more state mocks
	const initialReduxState = {
		notifications: notificationsReady,
		currency: currencyReady,
		mint: mintReady,
		...reduxState,
	};

	const useSelectorSpy = jest.spyOn(redux, 'useSelector');
	useSelectorSpy.mockImplementation((callback) => {
		return callback(initialReduxState);
	});

	return {
		...render(
			<redux.Provider store={store}>
				<Router history={history}>
					<Switch>{component}</Switch>
				</Router>
			</redux.Provider>,
		),
		store,
		history,
	};
};

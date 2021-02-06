import React, { createContext, FC, useReducer } from 'react';

import { reduceNotification } from './reduceNotification';

type InitailState = {
  count0: number;
};

type PendingState = {
  count1: number;
};

type RejectedState = {
  count2: number;
};

const initalState = {
  count0: 0 as number,
};

const NotificationContext = createContext<{
  state: InitailState;
  dispatch: React.Dispatch<any>;
}>({ state: initalState, dispatch: () => null });

const mainReducer = (count0: any, action: any) => ({
  count0: reduceNotification(count0, action),
});

const AppProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(mainReducer, initalState);

  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
};

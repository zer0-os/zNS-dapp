import React, { createContext, useReducer } from 'react';

import { reduceNotification } from './reduceNotification';

type InitailState = {
  count0: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type PendingState = {
  count1: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RejectedState = {
  count2: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type SentState = {
  count3: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type DeclineState = {
  count4: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type AcceptState = {
  count5: number;
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AppProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(mainReducer, initalState);

  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
};

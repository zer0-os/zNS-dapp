import { useReducer } from 'react';

export const reduceNotification = (state: any, action: any) => {
  switch (action.type) {
    case 'TX APPROVED':
      return [
        state + 1,
        {
          count0: action.count0,
        },
      ];
    case 'PENDING TX':
      return [
        ...state,
        {
          count1: action.count1,
        },
      ];
    case 'TX REJECTED':
      return [
        state + 0,
        {
          count2: action.count2,
        },
      ];
    default: {
      return state;
    }
  }
};

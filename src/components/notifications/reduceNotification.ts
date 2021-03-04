import { useReducer } from 'react';

export const reduceNotification = (state: any, action: any) => {
  switch (action.type) {
    case 'ZeroState':
      return [
        state,
        {
          count0: action.count0,
        },
      ];
    case 'APPROVED':
      return [
        state + 1,
        {
          count1: action.count1,
        },
      ];
    case 'PENDING':
      return [
        ...state,
        {
          count1: action.count1,
        },
      ];
    case 'TX REJECTED':
      return [
        state + 1,
        {
          count2: action.count2,
        },
      ];
    case 'SENT':
      return [
        state + 1,
        {
          count3: action.count3,
        },
      ];
    case 'DECLINED':
      return [
        state + 1,
        {
          count4: action.count4,
        },
      ];
    case 'ACCEPT':
      return [
        state + 1,
        {
          count5: action.count5,
        },
      ];

    default: {
      return state;
    }
  }
};

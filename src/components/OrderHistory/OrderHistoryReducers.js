import {
  GET_ORDER_HISTORY,
} from '../../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_ORDER_HISTORY:
      return { ...state, orderHistory: action.payload };
    default:
      return state;
  }
};

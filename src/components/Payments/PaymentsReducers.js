import {
  GET_PENDING_PAYMENT, GET_REDEEM_HISTORY, GET_BANK_DETAILS, 
} from '../../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_PENDING_PAYMENT:
      return { ...state, pendingPayment: action.payload.amount };
    case GET_REDEEM_HISTORY:
      return { ...state, paymentRedeemHistory: action.payload.history };
    case GET_BANK_DETAILS:
        return {...state, bankDetails: action.payload.seller };
    
    default:
      return state;
  }
};

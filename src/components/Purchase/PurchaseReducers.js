import {
  CHOOSE_PURCHASE,
  GET_PLANS,
} from '../../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case CHOOSE_PURCHASE:
      return { ...state, choosenPlan: action.payload };

    case GET_PLANS:
      return { ...state, plans: action.payload.packs };
    default:
      return state;
  }
};

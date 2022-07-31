import {
  ASYNC_START,
  ASYNC_END,
  GET_COLLEGES,
  SET_USER,
  GET_USER_DETAILS
} from '../../constants/actionTypes';
  
export default (state = {}, action) => {
  switch (action.type) {
    case ASYNC_START:
  
      return { ...state };
  
  
    case ASYNC_END:
  
      return { ...state };
    case SET_USER:
      return {...state,user:action.payload}
    case GET_COLLEGES:
      return {...state,colleges:action.payload}
    case GET_USER_DETAILS:
      return { ...state, user: action.payload}
    default:
      return state;
  }
  
  return state;
};
  
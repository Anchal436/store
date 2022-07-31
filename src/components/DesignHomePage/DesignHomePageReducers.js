import {

  GET_HOME_PAGE_INFO,
  GET_FEATURED_PRODUCTS,
} from '../../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_HOME_PAGE_INFO:
      return { ...state, homePageInfo: action.payload };
    case GET_FEATURED_PRODUCTS:
        return { ...state, featuredProducts: action.payload };
    default:
      return state;
  }
};

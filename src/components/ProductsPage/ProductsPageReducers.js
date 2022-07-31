import {
  GET_PRODUCTS,
  SET_PRODUCTS,
  GET_SHOP_DETAILS,
  SET_CATEGORY,
  GET_RESELLING_PRODUCTS,
  GET_NOTIFICATION,
  SET_RESELLING_PRODUCTS,
  SET_NOTIFICATION,
} from '../../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_PRODUCTS:
      if (state.products) {
        return { ...state, productsPageNum: action.payload.num_pages, products: action.pageNumber === 1 ? action.payload.products : [...state.products, ...action.payload.products] };
      }
      return { ...state, productsPageNum: action.payload.num_pages, products: action.payload.products };
    case SET_PRODUCTS:
      return { ...state, products: action.payload.products };
    case GET_RESELLING_PRODUCTS:
      if (state.resellingProducts) {
        return {
          ...state,
          resellingProductsPageNum: action.payload.num_pages,
          resellingProducts: action.pageNumber === 1
            ? action.payload.products : [...state.resellingProducts, ...action.payload.products],
        };
      }
      return { ...state, resellingProductsPageNum: action.payload.num_pages, resellingProducts: action.payload.products };
    case SET_RESELLING_PRODUCTS:
      return { ...state, resellingProducts: action.payload.products };
    case GET_SHOP_DETAILS:
      return { ...state, shopDetails: action.payload };
    case SET_CATEGORY:
      return { ...state, chosenCategory: action.payload };
    case GET_NOTIFICATION:
      if (state.notifications) {
        return { ...state, notificationPageNum: action.payload.num_pages, notifications: action.pageNumber === 1 ? action.payload.notifications : [...state.notifications, ...action.payload.notifications] };
      }
      return { ...state, notificationPageNum: action.payload.num_pages, notifications: action.payload.notifications };
    case SET_NOTIFICATION:
      return { ...state, notifications: action.payload.notifications };
    default:
      return state;
  }
};

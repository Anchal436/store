import {
  GET_NOT_DELIVERED_SOLD_PRODUCTS,
  GET_DELIVERED_SOLD_PRODUCTS,
} from '../../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_NOT_DELIVERED_SOLD_PRODUCTS:
      return { ...state, notDeliveredSoldProducts: action.payload.orders, notDeliveredProductsPageCount: action.payload.num_pages };
    case GET_DELIVERED_SOLD_PRODUCTS:
      return { ...state, deliveredSoldProducts: action.payload.orders, deliveredProductsPageCount: action.payload.num_pages };

    default:
      return state;
  }
};

import {
  ADD_TO_CART,
  GET_LINKS,
  REMOVE_FROM_CART,
  GET_PUBLIC_PAGE_HEADER_INFO,
  CLEAR_CART,
  GET_PUBLIC_PAGE_USER,
  GET_PUBLIC_PAGE_PRODUCTS,
  GET_PUBLIC_PAGE_SHOP_DETAILS,
  SELECT_PRODUCT,
  GET_PUBLIC_PAGE_BG_STYLE,
  SET_PUBLIC_PAGE_PRODUCTS,
} from '../../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      if (state.cartItems && state.cartItems.length > 0) {
        let found = false;
        let temp = [];
        if (action.payload.selectedSize) {

          temp = state.cartItems.map((c) => {
            if (c.item.id === action.payload.item.id && c.selectedSize && c.selectedSize.id === action.payload.selectedSize.id) {
              found = true;
              const quantity = Math.min(action.payload.quantity + c.quantity, action.payload.selectedSize.stock )
              return { ...action.payload, quantity };
            }
            return c;
          });
        } else {
          temp = state.cartItems.map((c) => {
            if (c.item.id === action.payload.item.id) {
              found = true;
              const quantity = Math.min(action.payload.quantity + c.quantity, action.payload.item.stock )
              return { ...action.payload, quantity };
            }
            return c;
          });
        }
        if (!found) {
          temp = [action.payload, ...temp];
        }
        return { ...state, cartItems: temp };
      }
      return { ...state, cartItems: [action.payload] };
    case REMOVE_FROM_CART: {
      let temp = [];
      if (action.payload.selectedSize) {
        temp = state.cartItems.filter((c) => !((c.item.id === action.payload.item.id) && c.selectedSize &&  (c.selectedSize.id === action.payload.selectedSize.id)));
      } else {
        temp = state.cartItems.filter((c) => !(c.item.id === action.payload.item.id));
      }
      return { ...state, cartItems: temp };
    }
    case CLEAR_CART:
      return { ...state, cartItems: [] };
    case GET_PUBLIC_PAGE_HEADER_INFO:
      return { ...state, publicHeaderInfo: action.payload.feature };
    case GET_PUBLIC_PAGE_USER:
      return { ...state, publicPageUser: action.payload.user };
    case GET_PUBLIC_PAGE_PRODUCTS:
      if (state.publicPageProducts) {
        return {
          ...state,
          publicPageProductsPageNum: action.payload.num_pages,
          publicPageProducts: action.pageNumber === 1
            ? action.payload.products : [...state.publicPageProducts, ...action.payload.products],
        };
      }
      return { ...state, publicPageProducts: action.payload.products, publicPageProductsPageNum: action.payload.num_pages };

    case SET_PUBLIC_PAGE_PRODUCTS:
      return { ...state, publicPageProducts: action.payload.products };

    case GET_PUBLIC_PAGE_SHOP_DETAILS:
      return { ...state, publicPageShopDetails: action.payload };
    case GET_PUBLIC_PAGE_BG_STYLE:
      return { ...state, publicPageBgStyle: action.payload };
    case SELECT_PRODUCT:
      return { ...state, selectedProduct: action.payload };
    case GET_LINKS:
      return { ...state, publicPageUser: { ...state.publicPageUser, links: action.payload.links }};
    default:
      return state;
  }
};

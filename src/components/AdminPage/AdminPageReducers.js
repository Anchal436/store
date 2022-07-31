import {
  ASYNC_START,
  ASYNC_END,
  GET_LINKS,
  SET_LINK_INFO,
  DELETE_LINK_INFO,
  GET_BG_STYLE,
  GET_HEADER_INFO,
  GET_LINK_CLICKS,
  GET_PROFILE_VIEWS,
} from '../../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case ASYNC_START:
      return { ...state };
    case ASYNC_END:
      return { ...state };
    case GET_LINKS:
      return { ...state, links: action.payload };
    case SET_LINK_INFO: {
      if (state.linkInfo && state.linkInfo.length > 0) {
        const temp = state.linkInfo.filter((l) => l.id !== action.payload.id);
        return { ...state, linkInfo: [...temp, action.payload] };
      }
      return { ...state, linkInfo: [action.payload] };
    }
    case DELETE_LINK_INFO: {
      if (state.linkInfo) {
        return { ...state, linkInfo: state.linkInfo.filter((l) => l.id !== action.payload.id) };
      }
      return { ...state, linkInfo: [] };
    }
    case GET_BG_STYLE: 
      return { ...state, homeBgStyle: action.payload }
    case GET_HEADER_INFO:
      return { ...state, headerInfo: action.payload.feature };
    case GET_LINK_CLICKS:
      return { ...state, linkClicks: action.payload };
    case GET_PROFILE_VIEWS:
      return { ...state, profileViews: action.payload };
    default:
      return state;
  }
};

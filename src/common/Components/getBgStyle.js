import { DEFAULT_BG_STYLE, DEFAULT_TEXT_COLOR } from '../../constants/otherConstants';
import lightOrDark from './checkBgColor';

const getBgStyle = (bgStyle) => {
  let data = JSON.parse(DEFAULT_BG_STYLE);
  let textColor = DEFAULT_TEXT_COLOR;
  if (bgStyle) {
    if (bgStyle.background_color) {
      try {
        data = JSON.parse(bgStyle.background_color);
      } catch {
        data = JSON.parse(DEFAULT_BG_STYLE);
      }
    }
    if (bgStyle.link_style) {
      textColor = bgStyle.link_style;
    }
    if (bgStyle.background_image) {
      data = { ...data, backgroundImage: `url(${bgStyle.background_image})` };
    }
  }
  return { bgStyle: data, secondaryColor: textColor, fontColor: lightOrDark(textColor) };
};


export default getBgStyle;

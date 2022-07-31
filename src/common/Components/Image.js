import React, { Component } from 'react';

const omit = (obj, omitKey) => Object.keys(obj).reduce((result, key) => {
  if (key !== omitKey) {
    result[key] = obj[key];
  }
  return result;
}, {});

const overlayStyles = {
  position: 'absolute',
  width:'100%',
  height:'100%',
  top:0,
  left:0,
  height:'100%',
  filter: 'blur(5px)',
  transition: 'all   1000ms  ',
  transform: 'scale(1)',
  clipPath: 'inset(0)',
};

export default class ProgressiveImage extends Component {
  constructor(props) {
    super(props);
    this.state = { highResImageLoaded: false };
  }

  render() {
    const { overlaySrc, src, style } = this.props;
    const { highResImageLoaded } = this.state;
    const filteredProps = omit(this.props, 'overlaySrc');
    // console.log(overlaySrc)
    return (
      <span >
        <img
          {...filteredProps}
          onLoad={() => {
					  this.setState({ highResImageLoaded: true });
          }}
          ref={(img) => {
					  this.highResImage = img;
          }}
          alt=""
          src={src}
          
        />
        <img
          {...filteredProps}
          alt=""
          // className={`${this.props.className} `}
          style={highResImageLoaded?{...overlayStyles,opacity:'0'}:overlayStyles}
          
          src={`data:image/png;base64, ${overlaySrc}`}
          
        />
      </span>
    );
  }
}

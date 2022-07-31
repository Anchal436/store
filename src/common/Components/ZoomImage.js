import React, { Component } from 'react';

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import './styles.css'

class Example extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doubleClickMode: '',
      className: '',
      style: {},
    };
    this.doubleClick = 'zoomIn';
    this.onZoomChange = this.onZoomChange.bind(this);
  }

  componentWillMount() {
    const { src, className, style } = this.props;
    this.setState({ src, className, style });
  }

  

  onZoomChange(e) {
    
    if (e.scale >= 6) {
      this.reset();
    }
  }
  reset() {}

  render() {
    const { className, style } = this.state;
    const { children } = this.props;
    return (
      <TransformWrapper className={className} enablePadding style={style} doubleClick={{ mode: this.doubleClick }} onZoomChange={this.onZoomChange}>
        {({
          zoomIn, zoomOut, resetTransform, ...rest
        }) => {
          this.reset = resetTransform;

          return (

            <TransformComponent>
              { children }
            </TransformComponent>
          );
        }}


      </TransformWrapper>
    );
  }
}

export default Example;

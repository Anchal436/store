/* eslint-disable react/button-has-type */

import React, { Component } from 'react';
import './styles.css'
import 'tachyons';


class WaterMark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
    };
  }

  componentWillMount() {
    this.setState({ message: this.props.message, fontSize: this.props.fontSize });
  }

  render() {
    const { message, fontSize } = this.state;
    return (
      <div className='watermark' >
        {
            message ? <p className='bg-text' style={{ fontSize }}>{`${message}`}</p> : null
        }
        

      
      </div>
    );
  }
}



export default WaterMark;

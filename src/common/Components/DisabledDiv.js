/* eslint-disable react/button-has-type */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import LockIcon from '@material-ui/icons/Lock';

class Loader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
    };
  }

  componentWillMount() {
    this.setState({ message: this.props.message });
  }

  render() {
    const { message } = this.state;
    return (
      <div className='' >
      <div className="disabled flex justify-center items-center white flex-column tc">
        <LockIcon style={{color:'white'}} />
        {
            message ? <p>{`${message}`}</p> : null
        }
        {
          message ? <button className='color-btn' style={{height:'52px'}}  type='button' onClick={() => window.location.href = '/#pricing'} >Join Pro</button> : null
        }

      </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Loader);

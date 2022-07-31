/* eslint-disable react/button-has-type */

import React, { Component } from 'react';
import { connect } from 'react-redux';
// import CircularProgress from '@material-ui/core/CircularProgress';
import loader from '../../assets/Images/loader.gif';

import 'tachyons';


class Loader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
    };
    this.startLoader = this.startLoader.bind(this);
  }

  componentWillMount() {
    this.startLoader();
  }

  startLoader() {
    let current_progress = 0;
    let step = 0.1; // the smaller this is the slower the progress bar
    const interval = setInterval(() => {
      current_progress += step;
      const progress = Math.round(Math.atan(current_progress) / (Math.PI / 2) * 100 * 1000) / 1000;
      const progressText = document.getElementById('progress-loading');
      if (progressText) {
        progressText.innerText = Math.floor(progress);
        if (progress >= 100) {
          clearInterval(interval);
        } else if (progress >= 70) {
          step = 0.1;
        }
      } else {
        clearInterval(interval);
      }
    }, 100);
  }


  render() {
    const { progress } = this.state.progress;
    return (
      <div className="loading">
        {' '}
        <h1 id="progress-loading" aria-valuenow={0}> 85</h1>
        <img
                src={loader}
                style={{
                  width: '50px', height: '50px', color: 'white',
                }}
                alt="Loading..."
              />
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

/* eslint-disable react/button-has-type */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import { push } from 'react-router-redux';
import CollapseTransition from '../../../common/Components/CollapseTransition'
import AddIcon from '@material-ui/icons/Add';
class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: false,
    };
  }

  componentWillMount() {

  }


  componentWillReceiveProps(np) {

  }

  render() {
      const { question,answer} = this.props.data
    return (
      <div className='question-div'>
          <button type='button'className='question-div-question' onClick={() => this.setState({expand:!this.state.expand})} >
            <p>
          {question}
          </p>
          <AddIcon/>
          </button>
        <CollapseTransition visible={this.state.expand} >
          <p className='question-div-answer'>
            {answer}
          </p>
        </CollapseTransition>
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
)(LandingPage);

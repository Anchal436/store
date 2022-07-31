
import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import './styles.css';

class TextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: '',
      value: '',
      autoComplete:false,
      disabled: false,
    };
  }

  componentWillMount() {
    const {
      label, value, disabled, pattern, type, required, className, style, onKeyDown, autoComplete, step,
    } = this.props;
    this.setState({
      label, value, disabled, pattern, type, required, className, style, autoComplete, step,
    });
    this.onKeyDown = onKeyDown;
  }

  componentWillReceiveProps(np) {
    this.setState({ label: np.label, value: np.value, disabled: np.disabled });
  }

  onKeyDown() {

  }

  render() {
    const {
      label, value, disabled, pattern, type, required, className, style, autoComplete, step,
    } = this.state;
    return (
      <div className={`input-label-div ${className}`} style={style}>
        <input
          type={type || 'text'}
          name={label}
          className="inp "
          disabled={disabled}
          value={value}
          onChange={(e) => this.props.onTextChange(e.target.value)}
          required={required}
          pattern={pattern || null}
          placeholder=" "
          onKeyDown={this.onKeyDown}
          autoComplete={autoComplete? "on" :"off"}
          step={step||null }
        />
        <label className="inp-label" name={label}>
          {label}
        </label>
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
)(TextInput);

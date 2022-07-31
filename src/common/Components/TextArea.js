
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
      disabled: false,
      rows:3,
    };
  }

  componentWillMount() {
    this.setState({
      label: this.props.label, value: this.props.value, disabled: this.props.disabled, pattern: this.props.pattern, type: this.props.type, required: this.props.required, className: this.props.className, minLength: this.props.minLength, maxLength: this.props.maxLength, rows:this.props.rows
    });
  }

  componentWillReceiveProps(np) {
    this.setState({ label: np.label, value: np.value, disabled: np.disabled });
  }

  render() {
    const {
      label, value, disabled, pattern, type, required, className, rows, 
    } = this.state;
    return (
      <div className={`text-area-label-div ${className}`} style={this.props.style}>
          <label className="inp-label" name={label}>
            {label}
          </label>
        <textarea
          type={type || 'text'}
          name={label}
          className="inp "
          disabled={disabled}
          value={value}
          onChange={(e) => this.props.onTextChange(e.target.value)}
          required={required}
          pattern={pattern || null}
          placeholder=" "
          rows={`${rows}`}
        >
          
        </textarea>
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

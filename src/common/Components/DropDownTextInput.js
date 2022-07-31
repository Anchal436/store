
import React, { Component } from 'react';
import 'tachyons';
import _ from 'lodash';
import './styles.css';
import TextInput from './TextInput';

class DropDownTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cursor: 0,
      label: '',
      canRemoveData: false,
      data: [],
      value: '',
      required: false,
    };
    this.searchResult = [];
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.selectOption = this.selectOption.bind(this);
  }

  componentWillMount() {
    const {
      label, data, value, canRemoveData,required, ...misc
    } = this.props;
    this.setState({
      label, data, value, misc, canRemoveData,
    });
  }

  componentWillReceiveProps(np) {
    const {
      label, data, value, hideResult, required, ...misc
    } = np;

    if (data !== this.state.data) {
      this.searchResult = [];
    }
    if (hideResult) {
      this.searchResult = [];
    }

    this.setState({
      label, data, value, required, misc,
    });
  }

  handleKeyDown(e) {
    const { cursor } = this.state;
    if (e.keyCode === 38 && cursor > 0) {
      this.setState((prevState) => ({
        cursor: prevState.cursor - 1,
      }));
    } else if (e.keyCode === 40 && cursor < this.searchResult.length - 1) {
      this.setState((prevState) => ({
        cursor: prevState.cursor + 1,
      }));
    }
    if (e.keyCode === 13 && cursor >= 0) {
      // console.log(this.searchResult[cursor])
      e.preventDefault();
      this.selectOption(this.searchResult[cursor]);
    }
  }

  selectOption(value) {
    const { setOption } = this.props;
    if (value) {
      this.searchResult = [];
      this.setState({ value: value.name });
      setOption(value);
    }
  }


  filterData(text) {
    const { data } = this.state;
    this.searchResult = data.filter((c) => c.name.toLowerCase().includes(text.toLowerCase()));
    if (text !== '') {
      if (this.searchResult.length > 0 && this.searchResult[0].name !== text) this.searchResult = [{ name: text }, ...this.searchResult];
    }
    const { onChangeText } = this.props;
    this.setState({ value: text, cursor: 0 });
    onChangeText(text);
  }

  removeOption(value) {
    const { removeData } = this.props;
    if (!removeData) {
      console.log("You didn't provide the function to remove data, please provide one with key 'removeData'");
      return;
    }
    removeData(value);
  }

  renderSearchBox() {
    const { cursor, canRemoveData } = this.state;
    return (
      <div className="search-box">
        {this.searchResult.map((s, i) => (
          <div className={i === cursor ? 'search-entry selected-entry' : 'search-entry '}>
            <button onClick={() => this.selectOption(s)} type="button">
              <h3>{`${s.name}`}</h3>
            </button>
            {
                canRemoveData
                  ? <button className="remove-btn" onClick={() => this.removeOption(s)} type="button"> Remove</button>
                  : null
            }
          </div>

        ))}
      </div>
    );
  }

  render() {
    const {
      label, value, misc, required,
    } = this.state;
    const { className, disabled } = misc;
    return (
      <div className={className}>
        <div>
          <TextInput label={label} value={value} type="text" className="w-100" onTextChange={(text) => this.filterData(text)} required={required} onKeyDown={this.handleKeyDown} autoComplete={false} disabled={disabled} />

          <div style={{ position: 'relative' }}>
            {
              this.searchResult.length > 0 ? this.renderSearchBox() : null
            }
          </div>
        </div>

      </div>
    );
  }
}

export default DropDownTextInput;

/* eslint-disable react/button-has-type */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import './styles.css';

// import 'react-image-crop/lib/ReactCrop.scss';


class Drag extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
   dragOver(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = this.props.dropEffect;
  }
  
   dragEnter(ev) {
    ev.dataTransfer.dropEffect = this.props.dropEffect;
  }
  startDrag(ev) {
    ev.dataTransfer.setData("drag-item", this.props.dataItem);
    ev.dataTransfer.effectAllowed = this.props.dropEffect;
  }
  
  drop(ev) {
    const droppedItem = ev.dataTransfer.getData("drag-item");
    if (droppedItem) {
        console.log(droppedItem)
    //   this.props.onItemDropped(droppedItem);
    }
  }
  
  
  render() {
    return (
        <div draggable onDragStart={this.startDrag.bind(this)} onDragOver={this.dragOver.bind(this)} onDragEnter={this.dragEnter.bind(this)} onDrop={this.drop.bind(this)}>
          {this.props.children}
        </div>);
  }
}


const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Drag);

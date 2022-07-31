import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { push, goBack } from 'react-router-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

import TimelineIcon from '@material-ui/icons/Timeline';
import Slide from '@material-ui/core/Slide';
import { store } from '../../../store';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);


class LineGraph extends PureComponent {
  static jsfiddleUrl = 'https://jsfiddle.net/alidingling/xqjtetw0/';

  constructor(props) {
    super(props);
    this.state = {
      render: false,
      mobileView: false,
      lineGraphDialog: false,


    };
    this.data = [];
    this.togelLineGraphDialog = this.togelLineGraphDialog.bind(this);
  }

  componentWillMount() {
    // console.log(this.props.attributes, this.props.data);
    const { linkInfo, data, attributes } = this.props;

    this.data = data;
    this.attributes = attributes;
    this.setState({ render: !this.state.render, linkInfo });
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
  }

  componentWillReceiveProps(np) {
    const { linkInfo, render } = this.state;

    // console.log(np.attributes, np.data);
    if (np.data && np.data !== this.data) {
      this.data = np.data;
      this.attributes = np.attributes;
      this.setState({ render: !render });
    }
    if (np.routingLocation && linkInfo ) {
      if (np.routingLocation.query) {
        this.setState({ lineGraphDialog: np.routingLocation.query.lineGraph === `${linkInfo.id}` });
      }
    }
  }

  resize() {
    this.setState({ mobileView: window.innerWidth <= 600 });
  }

  togelLineGraphDialog() {
    const { lineGraphDialog, linkInfo } = this.state;
    if (lineGraphDialog) {
      store.dispatch(goBack());
    } else {
      const path = window.location.search ? `${window.location.pathname}${window.location.search}&lineGraph=${linkInfo.id}`
        : `${window.location.pathname}?lineGraph=${linkInfo.id}`;

      store.dispatch(push(path));
    }
  }

  render() {
    const {
      noOfLines, dataKeys, colors, heading,
    } = this.attributes;
    const { mobileView } = this.state;
    return (
      <div>
        <div className="pointer" onClick={() => this.togelLineGraphDialog()}>
          <TimelineIcon />
        </div>
        <Dialog
          open={this.state.lineGraphDialog}
          TransitionComponent={Transition}
          keepMounted
          maxWidth
          onClose={this.togelLineGraphDialog}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >

          <DialogTitle id="alert-dialog-slide-title">{heading}</DialogTitle>
          <DialogContent style={{ flexWrap: 'wrap', position: 'relative' }}>
            <LineChart
              width={mobileView ? window.innerWidth - 70 : 500}
              height={300}
              data={this.data}
              margin={{
                top: 20, right: 20, left: -10, bottom: 0,
              }}

            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {
                  [...Array(noOfLines)].map((l, i) => (
                    <Line type="monotone" dataKey={dataKeys[i]} stroke={colors[i]} key={i} activeDot={{ r: this.data.length }} strokeWidth={3} />
                  ))

              }
            </LineChart>
          </DialogContent>
          <DialogActions>
            <button type="button" className="color-btn w-100" onClick={() => this.togelLineGraphDialog()}> Close </button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  
  routingLocation: state.router.location,
});



export default connect(
  mapStateToProps,
)(LineGraph);
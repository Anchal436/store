import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
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


class BarGraph extends PureComponent {
  static jsfiddleUrl = 'https://jsfiddle.net/alidingling/xqjtetw0/';

  constructor(props) {
    super(props);
    this.state = {
      render: false,
      mobileView: false,
      barGraphDialog: false,
      linkInfo: { id: ""},
    };
    this.data = [];
    this.togelLineGraphDialog = this.togelLineGraphDialog.bind(this);
  }

  componentWillMount() {
    const { linkInfo, data, attributes } = this.props;
    this.data = data;
    this.attributes = attributes;
    this.setState({ render: !this.state.render, linkInfo });
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
  }

  componentWillReceiveProps(np) {
    const { linkInfo  } = this.state;
    if (np.data && np.data !== this.data) {
      this.data = np.data;
      this.attributes = np.attributes;
      this.setState({ render: !this.state.render });
    }
    if (np.routingLocation && linkInfo ) {
      if (np.routingLocation.query) {
        this.setState({ barGraphDialog : np.routingLocation.query.barGraph === `${linkInfo.id}` });
      }
    }
  }

  resize() {
    this.setState({ mobileView: window.innerWidth <= 600 });
  }
  

  
  togelLineGraphDialog() {
    const { barGraphDialog, linkInfo } = this.state;

    if (barGraphDialog) {
      store.dispatch(goBack());
    } else {
      const path = window.location.search ? `${window.location.pathname}${window.location.search}&barGraph=${linkInfo.id}`
        : `${window.location.pathname}?barGraph=${linkInfo.id}`;

      store.dispatch(push(path));
    }
    this.setState({ barGraphDialog: !this.state.barGraphDialog });
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
          open={this.state.barGraphDialog}
          TransitionComponent={Transition}
          keepMounted
          maxWidth
          onClose={this.togelLineGraphDialog}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{heading}</DialogTitle>
          <DialogContent style={{ flexWrap: 'wrap', position: 'relative' }}>
            <BarChart
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
                    <Bar dataKey={dataKeys[i]} fill={colors[i]} key={i} />
                  ))

              }


            </BarChart>

          </DialogContent>
          <DialogActions>
            <button type='button' className='color-btn w-100' onClick={() => this.togelLineGraphDialog()}> Close </button>
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
)(BarGraph);

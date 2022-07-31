import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { push, goBack } from 'react-router-redux';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { store } from '../../store';

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',

    backgroundColor: 'transparent',
    '& > div': {
      maxWidth: '100%',
      width: '100%',
      backgroundColor: '#0095f6',
    },
  },
  root: {
    background: 'white',
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: '#000',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),

    borderRight: '1px solid rgb(0,0,0,0.2)',
    borderLeft: '1px solid rgb(0,0,0,0.2)',
    flexGrow: 1,
    overflowWrap: 'break-word',
    // width:'auto',
    // marginRight: theme.spacing(1),
    '&:focus': {
      opacity: 1,
      outline: 'none',
      // fontWeight: 'bold',
    },

  },
}))((props) => <Tab disableRipple {...props} />);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,

  },
  padding: {
    // padding: theme.spacing(3),
  },

  demo2: {
    // backgroundColor: '#2e1534',
  },
}));

function TabPanel(props) {
  const {
    children, value, index, ...other
  } = props;
  if (value === index) {
    return (
      children
    );
  }
  return null;
}
function CustomizedTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [tabsData, setTabsData] = React.useState([]);
  useEffect(() => {
    setTabsData(props.tabsData);
    if (props.routingLocation && props.routingLocation.query) {
      if (props.routingLocation.query.tab) {
        const { tab } = props.routingLocation.query;
        tabsData.forEach((t, index) => {
          const heading = tab.replace('%20', ' ');
          if (t.tabHeading === heading && value !== index) {
            setValue(index);
          }
        });
      } else {
        setValue(0);
      }
    }
  }, [props.tabsData]);


  useEffect(() => {
    if (tabsData) {
      if (props.routingLocation.query && props.routingLocation.query.tab) {
        const { tab } = props.routingLocation.query;

        tabsData.forEach((t, index) => {
          const heading = tab.replace('%20', ' ');
          if (t.tabHeading === heading) {
            setValue(index);
          }
        });
      } else {
        setValue(0);
      }
    }
  }, [props.routingLocation]);
  const handleChange = (event, newValue) => {
    if (newValue !== value) {
      let path = `${window.location.pathname}?`;
      path += `tab=${tabsData[newValue].tabHeading}`;
      store.dispatch(push(path));
    }
  };
  return (
    <div className={classes.root}>
      <div className={classes.demo2}>
        <StyledTabs value={value} variant="fullWidth" onChange={handleChange} aria-label="styled tabs example">
          {
            tabsData.map((t, i) => (
              <StyledTab label={t.tabHeading} key={i} />
            ))
          }
        </StyledTabs>
        {
          tabsData.map((t, i) => (
            <TabPanel value={value} key={i} index={i}>
              {t.components()}
            </TabPanel>

          ))
        }
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  routingLocation: state.router.location,

});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomizedTabs);

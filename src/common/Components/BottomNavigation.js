import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import './styles.css';

import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { store } from '../../store';
import { THEME_COLOR } from '../../constants/otherConstants';

const useStyles = makeStyles({
  root: {
    // width: '%',
  },
  navigationButton: {
    maxWidth: '100%',
  },
  selected: {
    backgroundColor: THEME_COLOR,
    color: 'white',
  },
});

function SimpleBottomNavigation(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [tabsData, setTabsData] = React.useState([]);

  useEffect(() => {
    if (props.tabsData) {
      setTabsData(props.tabsData);
    }
  }, []);

  useEffect(() => {
    setTabsData(props.tabsData);
  }, [props.tabsData]);

  useEffect(() => {
    if (tabsData) {
      if (props.routingLocation.query && props.routingLocation.query.navigation) {
        const { navigation } = props.routingLocation.query;
        tabsData.forEach((t, index) => {
          const heading = navigation.replace('%20', ' ');
          if (t.label === heading) {
            setValue(index);
          }
        });
      } else {
        setValue(0);
      }
    }
  }, [props.routingLocation]);

  const handleChange = (newValue) => {
    if (newValue !== value) {
      const { routingLocation } = props;
      let path = `${window.location.pathname}?`;
      path += `navigation=${tabsData[newValue].label}`;
      store.dispatch(push(path));
    }
  };

  return (
    <div className="bottom-navigation">
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          handleChange(newValue);
        }}
        showLabels
        className={classes.root}
      >
        {
          tabsData.map((t, i) => (
            <BottomNavigationAction
              label={t.label}
              icon={t.icon}
              className={classes.navigationButton}
              classes={{
                selected: classes.selected, // class name, e.g. `classes-nesting-label-x`
              }}
            />
          ))
        }

      </BottomNavigation>
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
)(SimpleBottomNavigation);

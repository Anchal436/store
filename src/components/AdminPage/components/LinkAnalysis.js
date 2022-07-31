/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/button-has-type */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import ExpandMoreTwoToneIcon from '@material-ui/icons/ExpandMoreTwoTone';
import LineGraph from './LineGraph';
import BarGraph from './BarGraph';

import CollapseTransition from '../../../common/Components/CollapseTransition';

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      views: {
        weekly: 0,
        total: 0,
        monthly: 0,
      },
      clicks: {
        weekly: 0,
        total: 0,
        monthly: 0,
      },
      showProAnalytics: false,
      isNormalUser: true,
    };
    this.profileViews = [];
    this.monthlyData = [];
    this.weeklyData = [];
    this.togelShowProAnalytics = this.togelShowProAnalytics.bind(this);
  }

  componentWillMount() {
    // console.log(this.props);
    let temp = true;
    if (this.props.user && this.props.user.user) {
      temp = this.props.user.user.user_type === 'normal';
    }
    this.setState({ isNormalUser: temp });
    if (this.props.profileViews && this.props.profileViews !== this.profileViews && this.props.linkClicks && this.linkClicks !== this.props.linkClicks) {
      this.preProcessData(this.props.profileViews,this.props.linkClicks)
    }
  }

  componentWillReceiveProps(np) {
    if (np.profileViews && np.profileViews !== this.profileViews && np.linkClicks && this.linkClicks !== np.linkClicks) {
      this.preProcessData(np.profileViews,np.linkClicks)
    }
    if (np.user) {
      this.setState({ isNormalUser: np.user.user.user_type === 'normal' });
    }
  }

  preProcessData(profileViews, linkClicks) {
    this.weeklyData = [];
    this.monthlyData = [];
    const onWeekAgo = new Date();
    onWeekAgo.setDate(onWeekAgo.getDate() - 7);
    const onMonthAgo = new Date();
    onMonthAgo.setDate(onMonthAgo.getDate() - 28);
    let total = 0;
    let monthly = 0;
    let weekly = 0;
    this.profileViews = profileViews.analytics;

    if (this.profileViews) {
      this.profileViews.forEach((v) => {
        const dataWeek = {
          name: 'Page A', views: 0, clicks: 0, amt: 0,
        };
        const dataMonth = {
          name: 'Page A', views: 0, clicks: 0, amt: 0,
        };
        total += v.views;
        let name = v.day.split('-');
        name = `${name[2]}-${name[1]}`;
        dataWeek.name = name;
        dataMonth.name = name;
        const date = new Date(v.day);
        if (date.getTime() >= onWeekAgo.getTime()) {
          dataWeek.views = v.views;
          weekly += v.views;

          this.weeklyData = [...this.weeklyData, dataWeek];
        }
        if (date.getTime() >= onMonthAgo.getTime()) {
          dataMonth.views = v.views;
          monthly += v.views;
        }
        this.monthlyData = [...this.monthlyData, dataMonth];
      });
      this.setState({ views: { total, monthly, weekly } });
    }
    total = monthly = weekly = 0;
    this.linkClicks = linkClicks.analytics;
    this.linkClicks.forEach((v) => {
      total += v.total_clicks;
      v.clicks.forEach((c) => {
        const date = new Date(c.day);
        let name = c.day.split('-');
        name = `${name[2]}-${name[1]}`;
        if (date.getTime() >= onWeekAgo.getTime()) {
          this.weeklyData.forEach((l) => {
            if (l.name === name) {
              l.clicks += c.clicks;
              weekly += c.clicks;
            }
          });
        }
        if (date.getTime() >= onMonthAgo.getTime()) {
          this.monthlyData.forEach((l) => {
            if (l.name === name) {
              l.clicks += c.clicks;
              monthly += c.clicks;
            }
          });
        }
      });
    });
    this.setState({ clicks: { total, monthly, weekly } });
  }

  resize() {
    this.setState({ mobileView: window.innerWidth <= 600 });
  }

  togelShowProAnalytics() {
    this.setState({ showProAnalytics: !this.state.showProAnalytics });
  }

  render() {
    const {
      views, clicks, isNormalUser,
    } = this.state;
    return (
      <div className="bb ">
        <div className="  bg-white center flex tc items-center  justify-around  " onClick={() => this.togelShowProAnalytics()}>
          <b className="tl f6">
              Lifetime Analysis
          </b>

          <p>
Views
            <span className="b  blue">

              {views.total}

            </span>
          </p>
          <p>
            Clicks
            <span className="b  blue">

              {clicks.total}

            </span>
          </p>

          <ExpandMoreTwoToneIcon />
        </div>
        <CollapseTransition visible={this.state.showProAnalytics}>
          {
            isNormalUser
              ? (
                <div className=" flex flex-column items-center justify-center bg-white tc pb">

                  <b>
                      Join pro to get more analytics
                  </b>
                  <button type="button" className="color-btn w-50 center mt1 mb1" onClick={() => window.location.href = '/#pricing'}>
                      Join pro
                  </button>

                </div>
              )
              : (
                <div>
                  <div className="  profile-views  center flex tc justify-around ">
                    <b className="tl">
                Last 28 Days
                    </b>
                    <div className="flex justify-around  w-80 center tl items-center">
                      <p>
                        Views
                        <span>
                          {views.monthly}
                        </span>
                      </p>
                      <p>
                        Clicks
                        <span>

                          {clicks.monthly}

                        </span>
                      </p>
                      <LineGraph
                        data={this.monthlyData}
                        linkInfo = {{id:-1}}

                        attributes={{
                          heading: 'Monthly Analysis', noOfLines: 2, dataKeys: ['views', 'clicks'], colors: ['#05f244', '#ff05c9'],
                        }}
                      />
                    </div>
                  </div>
                  <div className="  profile-views  center flex tc justify-around ">
                    <b className="tl">
                Last 7 Days
                    </b>
                    <div className="flex justify-around  w-80 center tl items-center">
                      <p>
                    Views
                        <span>
                          {views.weekly}
                        </span>
                      </p>
                      <p>
                    Clicks
                        <span>

                          {clicks.weekly}

                        </span>
                      </p>
                      <BarGraph
                        data={this.weeklyData}
                        linkInfo = {{id:-1}}
                        attributes={{
                          heading: 'Weekly Analysis', noOfLines: 2, dataKeys: ['views', 'clicks'], colors: ['#05f244', '#ff05c9'],
                        }}
                      />


                    </div>
                  </div>

                </div>
              )
          }

        </CollapseTransition>

      </div>

    );
  }
}


const mapStateToProps = (state) => ({
  user: state.AuthReducer.user,
  profileViews: state.AdminPageReducers.profileViews,
  linkClicks: state.AdminPageReducers.linkClicks,
});

const mapDispatchToProps = (dispatch) => ({


});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminPage);

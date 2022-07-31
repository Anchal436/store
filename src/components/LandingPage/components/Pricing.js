/* eslint-disable no-nested-ternary */
/* eslint-disable react/button-has-type */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import { push } from 'react-router-redux';

import './styles.css';

import { store } from '../../../store';
import { CHOOSE_PURCHASE,GET_PLANS } from '../../../constants/actionTypes';
import Loader  from '../../../common/Components/Loader';
import agent from '../../../agent'
class Pricing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      render: false,
      mobileView: false,
      planType: 'month',
    };
    this.pricing = [
      {
        planName: 'Starter',
        price: null,
        disc_price: 0,
        features: [
          'Unlimited Links',
          'Integration with Facebook,Instagram,Google Sheets,YouTube,Patreon and many more',
        ],
      },
      {
        planName: 'Pro Pack',
        price: '449',
        disc_price: ' 49',
        type: '/month',
        features: [
          'Unlimited Links',
          'Link Priority',
          'Link icons',
          'NewsLetter',
          'Link Analytics',
          'Link Clicks',
          'Change App logo',
          'Assign your own header',
          'Customize Page styling',
          'Integration with Facebook,Instagram,Google Sheets,YouTube,Patreon and many more',
          'Support',
          'Priority Support',
          'Team Access',
        ],
      },
      {
        planName: 'Pro Pack',
        price: '4499',
        disc_price: ' 499',
        type: '/year',
        features: [
          'Unlimited Links',
          'Link Priority',
          'Link icons',
          'NewsLetter',
          'Link Analytics',
          'Link Clicks',
          'Change App logo',
          'Assign your own header',
          'Customize Page styling',
          'Integration with Facebook,Instagram,Google Sheets,YouTube,Patreon and many more',
          'Support',
          'Priority Support',
          'Team Access',
        ],
      },

    ];
  }

  componentWillMount() {
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
    this.setState({loading:true})
    this.props.getPlans()
    if(this.props.plans){
      this.plans = this.props.plans
    }
    if (this.props.plans) {
      this.plans = this.props.plans;
    }
  }

  componentWillReceiveProps(np) {
    if (np.plans ) {
      this.setState({loading:false})
      this.plans = np.plans;
      this.plans.forEach((p) => {
        if (p.period === 'monthly') {
          if (p.disc_price) {
            this.pricing[1].price = p.price;
            this.pricing[1].disc_price = p.disc_price;
          } else {
            this.pricing[1].disc_price = p.price;
          }
          this.pricing[1].plan_id = p.plan_id;
        }
        if (p.period === 'yearly') {
          if (p.disc_price) {
            this.pricing[2].price = p.price;
            this.pricing[2].disc_price = p.disc_price;
          } else {
            this.pricing[2].disc_price = p.price;
          }

          this.pricing[2].plan_id = p.plan_id;
        }
      });
      this.setState({ render: !this.state.render });
    }
  }

  resize() {
    this.setState({ mobileView: window.innerWidth <= 600 });
  }

  choosePlan(plan) {
    this.props.choosePlan(plan);
    store.dispatch(push('/purchase'));
  }


  renderPricing() {
    return (
      this.pricing.map((p, i) => (
        <div className={i !== 1 ? 'single-price' : '  single-price pro-pack-bg'} key={i}>
          <div className="deal-top div-2">
            <h3>
              {p.planName}

            </h3>
            {
              p.price
                ? (
                  <strike>
                Rs.
                    {p.price}
                  </strike>
                ) : null
            }

            {
              p.disc_price !== 0 ? (
                <h4>
              Rs.
                  {p.disc_price}
                  <span>

                    {p.type}
                  </span>
                </h4>
              ) : <h4>
              
               Free
                  
                </h4>
            }

          </div>
          <div className="deal-bottom">
            <ul className="deal-item">
              {
                p.features.map((f, i) => (
                  <li className="b" key={i + 1000}>{`${f}`}</li>
                ))
              }
            </ul>
            <div className="btn-area">
              {
                i === 0
                  ? <a className="div-2 purchase-btn" onClick={() => store.dispatch(push('/signup'))}>Sign up</a>
                  : <a className="div-2 purchase-btn" onClick={() => this.choosePlan(p)}>Get Pack</a>
              }

            </div>
          </div>
        </div>
      ))

    );
  }


  render() {
    const { loading } = this.state;
    return (


      <div className="main-div-width pb5 relative" id="pricing">

        <div className="tc center  home-page-header flex flex-column items-center">

          <h1 className="tc">
                 Pick you plan or start free
          </h1>

        </div>
        <div className="pricing-area">
          {this.renderPricing()}


        </div>
{/* {
  loading? <Loader/>:null
} */}
      </div>


    );
  }
}


const mapStateToProps = (state) => ({
  plans: state.PurchaseReducers.plans,

});

const mapDispatchToProps = (dispatch) => ({
  choosePlan: (plan) => dispatch({ type: CHOOSE_PURCHASE, payload: plan }),
  getPlans:()=> dispatch({ type: GET_PLANS, payload : agent.Purchase.getPlans()})

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Pricing);

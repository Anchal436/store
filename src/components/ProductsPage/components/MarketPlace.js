import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import { push, goBack } from 'react-router-redux';
import './MarketPlace.css';
import loader from '../../../assets/Images/loader.gif';
import { GET_RESELLING_PRODUCTS } from '../../../constants/actionTypes';
import agent from '../../../agent';
import ResellingProduct from './ResellingProduct';

class MarketPlace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resellingProducts: [],
      loadingMore: false,
      resellingProductsPageNum: 1,
      currentPage: 0,
      prevY: 0,
    };
    this.scrollingRef = createRef();
    this.renderProducts = this.renderProducts.bind(this);
  }

  componentDidMount() {
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 1.0,
    };

    this.observer = new IntersectionObserver(
      this.handleObserver.bind(this),
      options,
    );
    this.observer.observe(this.scrollingRef);
    const { resellingProducts } = this.props;
    const { currentPage } = this.state;
    if (resellingProducts) {
      this.setState({ resellingProducts });
    }
    this.loadMore();
    this.setState({ currentPage: currentPage + 1 });
  }

  componentWillReceiveProps(np) {
    const { resellingProducts, resellingProductsPageNum } = this.state;
    if (np.resellingProducts && np.resellingProducts !== resellingProducts) {
      this.setState({ resellingProducts: np.resellingProducts, loadingMore: false });
    }

    if (np.resellingProductsPageNum && np.resellingProductsPageNum !== resellingProductsPageNum) {
      this.setState({ resellingProductsPageNum: np.resellingProductsPageNum });
    }
  }

  handleObserver(entities, observer) {
    const { y } = entities[0].boundingClientRect;
    if (this.state.prevY > y) {
      this.loadMore();
    }
    this.setState({ prevY: y });
  }

  loadMore() {
    const { loadingMore, currentPage, resellingProductsPageNum } = this.state;
    const { getResellingProducts } = this.props;
    
    if (loadingMore) return;
    if (currentPage + 1 <= resellingProductsPageNum) {
      this.setState({ loadingMore: true });
      getResellingProducts(currentPage + 1);
      this.setState({ currentPage: currentPage + 1 });
    }
  }

  renderProducts() {
    const { resellingProducts } = this.state;
    return resellingProducts.map((product) => <ResellingProduct product={product} key={product.id} />);
    
  }

  render() {
    const { loadingMore } = this.state;
    return (
      <div className="market-place-div">
        <h2 className="tc" >Market Place</h2>
        <div className="market-place-content-div" ref={(scrollingRef) => (this.scrollingRef = scrollingRef)}>
          {
            this.renderProducts()
          }
        </div>
        <div
          ref={(scrollingRef) => (this.scrollingRef = scrollingRef)}
        >
          {
            loadingMore
              ? (
                <img
                  src={loader}
                  style={{
                    width: '50px', height: '50px', color: 'white', display: 'block', margin: 'auto',
                  }}
                  alt="Loading..."
                />
              )
              : null
        }
        </div>

      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  resellingProducts: state.ProductsPageReducers.resellingProducts,
  resellingProductsPageNum: state.ProductsPageReducers.resellingProductsPageNum,
});

const mapDispatchToProps = (dispatch) => ({
  getResellingProducts: (pageNumber) => dispatch({ type: GET_RESELLING_PRODUCTS, pageNumber, payload: agent.ProductsPage.getResellingProducts(pageNumber) }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MarketPlace);

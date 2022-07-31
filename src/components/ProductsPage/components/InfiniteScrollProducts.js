import React, {
  useEffect, useState, useRef, useCallback,
} from 'react';
import { connect } from 'react-redux';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
// import CircularProgress from '@material-ui/core/CircularProgress';
import Product from './Product';
import Category from './Category';
// import Image from '../../../common/Components/Image';
import loader from '../../../assets/Images/loader.gif';
import CollapseTransition from '../../../common/Components/CollapseTransition';
import agent from '../../../agent';
import './styles.css';
import { GET_PRODUCTS, SET_CATEGORY } from '../../../constants/actionTypes';

const RenderInfiniteScrollProduct = (props) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const [pageNumber, setPageNumber] = useState(1);
  const [categories, setCategories] = useState([]);
  const [chosenCategory, setChosenCategory] = useState(null);
  const [showCategoriesView, setShowCategoriesView] = useState(false);
  const [user, setUser] = useState('');
  const [maxPage, setMaxPage] = useState(0);
  const [isCategoryFilterVisible, setisCategoryFilterVisible] = useState(false);

  const observer = useRef();

  useEffect(() => {
    if (props.user && props.user.username) {
      setUser(props.user.username);
    }
    if (props.user && props.user.username) {
      // setProducts([]);
      getMoreProducts(props.user.username, 1);
      setChosenCategory(null);
      props.setCategory(null);
    }
  }, []);

  useEffect(() => {

    if (props.user && props.user.username) {
      setUser(props.user.username);
    }
    if (props.user && props.user.username) {
      // setProducts([]);
      getMoreProducts(props.user.username, 1);
      setChosenCategory(null);
      props.setCategory(null);
    }
  }, [props.user]);

  useEffect(() => {
    if (props.products && props.products !== products) {
      setProducts(props.products);
      setLoading(false);
    }
  }, [props.products]);

  useEffect(() => {
    if (props.shopDetails && props.shopDetails.categories !== categories) {
      setCategories(props.shopDetails.categories);
    }
    if (props.productsPageNum && props.productsPageNum !== maxPage) {
      setMaxPage(props.productsPageNum);
    }
  }, [props.shopDetails, props.productsPageNum]);

  const getMoreProducts = (username, page, category) => {
    if (!username) {
      return;
    }
    const data = { username };
    setLoading(true);
    if (category) {
      props.getFilteredProducts(data, page, category);
      return;
    }
    props.getProducts(data, page);
  };

  const lastProductElementRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) {
      observer.current.disconnect();
    }
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && (pageNumber + 1) <= props.productsPageNum) {
        if (chosenCategory) {
          getMoreProducts(props.user.username, (pageNumber + 1), chosenCategory);
        } else {
          getMoreProducts(props.user.username, (pageNumber + 1));
        }
        setPageNumber((prevPageNumber) => prevPageNumber + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading]);
  const chooseCategory = (category) => {
    const page = 1;
    if (user) {
      setShowCategoriesView(false);
      setProducts([]);
      getMoreProducts(user, page, category);
      setChosenCategory(category);
      setPageNumber(page);
      setisCategoryFilterVisible((prev) => !prev);
      props.setCategory(category);
    }
  };
  const showAllProducts = () => {
    const page = 1;
    if (user) {
      setShowCategoriesView(false);
      setProducts([]);
      getMoreProducts(user, page);
      setPageNumber(page);
      setChosenCategory(null);
      props.setCategory(null);
    }
  };
    // return null;
  return (
    <div className="flex flex-column">
      {
          showCategoriesView
            ? (
              <>
                {
                categories.length !== 0
                  ? (
                    <div>
                      <div className="admin-page-categories-div">
                        <h3 className="center">Your Categories</h3>
                        <button className="category-fixed" type="button" onClick={() => showAllProducts()}>
                        See All Products
                        </button>
                      </div>
                      <div className="flex flex-wrap " style={{ justifyContent: 'space-evenly' }}>
                        {
                          categories.map((c) => (
                            <Category key={c.id} category={c} chooseCategory={chooseCategory} />
                          ))
                        }
                      </div>
                    </div>
                  ) : null
              }
              </>
            )
            : (
              <div>
                <div className="admin-page-categories-div">
                  <button type="button" onClick={() => setisCategoryFilterVisible((prev) => !prev)} className="togel-btn">
                    {chosenCategory || 'All Products'}
                    <KeyboardArrowDownIcon />
                  </button>
                  <button className="category-fixed" type="button" onClick={() => setShowCategoriesView(!showCategoriesView)}>
                        See All categories
                  </button>
                </div>
                <CollapseTransition visible={isCategoryFilterVisible}>
                  <div className="admin-page-categories items-center">
                    <button className="h-100 color-btn " type="button" onClick={() => chooseCategory('Reselling Products')}>
                      Reselling Products
                    </button>
                    {
                      categories.length !== 0
                        ? categories.map((c) => (
                          <button className="category" type="button" key={c.id} onClick={() => chooseCategory(c.name)}>
                            {c.name}
                          </button>
                        ))
                        : null
                    }
                  </div>
                </CollapseTransition>
                <div className="flex justify-center mt0 mb0">
                  {
                    chosenCategory
                      ? <h3 className="center">{chosenCategory}</h3> : <h3 className="center">All Products</h3>
                  }
                </div>
                {
                 products.length > 0
                   ? (
                     <div className="flex flex-wrap justify-center">
                       {
                          products.map((p, i) => {
                            if (i + 1 === products.length) {
                              return (
                                <div className="admin-product relative" ref={lastProductElementRef}>
                                  <Product data={p} key={p.id} style={{ width: '100%', margin: 0 }} />
                                </div>
                              );
                            }
                            return <Product data={p} key={p.id} />;
                          })
                      }
                     </div>

                   )
                   : null
                }
              </div>
            )
        }
      {
          loading
            ? (
              <div style={{
                width: '100%', background: 'tranparent', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', margin: '8px 0px', color: 'white',
              }}
              >
                <img
                  src={loader}
                  style={{
                    width: '50px', height: '50px', color: 'white',
                  }}
                  alt="Loading..."
                />
              </div>
            )
            : null
        }
    </div>
  );
};


const mapStateToProps = (state) => ({
  user: state.AuthReducer.user.user,
  products: state.ProductsPageReducers.products,
  productsPageNum: state.ProductsPageReducers.productsPageNum,
  shopDetails: state.ProductsPageReducers.shopDetails,
});

const mapDispatchToProps = (dispatch) => ({
  getProducts: (user, pageNumber) => dispatch({ type: GET_PRODUCTS, pageNumber, payload: agent.ProductsPage.getProducts(user, pageNumber) }),
  getFilteredProducts: (user, pageNumber, category) => dispatch({ type: GET_PRODUCTS, pageNumber, payload: agent.ProductsPage.getFilteredProducts(user, pageNumber, category) }),
  setCategory: (category) => dispatch({ type: SET_CATEGORY, payload: category }),
});


export default connect(mapStateToProps, mapDispatchToProps)(RenderInfiniteScrollProduct);

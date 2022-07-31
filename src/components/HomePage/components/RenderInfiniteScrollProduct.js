/* eslint-disable max-len */
import React, {
  useEffect, useState, useRef, useCallback,
} from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
// import CircularProgress from '@material-ui/core/CircularProgress';
import Product from './Product';
// import Image from '../../../common/Components/Image';
// import CollapseTransition from '../../../common/Components/CollapseTransition';
import { store } from '../../../store';
import loader from '../../../assets/Images/loader.gif';
import agent from '../../../agent';
import './styles.css';
import { GET_PUBLIC_PAGE_PRODUCTS, SET_PUBLIC_PAGE_CATEGORY } from '../../../constants/actionTypes';

const RenderInfiniteScrollProduct = (props) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [mobileView, setMobileView] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [categories, setCategories] = useState([]);
  const [chosenCategory, setChosenCategory] = useState('');
  const [showCategoriesView, setShowCategoriesView] = useState(false);
  const [user, setUser] = useState('');
  const [maxPage, setMaxPage] = useState(1);
  const [isSearch, setIsSearch] = useState(false);
  const observer = useRef();

  const resize = () => {
    setMobileView(window.innerWidth <= 600);
  };

  const getMoreProducts = (username, page, category) => {
    // console.log('usermae', username, page, 'page', category, 'category');
    if (!username) {
      return;
    }
    const data = { username };
    setLoading(true);
    if (category) {
      if (isSearch) {
        props.getPublicPageSearchProducts({ seller: username, query: category }, 1);
      } else props.getFilteredProducts(data, page, category);
      return;
    }
    props.getPublicPageProducts(data, page);
  };
  
  useEffect(() => {
    setProducts([]);
    window.addEventListener('resize', resize);
    resize();
  }, []);
  useEffect(() => {
    if (props.username && props.username !== user) {
      setUser(props.username);
    }
  }, [props.username]);
  useEffect(() => {
    if (props.publicPageProducts && props.publicPageProducts !== products) {
      setProducts(props.publicPageProducts);
      setLoading(false);
    }
  }, [props.publicPageProducts]);

  useEffect(() => {
    if (props.parent === 'admin-page') {
      if (props.shopDetails && props.shopDetails.categories !== categories) {
        setCategories(props.shopDetails.categories);
      }
      if (props.shopDetails && props.shopDetails.is_category_view_enabled !== showCategoriesView) {
        setShowCategoriesView(props.shopDetails.is_category_view_enabled);
        if (props.shopDetails.is_category_view_enabled && chosenCategory === null) {
          setChosenCategory('');
        }
      }
    } else {
      if (props.publicPageShopDetails && props.publicPageShopDetails.categories !== categories) {
        setCategories(props.publicPageShopDetails.categories);
      }
      if (props.publicPageShopDetails && (!chosenCategory || chosenCategory === '') && props.publicPageShopDetails.is_category_view_enabled !== showCategoriesView) {
        setShowCategoriesView(props.publicPageShopDetails.is_category_view_enabled);

        if (props.shopDetails && props.shopDetails.is_category_view_enabled && chosenCategory === null) {
          setChosenCategory('');
        }
      }
    }
  }, [props.shopDetails, props.publicPageShopDetails]);
  useEffect(() => {
    if (props.publicPageProductsPageNum && props.publicPageProductsPageNum !== maxPage) {
      setMaxPage(props.publicPageProductsPageNum);
    }
  }, [props.publicPageProductsPageNum]);
  useEffect(() => {
    if (props.routingLocation.query && user) {
      let { category, search } = props.routingLocation.query;
      if (search) {
        search = decodeURI(search);
        if (search !== chosenCategory) {
          setProducts([]);
          props.getPublicPageSearchProducts({ seller: user, query: search }, 1);
          setPageNumber(1);
          setChosenCategory(search);
          setShowCategoriesView(false);
          setIsSearch(true);
          props.setPublicPageCategory(search);
        }
      } else if (category === 'all-categories') {
        setShowCategoriesView(true);
        setIsSearch(false);
        if (chosenCategory === null) {
          setChosenCategory('');
        }
      } else if (category) {
        category = decodeURI(category);
        // console.log(chosenCategory)
        if (category !== chosenCategory) {
          setProducts([]);
          getMoreProducts(user, 1, category);
          setPageNumber(1);
          setIsSearch(false);
          setChosenCategory(category);
          props.setPublicPageCategory(category);
        }
        setShowCategoriesView(false);
      } else if (!category && chosenCategory != null) {
        setProducts([]);
        setIsSearch(false);
        getMoreProducts(user, 1);
        setPageNumber(1);
        setChosenCategory(null);
        setShowCategoriesView(false);
      }
    }
  }, [props.routingLocation, user]);

  const lastProductElementRef = useCallback((node) => {
    if (loading) return;
    if (!observer) return;
    if (observer.current) {
      observer.current.disconnect();
    }
    // console.log(pageNumber, props.publicPageProductsPageNum)
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && (pageNumber + 1) <= props.publicPageProductsPageNum) {
        if (chosenCategory) {
          getMoreProducts(props.username, (pageNumber + 1), chosenCategory);
        } else {
          getMoreProducts(props.username, (pageNumber + 1));
        }
        setPageNumber((prevPageNumber) => prevPageNumber + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading]);
  
  const chooseCategory = (category) => {
    if (user) {
      const { query } = props.routingLocation;

      const path = query.tab ? `${window.location.pathname}?tab=${query.tab}&category=${category}`
        : `${window.location.pathname}?category=${category}`;
      store.dispatch(push(path));
    }
  };
  const showAllProducts = () => {
    if (user) {
      const { query } = props.routingLocation;
      const path = query.tab ? `${window.location.pathname}?tab=${query.tab}`
        : `${window.location.pathname}`;
      store.dispatch(push(path));
    }
  };

  const showAllCategories = () => {
    const { query } = props.routingLocation;

    const path = query.tab ? `${window.location.pathname}?tab=${query.tab}&category=all-categories`
      : `${window.location.pathname}?category=all-categories`;
    store.dispatch(push(path));
  };


  if (products && products.length > 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {
        showCategoriesView
          ? (
            <div className="home-page-products-div w-100" style={{ justifyContent: 'space-evenly' }}>
              <div className="home-page-products-top-div">
                <div className="heading" style={{ color: props.textColor }}>
                  <h3>Our Categories</h3>
                </div>
                <button className="category-fixed" type="button" onClick={() => showAllProducts()} style={{ border: `1px solid ${props.textColor}`, color: props.textColor }}>
                                      See All Products
                </button>
              </div>
              <div className="home-page-products-content" style={{ justifyContent: 'space-evenly' }}>
                {
                  categories.length !== 0
                    ? categories.map((c, i) => (
                      <div className="public-category relative" key={c.id} onClick={() => chooseCategory(c.name)}>
                        <div className="relative" style={{ overflow: 'hidden' }}>
                          <img src={c.image} alt="" overlaySrc={c.image} />
                        </div>
                        <div className="category-text">
                          <h3 className="ma0 relative">
                            {c.name}
                          </h3>
                        </div>
                      </div>
                    ))
                    : null
                }
              </div>
            </div>
          )
          : (
            <div className="flex w-100 ">

              {/* {
                  !mobileView ? (
                    <div className="public-categories-div">
                      <h3 style={{ color: props.textColor }}>Filter by:</h3>
                      {
                        categories.map((category) => (
                          <div className="public-categories-content" key={category.id}>
                            <button type="button" onClick={() => chooseCategory(category.name)}>
                              <p style={{ color: props.textColor }}>{category.name}</p>
                            </button>
                          </div>
                        ))
                      }
                      <div className="public-categories-content">
                        <button type="button" onClick={() => showAllCategories()}>
                          <p style={{ color: props.textColor, fontWeight: 'bold' }}>See all Categories >>></p>
                        </button>
                      </div>
                    </div>
                  )
                    : null
                } */}

              <div className="home-page-products-div w-100" style={{ justifyContent: 'space-evenly' }}>
                <div className="home-page-products-top-div">
                  <div className="heading">
                    <h3 style={{ color: props.textColor }}>
                      {
                        chosenCategory || 'Our Products'
                      }
                    </h3>
                  </div>

                  <button className="category-fixed" type="button" onClick={() => showAllCategories()} style={{ border: `1px solid ${props.textColor}`, color: props.textColor }}>
                    Categories
                  </button>


                </div>
                {
                products.length > 0
                  && (


                  <div className="home-page-products-content" style={{ justifyContent: 'space-evenly', margin: 'auto' }}>
                    {
                          products.map((p, i) => {
                            if ((i + 1) === (products.length - 9)) {
                              return (
                                <div className="public-product relative" ref={lastProductElementRef} key={p.id}>
                                  <Product data={p} parent={!props.parent ? 'public-home-page' : props.parent} style={{ width: '100%', margin: 0 }} />
                                </div>
                              );
                            }
                            return <Product data={p} key={p.id} parent={!props.parent ? 'public-home-page' : props.parent} />;
                          })
                      }
                  </div>

                  )
              }
                {
                loading
                  ? (
                    <div style={{
                      width: '100%', background: 'rgba(0,0,0,0.23)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', margin: '8px 0px', color: 'white',
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
            </div>
          )
      }

      </div>
    );
  }
  return null;
};


const mapStateToProps = (state) => ({
  // products: state.ProductsPageReducers.products,
  publicPageProducts: state.HomePageReducers.publicPageProducts,
  publicPageShopDetails: state.HomePageReducers.publicPageShopDetails,
  shopDetails: state.ProductsPageReducers.shopDetails,
  publicPageProductsPageNum: state.HomePageReducers.publicPageProductsPageNum,
  routingLocation: state.router.location,

});

const mapDispatchToProps = (dispatch) => ({
  getPublicPageProducts: (user, pageNumber) => dispatch({ type: GET_PUBLIC_PAGE_PRODUCTS, pageNumber, payload: agent.ProductsPage.getProducts(user, pageNumber) }),
  getFilteredProducts: (user, pageNumber, category) => dispatch({ type: GET_PUBLIC_PAGE_PRODUCTS, pageNumber, payload: agent.ProductsPage.getFilteredProducts(user, pageNumber, category) }),
  getPublicPageSearchProducts: (query, pageNumber) => dispatch({ type: GET_PUBLIC_PAGE_PRODUCTS, pageNumber, payload: agent.PublicPage.searchProduct(query, pageNumber) }),
  setPublicPageCategory: (category) => dispatch({ type: SET_PUBLIC_PAGE_CATEGORY, payload: category }),

});


export default connect(mapStateToProps, mapDispatchToProps)(RenderInfiniteScrollProduct);

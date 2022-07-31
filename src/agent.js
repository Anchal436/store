/* eslint-disable no-nested-ternary */
import axios from 'axios';


const API_ROOT = process.env.REACT_APP_ENV === 'production'
  ? 'https://myweblink.store'
  : process.env.REACT_APP_ENV === 'staging'
    ? 'https://test.myweblink.store'
    : 'https://dev.myweblink.store';
    
axios.defaults.baseURL = API_ROOT;
axios.defaults.timeout = 100 * 1000;
axios.defaults.headers = {};


const setToken = (token) => {
  axios.defaults.headers.common = { token };
};
const getToken = (token) => {
  return axios.defaults.headers.common;
};
const responseBody = (response) => response;

const requests = {
  delete: (url, data) => axios.delete(`${url}`, { data }).then(responseBody),
  get: (url) => axios.get(`${url}`).then(responseBody),
  // getAndPushToUrl: url => superagent.get(`${url}`).use(tokenPlugin).then(responseBody),
  getPaginated: (url, pageNum) => axios
    .get(`${url}`)
    .set('page_num', pageNum)
    .then(responseBody),
  put: (url, body) => axios.put(`${url}`, body).then(responseBody),
  post: (url, body) => axios.post(`${url}`, body).then(responseBody),
  postFile: (url, data) => {
    const formData = new FormData();
    data.forEach((d) => {
      formData.append(d.key, d.file);
    });

    return axios
      .post(`${url}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(responseBody);
  },
};

const Auth = {
  login: (data) => requests.post('/api/login/', data),
  logout: () => requests.post('/api/logout/'),
  register: (data) => requests.post('/api/register/', data),
  // updateUser: (data) => requests.post('/update/',data),
  getColleges: () => requests.get('/api/colleges/'),
  uploadProfileImage: (data) => requests.postFile('/api/upload/profile/', data),
  getUserDetails: (user) => requests.post('/api/user/', user),
  sendVerificationEmail: (email) => requests.post('/api/validate-email/', email),
};
const AdminPage = {
  createLink: (link) => requests.post('/api/links/', link),
  deleteLink: (link) => requests.delete('/api/links/', link),
  getLinks: () => requests.get('/api/links/'),
  updateLinkSequence: (sequence) => requests.post('/api/update-link-sequence/', sequence),
  uploadLinkIcon: (data) => requests.postFile('/api/upload-icon/', data),
  getHeaderInfo: (user) => requests.post('/pro/feature/', user),
  uploadHeaderInfo: (data) => requests.postFile('/pro/feature/header/', data),
  uploadBackground: (data) => requests.postFile('/pro/background/set/', data),
  getBackground: (user) => requests.post('/pro/background/get/', user),
  updateUserDetails: (user) => requests.post('/api/update/user/', user),
  getLinkClicks: () => requests.get('/analytics/get_clicks/'),
  getProfileViews: () => requests.get('/analytics/get_views/'),
  addClickToLink: (link) => requests.post('/analytics/click/', link),
  addViewToProfile: (user) => requests.post('/analytics/view/', user),
};
const Purchase = {
  createSubscription: (subscreption) => requests.post('/payment/subscribe/', subscreption),
  makeOrder: (data) => requests.post('/payment/order/', data),
  getPlans: () => requests.get('/api/packs/'),
};
const OrderHistory = {
  getOrders: () => requests.get('/payment/order/'),
  orderUnsubscribe: (payment) => requests.post('/payment/cancel/', payment),
};
const ProductsPage = {
  getProducts: (user, pageNumber) => requests.post(`/pro/products/get/?pageNo=${pageNumber}`, user),
  getFilteredProducts: (user, pageNumber, category) => requests.post(`/pro/products/get/?category=${category}&pageNo=${pageNumber}`, user),
  createProduct: (product) => requests.post('/pro/product/create/', product),
  updateProduct: (product) => requests.post('/pro/product/update/', product),
  addProductImage: (data) => requests.postFile('/pro/product/image/add/', data),
  deleteProductImage: (image) => requests.post('/pro/product/image/del/', image),
  deleteProduct: (product) => requests.post('/pro/product/delete/', product),
  getShopDetails: (user) => requests.post('/pro/shop/get/', user),
  setShippingAddress: (address) => requests.post('/pro/shipping/set/', address),
  getCategories: (user) => requests.post('/pro/categories/get/', user),
  deleteCategpry: (category) => requests.post('/pro/category/del/', category),
  setShopDetails: (details) => requests.post('/pro/shop/set/', details),
  getResellingProducts: (pageNumber) => requests.get(`/pro/product/resell/?pageNo=${pageNumber}`),
  addResaleProductToShop: (product) => requests.post('/pro/product/resell/add/', product),
  removeResaleProductToShop: (product) => requests.post('/pro/product/resell/remove/', product),
  getNotification: (pageNumber) => requests.get(`/notifications/get/?pageNo=${pageNumber}`),
  readNotification: (notification) => requests.post('/notifications/read/', notification),
  updateCategory: (data) => requests.postFile('/pro/category/update/', data),
};
const SoldProducts = {
  getNotDeliveredSoldProducts: (pageNo) => requests.get(`/payment/products/sold/get/?pageNo=${pageNo}&delivered=false`),
  getDeliveredSoldProducts: (pageNo) => requests.get(`/payment/products/sold/get/?pageNo=${pageNo}&delivered=true`),
  updateOrderStatus: (order) => requests.post('/payment/products/sold/update/', order),
  initiateRefund: (order) => requests.post('/payment/order/refund/', order),
  getShippingOptions: (data) => requests.post('/shipping/options/', data),
  createShipment: (order) => requests.post('/shipping/create/', order),
};
const Payments = {
  setBankingDetails: (details) => requests.post('/pro/banking/set/', details),
  redeemAmount: (amount) => requests.post('/pro/pending/retrieve/', amount),
  getPendingPayment: () => requests.get('/pro/pending/get/'),
  getRedeemHistory: () => requests.get('/pro/pending/history/'),
  getBankDetails: () => requests.get('/pro/banking/get/'),
};
const PublicPage = {
  searchProduct: (query, pageNo) => requests.post(`/pro/product/search/?pageNo=${pageNo}`, query),
  getProductDetails: (productSlug) => requests.get(`/pro/product/get/${productSlug}/`),
  logError: (error) => requests.post('/log/', error),
};

const DesignHomePage = { 
  addCoverPhoto: (data) => requests.postFile('/pro/shop/homepage/cover/set/', data),
  deleteCoverPhoto: (data) => requests.post('/pro/shop/homepage/cover/del/', data),
  setHomePageInfo: (data) => requests.post('/pro/shop/homepage/info/set/', data),
  getHomePageData: (seller) => requests.post('/pro/shop/homepage/get/',seller),
  getFeaturedProducts: (seller) => requests.post('/pro/products/featured/get/',seller),
}

export default {
  Auth,
  setToken,
  AdminPage,
  requests,
  Purchase,
  OrderHistory,
  ProductsPage,
  SoldProducts,
  Payments,
  PublicPage,
  getToken,
  DesignHomePage,
};

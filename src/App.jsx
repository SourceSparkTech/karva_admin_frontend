import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './components/home-page';
import CategoryAddScreen from './components/add-category';
import HomeLayout from './components/home-layout';
import LoginScreen from './components/log-in';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BlogPage from './components/blog-add-page';
import Products from './components/product-page';
import NotFound from './components/not-found';
import BrandPage from './components/brand-page';
import Footer from './components/footer';
import TermAndCondition from './components/footer/term-and-condition';
import Privacy from './components/footer/privacy';
import Address from './components/footer/address';
import HomeChangeBanner from './components/home-banner-gallary';
import Banner from './components/home-banner-gallary/banner';
import Gallery from './components/home-banner-gallary/gallary';
import FollowUs from './components/footer/follow-us';
import ContactUs from './components/footer/contact-us';
import AboutUs from './components/footer/about-us';

function App() {
  return (
    <>
      <Routes>
        <Route path='/log-in' element={<LoginScreen />} />

        <Route path='/' element={<HomeLayout />} >
          <Route path='/' element={<HomePage />} />
          <Route path='/category' element={<CategoryAddScreen />} />
          <Route path='/blogs' element={<BlogPage />} />
          <Route path='/products' element={<Products />} />
          <Route path='/brand' element={<BrandPage />} />

          <Route path='/footer' element={<Footer />}>
            <Route index element={<TermAndCondition />} />
            <Route path='term-condition' element={<TermAndCondition />} />
            <Route path='privacy-policy' element={<Privacy />} />
            <Route path='address' element={<Address />} />
            <Route path='follow-us' element={<FollowUs />} />
            <Route path='contact-us' element={<ContactUs />} />
            <Route path='about-us' element={<AboutUs />} />
          </Route>

          <Route path='/home-change' element={<HomeChangeBanner />}>
            <Route index element={<Banner />} />
            <Route path='banner' element={<Banner />} />
            <Route path='gallery' element={<Gallery />} />
          </Route>
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>

      <ToastContainer pauseOnHover={false} autoClose={1000} position="top-left" />

    </>
  );
}

export default App;

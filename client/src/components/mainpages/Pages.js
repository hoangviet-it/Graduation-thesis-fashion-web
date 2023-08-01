import React, {useContext} from 'react';
import {Switch, Route} from 'react-router-dom';
import {GlobalState} from '../../GlobalState';
import Products from './products/Products';
import DetailProduct from './detailproduct/DetailProduct';
import Login from './auth/Login';
import Register from './auth/Register';
import Cart from './cart/Cart';
import NotFound from './utils/not_found/NotFound';
import CreateProduct from './createProduct/CreateProduct';
import CreateOrder from './creatOrder/CreateOrder';
import HomePage from './homePage/HomePage';
import MyOrder from './myOrder/MyOrder';
import UpdateInforClient from './updateInforClient/UpdateInforClient';
import DiscountPage from './discount/DiscountPage';
import Intro from './intro/Intro';
import Contact from './contact/Contact';
import ControlAd from '../Admin/ControlAd';
import News from './news/News';
import DetailNews from './detailNews/DetailNews';
import PrivacyPolicy from '../footer/pageFooter/PrivacyPolicy';
import Rules from '../footer/pageFooter/Rules';
import Intruct from '../footer/pageFooter/Intruct';

function Pages() {
    const state = useContext(GlobalState)
    const [isLogged] = state.userAPI.isLogged
    const [isClient] = state.userAPI.isClient
    // const [isAdmin] = state.userAPI.isAdmin
    // const [adminOrder] = state.userAPI.adminOrder
    // const [adminProduct] = state.userAPI.adminProduct
    // const [isShipper] = state.userAPI.isShipper
    
    return (
        <Switch>
            <Route path="/" exact component={isClient > 0 ? ControlAd : HomePage} />

            <Route path="/login" exact component={isLogged ? NotFound : Login} />
            <Route path="/register" exact component={isLogged ? NotFound : Register} />

            <Route path="/product" exact component={Products} />
            <Route path="/detail/:id" exact component={DetailProduct} />
            <Route path="/discountpage" exact component={DiscountPage} />
            <Route path="/intro" exact component={Intro} />
            <Route path="/contact" exact component={Contact} />
            <Route path="/news" exact component={News} />
            <Route path="/detail_news/:id" exact component={DetailNews} />
            <Route path="/cart" exact component={Cart} />
            <Route path="/privacy" exact component={PrivacyPolicy} />
            <Route path="/rules" exact component={Rules} />
            <Route path="/intruct" exact component={Intruct} />

            <Route path="/order" exact component={isLogged ? CreateOrder : NotFound} />
            <Route path="/myorder" exact component={isLogged ? MyOrder : NotFound} />
            <Route path="/updateinforclient" exact component={isLogged ? UpdateInforClient : NotFound} />

            {/* <Route path="/create_product" exact component={isAdmin ? CreateProduct : NotFound} />
            <Route path="/edit_product/:id" exact component={isAdmin ? CreateProduct : NotFound} /> */}
            
            <Route path="*" exact component={NotFound} />
        </Switch>
    )
}
export default Pages;
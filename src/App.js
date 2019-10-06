import React from 'react';
import Header from './landingpage/header'
import Login from './landingpage/login'
import User from './user/user'
import { BrowserRouter as Router, Route } from "react-router-dom";
import SignUp from './landingpage/signup';
import AllUser from './user/alluser'
import LandingPage from './landingpage';
import ShowProduct from './product/product';
import EditProduct from './product/editProduct';
import EditUser from './user/editUser';
import Review from './product/review'


function App() {
  return (
    <div>
      <Router>
        <Header></Header>
        <Route exact path='/' component={LandingPage}></Route>
        <Route exact path='/signup' component={SignUp}></Route>
        <Route exact path='/login' component={Login}></Route>
        <Route exact path='/user/:id' component={User}></Route>
        <Route exact path='/alluser' component={AllUser}></Route>
        <Route exact path='/product' component={LandingPage}></Route>
        <Route exact path='/product/:id' component={ShowProduct}></Route>
        <Route exact path='/productEdit/:id' component={EditProduct}></Route>
        <Route exact path='/userEdit/:id' component={EditUser}></Route>
        <Route exact path='/reviewDetail/:id' component={Review}></Route>



      </Router>


    </div>
  );
}

export default App;

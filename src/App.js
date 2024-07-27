import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Login } from './pages/Login'
import DashBoard from "./pages/DashBoard";
import Users from "./pages/Users";
import Products from "./pages/Products";
import { ToastContainer } from "react-toastify";
import Navbar from './components/Navbar';
import OrderList from "./pages/OrderList";
import ForgetPassword from "./pages/ForgetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import Category from "./pages/Category";
import SubCategory from "./pages/SubCategory";
import AddProduct from "./pages/AddProduct";

const PrivateRoute = () => {

  const token = localStorage.getItem('token');

  return token ? (
    <>
      <Navbar />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
}

const PublicRoute = () => {

  const token = localStorage.getItem('token');

  return !token ? <Outlet /> : <Navigate to="/" />

}

function App() {


  return (
    <>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path='/users' element={<Users />} />
              <Route path="/products" element={<Products />} />
              <Route path='/' element={<DashBoard />} />
              <Route path="/order-list" element={<OrderList />} />
              <Route path="/category" element={<Category />}/>
              <Route path="/subcategory" element={<SubCategory/>}/>
              <Route path="/addproduct" element={<AddProduct />} />
              <Route path="/order-list" element={<OrderList />} />
            </Route>

            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/forget-password" element={<ForgetPassword />} />
              <Route path="/update-password" element={<UpdatePassword />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;

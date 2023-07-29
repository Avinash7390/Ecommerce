import React from "react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  //total price....
  const TotalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total += item.price;
      });
      return total;
    } catch (error) {
      console.log(error);
    }
  };

  //delete items.....
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={"Cart - Ecommerce Web"}>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {/* {`${auth?.token  && auth?.user?.name}`} */}
              {auth?.token ? `Hello ${auth?.user?.name}` : ""}
            </h1>
            <h4 className="text-center">
              {cart.length >= 1
                ? `You Have ${cart.length} items in your cart ${
                    auth.token ? "" : "Please Login to CheckOut"
                  }`
                : "Your cart is empty"}
            </h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            <div className="row">
              {cart?.map((p) => (
                <div className="row card flex-row mb-2 p-3">
                  <div className="col-md-4 ">
                    <img
                      src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p?._id}`}
                      className="card-img-top"
                      alt={p.name}
                      width={"100px"}
                      height={"100px"}
                    />
                  </div>
                  <div className="col-md-8">
                    <p>{p.name}</p>
                    <p>{p.description.substring(0, 30)}</p>
                    <p>{p.price}</p>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => removeCartItem(p._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-4 text-center">
            <h2>Cart Summary</h2>
            <p>Total | CheckOut | Payment</p>
            <h4>Total Rs: {TotalPrice()}</h4>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [product, setProduct] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [cart, setCart] = useCart();

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getRelatedProduct(data?.product?._id, data?.product?.category?._id);
    } catch (error) {
      console.log(error);
    }
  };

  //related product...

  const getRelatedProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="row container mt-2">
        <div className="col-md-6">
          <img
            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product?._id}`}
            className="card-img-top"
            alt={product?.name}
          />
        </div>
        <div className="col-md-6 ">
          <h2 className="text-center">Product Details</h2>
          <h6>Name : {product?.name}</h6>
          <h6>Description : {product?.description}</h6>
          <h6>Price : {product?.price}</h6>
          <h6>Category : {product?.category?.name} </h6>
          {/* <button className="btn btn-secondary ms-1">ADD TO CART</button> */}
          <button
            className="btn btn-secondary ms-1"
            onClick={() => {
              setCart([...cart, product]);
              localStorage.setItem("cart", JSON.stringify([...cart, product]));
              toast.success("Item added to cart!");
            }}
          >
            ADD TO CART
          </button>
        </div>
      </div>
      <hr />
      <div className="row container">
        <h6>Related Products</h6>
        {relatedProducts.length < 1 && (
          <p className="text-center">No similar Products found</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((p) => (
            <div className="card m-2" style={{ width: "18rem" }}>
              <img
                src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p?._id}`}
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">{p.description.substring(0, 30)}</p>
                <p className="card-text">Rs. {p.price}</p>
                <button
                  className="btn btn-primary ms-1"
                  onClick={() => navigate(`/product/${p.slug}`)}
                >
                  More Details
                </button>
                {/* <button className="btn btn-secondary ms-1">ADD TO CART</button> */}
                <button
                  className="btn btn-secondary ms-1"
                  onClick={() => {
                    setCart([...cart, p]);
                    localStorage.setItem("cart", JSON.stringify([...cart, p]));
                    toast.success("Item added to cart!");
                  }}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;

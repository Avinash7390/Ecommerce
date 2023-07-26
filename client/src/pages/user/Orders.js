import React from "react";
import Layout from "../../components/layout/Layout";
import UserMenu from "../../components/layout/UserMenu";

const Orders = () => {
  return (
    <Layout title={"Dashbord - Orders"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">All Orders</div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;

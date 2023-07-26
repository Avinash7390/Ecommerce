import React from "react";
import Layout from "../../components/layout/Layout";
import UserMenu from "../../components/layout/UserMenu";

const Profile = () => {
  return (
    <Layout title={"Dashbord - Profile"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">Your Profile</div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;

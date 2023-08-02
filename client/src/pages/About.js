import React from "react";
import Layout from "../components/layout/Layout";

const About = () => {
  return (
    <Layout title={"About-Us"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/about.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <p className="text-justify mt-2">
            Hello! User We are an e-commerce company we provide everything what
            you need from basic to anything you can imagine..
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;

import React from "react";
import Header from "./Header.js";
import Footer from "./Footer.js";

import { Helmet } from "react-helmet";

const Layout = ({ children, title, description, author, keyword }) => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="author" content={author} />
        <meta name="keyword" content={keyword} />
        <title>{title}</title>
      </Helmet>
      <Header />
      <main style={{ minHeight: "70vh" }}>{children}</main>
      <Footer />
    </div>
  );
};

Layout.defaulProps = {
  title: "Ecommerce Web - shop now",
  description: "An Online baZZar",
  keyword: "shop, products, olnline-shoping",
  author: "Avinash",
};

export default Layout;

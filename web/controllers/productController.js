import { Shopify, ApiVersion } from "@shopify/shopify-api";
import verifyRequest from "../middleware/verify-request.js";
import express from "express";

const app = express();


app.get("/api/products/count", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    const { Product } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );

    const countData = await Product.count({ session });
    res.status(200).send(countData);
  });

  app.get("/api/products", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    const { Product } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );

    const countData = await Product.all({ session });
    console.log(countData);
    res.status(200).send(countData);
  });


  app.post("/api/createproducts",verifyRequest(app), async (req, res) => {
    console.log('hellow',req)
    try {
      const test_session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );
      
      const { Product } = await import(
        `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
      );
      console.log('req.body',req.body);
      const product = new Product({ session: test_session });
      const {
       
       vendor,
       status,
       title
    } = req.body;

    
      product.vendor =vendor;
      product.status =status;
      product.title=title
      console.log('product',product);
      const createdata = await product.save();
      res.status(200).send(createdata);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });


  export default app;
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
  res.status(200).send(countData);
});

app.post("/api/createproducts", verifyRequest(app), async (req, res) => {
  console.log("hellow", req);
  try {
    const test_session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    const { Product } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );
    const product = new Product({ session: test_session });
    const { vendor, status, title } = req.body;
    product.vendor = vendor;
    product.status = status;
    product.title = title;
    const createdata = await product.save();
    res.status(200).send(createdata);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.delete("/api/product/delete/:id", verifyRequest(app), async (req, res) => {
  try {
    const test_session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    const { Product } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );
    const deleteProduct = await Product.delete({
      session: test_session,
      id: req.params.id,
    });
    res.status(200).send(deleteProduct);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.put("/api/product/edit/:id", verifyRequest(app), async (req, res) => {
  try {
    console.log("req.body", req.body);
    const test_session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    const { Product } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );
    const product = new Product({ session: test_session });
    product.id = req.params.id;
    product.title = req.body.title;
    product.vendor = req.body.vendor;
    product.status = req.body.status;
    const updatedata = await product.save({});
    res.status(200).send(updatedata);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default app;

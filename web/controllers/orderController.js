import { Shopify } from "@shopify/shopify-api";
import verifyRequest from "../middleware/verify-request.js";
import express from "express";

const app = express();

app.get("/allorders", verifyRequest(app), async (req, res) => {
  try {
    // console.log('first')
    const test_session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    const { Order } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );
    const allOrder = await Order.all({
      session: test_session,
    });
    //   console.log('all order',allOrder);
    res.status(200).send(allOrder);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/createorders", verifyRequest(app), async (req, res) => {
  try {
    console.log("req.body", req.body);
    const test_session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    const { Order } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );

    const order = new Order({ session: test_session });

    (order.total_price = req.body.total_price),
      (order.order_number = req.body.order_number),
      (order.line_items = [
        {
          variant_id: req.body.variant_id, // aanu karbvanu
          name: req.body.name,
          price: req.body.price,
          quantity: req.body.quantity,
        },
      ]);

    console.log("ordesr....", order);
    const orderCreted = await order.save({
      update: true,
    });
    res.status(200).send(orderCreted);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.delete("/order/delete/:id", verifyRequest(app), async (req, res) => {
  try {
    console.log("req.body", req.body, " ", req.params.id);
    const test_session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    const { Order } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );

    const deleteOrder = await Order.delete({
      session: test_session,
      id: req.params.id,
    });
    res.status(200).send(deleteOrder);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// nathi chalti rest admin API

// app.put("/orders/update/:id", verifyRequest(app), async (req, res) => {
//   try {
//     console.log("req.body", req.body);
//     const test_session = await Shopify.Utils.loadCurrentSession(
//       req,
//       res,
//       app.get("use-online-tokens")
//     );
//     const { Order } = await import(
//       `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
//     );
//     console.log("update id", req.params.id);

//     const order = new Order({ session: test_session });
//     order.id = req.params.id;
//     order.line_items = [
//       {
//         // name: req.body.name,
//         quantity: req.body.quantity,
//         // price: req.body.price,
//       },
//     ];
//     console.log("items", order);
//    const updatedata = await order.save({ update: true });
   
//     console.log("updatedata", updatedata);
//     res.status(200).send(updatedata);
//   } catch (error) {
//     res.status(500).send(error.message);
//     console.log(error);
//   }
// });


// graphql update api order ( ny chale )
// app.post("/orders/update/:id", verifyRequest(app), async (req, res) => {
//   try {
//     const session = await Shopify.Utils.loadCurrentSession(
//       req,
//       res,
//       app.get("use-online-tokens")
//     );
//     const client = new Shopify.Clients.Graphql(
//       session.shop,
//       session.accessToken
//     );
//     const id = req.params.id;
//     const qty = req.body.quantity;
//     const lId=req.body.lId;
//     console.log('backend ::',id,qty,lId)

//     const dataQuery = `mutation {
//       orderEditSetQuantity(id: "gid://shopify/CalculatedOrder/${id}, lineItemId: "gid://shopify/CalculatedLineItem/${lId}", quantity: "${qty}") {
//         calculatedOrder {
//           id
//           addedLineItems(first: 5) {
//             edges {
//               node {
//                 id
//                 quantity
//               }
//             }
//           }
//         }
//         userErrors {
//           field
//           message
//         }
//       }
//     }`;
  
 
//     const updateOrder = await client.query({ data: { query: dataQuery, } });
//     console.log('***',updateOrder);
//     res.status(200).send(updateOrder);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

export default app;

import {
  Page,
  Button,
  Modal,
  FormLayout,
  RadioButton,
  Stack,
  TextContainer,
  TextField,
  TextStyle,
  IndexTable,
  Card,
  Spinner,
} from "@shopify/polaris";
import React from "react";
import axios from "axios";
import { useAppBridge, ResourcePicker } from "@shopify/app-bridge-react";
import { useCallback, useEffect, useState } from "react";
import { getSessionToken } from "@shopify/app-bridge-utils";

let vvid = 0;

// order ni edit API ny chale ny karvani

export function OrderTableExample() {
  const [loader, SetLoader] = useState(true);
  const [order, setOrder] = useState([]);
  const [active, setActive] = useState(false);
  const [activeCreate, setActiveCreate] = useState(false);

  const [input, setinput] = useState({
    id: "",
    price: 0,
    quantity: 0,
    // total_price: '',
    // order_number: 0,
    name: "",
    lId:''
  });

  const handleChange = useCallback(() => {
    setActive(!active), [active];
  });

  const handleChangeCreate = useCallback(
    () => setActiveCreate(!activeCreate),
    [activeCreate]
  );

  const inputEvent = (e, key) => {
    setinput({ ...input, [key]: e });
  };

  const app = useAppBridge();

  const getAllOrders = async () => {
    // console.log("object");
    const token = await getSessionToken(app);
    // console.log("token", token);
    const res = await axios.get("/api/allorders", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    console.log("res data", res.data);
    setOrder(res.data);
    SetLoader(false);
  };

  const createOrder = async () => {
    const token = await getSessionToken(app);
    const res = await axios.post(
      "/api/createorders",
      {
        variant_id: vvid,
        price: input.price,
        quantity: input.quantity,
        // total_price: input.total_price,
        // order_number: input.order_number,
        // name: input.name,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    console.log("res createproduct", res);
    (input.price = ""),
      (input.quantity = 0),
      // (input.total_price = ''),
      // (input.order_number = 0),
      (input.name = "");
  };

  const deleteOrder = async (id) => {
    console.log(" delete id", id);
    const token = await getSessionToken(app);
    // console.log('token',token)
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        "ngrok-skip-browser-warning": false,
      },
    };
    // console.log('config   ', config)
    const { data } = await axios.delete(`/api/order/delete/${id}`, config);
    console.log("delete record", data);
    if (data.success === true) {
      getAllOrders();
    }
  };

  // const editOrder = async (input) => {
  //   console.log("input", input);

  //   const token = await getSessionToken(app);
  //   const data = await axios.post(
  //     `/api/orders/update/${input.id}`,
  //     {
  //       // name: input.name,
  //       // price: input.price,
  //       id:input.id,
  //       lId:input.lId,
  //       quantity: input.quantity,
  //     },
  //     {
  //       headers: {
  //         Authorization: "Bearer " + token,
  //       },
  //     }
  //   );
  //   console.log("update data", data);
  //   getAllOrders();

  //   (input.price = 0), 
  //   (input.quantity = 0), 
  //   (input.name = "");
  // };

  useEffect(() => {
    getAllOrders();
  });

  const deleteData = () => {
    (input.price = 0),
      (input.quantity = 0),
      // (input.total_price = 0),
      // (input.order_number = 0),
      (input.name = "");
  };

  // const updatepopmodel = () => {
  //   return (
  //     <div>
  //       <Modal
  //         open={active}
  //         onClose={() => {
  //           deleteData();
  //           handleChange();
  //         }}
  //         title="Edit Product Details"
  //         primaryAction={{
  //           content: "Update",
  //           onAction: () => {
  //             editOrder(input);
  //             handleChange();
  //           },
  //         }}
  //         secondaryActions={[
  //           {
  //             content: "close",
  //             onAction: () => {
  //               deleteData();
  //               handleChange();
  //             },
  //           },
  //         ]}
  //       >
  //         <Modal.Section>
  //           <TextContainer>
  //             <FormLayout>
  //               {/* <TextField
  //                 label="Name"
  //                 onChange={(e) => {
  //                   inputEvent(e, "name");
  //                 }}
  //                 value={input.name}
  //               /> */}
  //               <TextField
  //                 label="Quantity"
  //                 onChange={(e) => {
  //                   inputEvent(e, "quantity");
  //                 }}
  //                 autoComplete="off"
  //                 value={input.quantity}
  //               />
  //               {/* <TextField
  //                 label="Price"
  //                 onChange={(e) => {
  //                   inputEvent(e, "price");
  //                 }}
  //                 autoComplete="off"
  //                 value={input.price}
  //               /> */}
  //             </FormLayout>
  //           </TextContainer>
  //         </Modal.Section>
  //       </Modal>
  //     </div>
  //   );
  // };

  const ModalExample = () => {
    return (
      <div>
        <Modal
          open={activeCreate}
          onClose={() => {
            deleteData();
            handleChangeCreate();
          }}
          title="Create Order Details"
          primaryAction={{
            content: "Add Order",
            onAction: () => {
              createOrder();
              handleChangeCreate();
            },
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: () => {
                deleteData();
                handleChangeCreate();
              },
            },
          ]}
        >
          <Modal.Section>
            <ResourcePicker
              resourceType="Product"
              onSelection={(SelectPayload) => {
                vvid = SelectPayload.selection[0].variants[0].id.split("/")[4];
                console.log(
                  "slection id",
                  SelectPayload.selection[0].variants[0].id.split("/")[4]
                );
              }}
              open
            />
            <FormLayout>
              {/* <TextField
                label="total_price"
                onChange={(e) => {
                  inputEvent(e, "total_price");
                }}
                autoComplete="off"
                value={input.total_price}
              /> */}
              {/* <TextField
                label="order_number"
                onChange={(e) => {
                  inputEvent(e, "order_number");
                }}
                autoComplete="off"
                value={input.order_number}
              /> */}
              {/* <TextField
                label="name"
                onChange={(e) => {
                  inputEvent(e, "name");
                }}
                autoComplete="off"
                value={input.name}
              /> */}
              <TextField
                label="price"
                onChange={(e) => {
                  inputEvent(e, "price");
                }}
                autoComplete="off"
                value={input.price}
              />
              <TextField
                label="quantity"
                onChange={(e) => {
                  inputEvent(e, "quantity");
                }}
                autoComplete="off"
                value={input.quantity}
              />
            </FormLayout>
          </Modal.Section>
        </Modal>
      </div>
    );
  };

  const resourceName = {
    singular: "product",
    plural: "products",
  };

  const rowMarkup = order.map(
    ({ id, total_price, line_items, order_number }, index) => (
      <IndexTable.Row id={id} key={id} position={index}>
        <IndexTable.Cell>
          <Button
            onClick={() => {
              deleteOrder(id);
            }}
          >
            <TextStyle variation="strong">Delete</TextStyle>
          </Button>{" "}
          <Button
            onClick={() => {
              setActive(true);
              // console.log( 'lid',line_items[0].id)
              setinput({
                id: id,
                lId: line_items[0].id,
                // price: line_items[0].price,
                quantity: line_items[0].quantity,
                // name: line_items[0].name,
              });
            }}
          >
            <TextStyle variation="strong">Edit</TextStyle>
          </Button>
        </IndexTable.Cell>

        <IndexTable.Cell>{line_items[0].price}</IndexTable.Cell>
        <IndexTable.Cell>{line_items[0].quantity}</IndexTable.Cell>
        <IndexTable.Cell>{total_price}</IndexTable.Cell>
        <IndexTable.Cell>{"#" + order_number}</IndexTable.Cell>
        <IndexTable.Cell>{line_items[0].name}</IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <Page title="Order list">
      <div>
        <Button
          onClick={() => {
            setActiveCreate(true);
          }}
        >
          Create
        </Button>
      </div>
      <br />
      {loader ? (
        <Spinner size="small" />
      ) : (
        <Card>
          <IndexTable
            resourceName={resourceName}
            itemCount={order.length}
            headings={[
              { title: "Delete / Edit" },
              { title: "Price" },
              { title: "Quantity" },

              { title: "Total Price" },

              { title: "Order No" },
              { title: "Item Name" },
            ]}
            selectable={false}
          >
            {rowMarkup}
          </IndexTable>
        </Card>
      )}
      <div>
        {ModalExample()}
        {/* {updatepopmodel()} */}
      </div>
    </Page>
  );
}

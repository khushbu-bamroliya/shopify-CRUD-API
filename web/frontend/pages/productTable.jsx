import {
  Page,
  Card,
  DataTable,
  Button,
  Modal,
  FormLayout,
  RadioButton,
  Stack,
  TextContainer,
  TextField,
  ResourceItem,
  ResourceList,
  TextStyle,
} from "@shopify/polaris";
import React from "react";
import axios from "axios";

import { Toast, useAppBridge } from "@shopify/app-bridge-react";
import { useCallback, useEffect, useState } from "react";
import { getSessionToken } from "@shopify/app-bridge-utils";

export function DataTableExample() {
  const [product, setProduct] = useState([]);
  const rows = product.map((val, i) => {
    return [val.title, val.status, val.vendor];
  });
  const [active, setActive] = useState(false);

  const handleChange = useCallback(() => setActive(!active), [active]);
  const [input, setinput] = useState({
    title: "",
    vendor: "",
    status: true,
  });

  const inputEvent = (e, key) => {
    setinput({ ...input, [key]: e });
  };

  const app = useAppBridge();
  const getAllOrders = async () => {
    const token = await getSessionToken(app);
    console.log("token:-", token);
    const config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    const { data } = await axios.get("/api/products", config);
    console.log(data);
    setProduct(data);
  };

  const createProduct = async () => {
    const token = await getSessionToken(app);
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };
    const res = await axios
      .post(
        "/api/createproducts",
        {
          vendor: input.vendor,
          status: input.status,
          title: input.title,
        },
        config
      )
      .then((response) => {
        console.log("response.data", response.data);
      });
    console.log("res", res);
  };

  useEffect(() => {
    getAllOrders();
  });

  const ModalExample = () => {
    console.log("object");
    return (
      <div style={{ height: "500px" }}>
        <Modal
          open={active}
          onClose={handleChange}
          title="Create Product Details"
          primaryAction={{
            content: "Add Product",
            onAction: () => {
              createProduct();
              handleChange();
            },
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: handleChange,
            },
          ]}
        >
          <Modal.Section>
            <FormLayout>
              <TextField
                label="Title"
                onChange={(e) => {
                  inputEvent(e, "title");
                }}
                autoComplete="off"
                value={input.title}
              />
              <TextField
                label="Vendor"
                onChange={(e) => {
                  inputEvent(e, "vendor");
                }}
                autoComplete="off"
                value={input.vendor}
              />

              <Stack>
                <RadioButton
                  label="Active"
                  checked={input.status === "active"}
                  id="active"
                  name="accounts"
                  onChange={(value) => {
                    setinput({ ...input, status: value ? "active" : "" });
                  }}
                />
                <RadioButton
                  label="archived"
                  id="archived"
                  name="accounts"
                  checked={input.status === "archived"}
                  onChange={(value) => {
                    setinput({ ...input, status: value ? "archived" : "" });
                  }}
                />
                <RadioButton
                  label="draft"
                  id="draft"
                  name="accounts"
                  checked={input.status === "draft"}
                  onChange={(value) => {
                    setinput({ ...input, status: value ? "draft" : "" });
                  }}
                />
              </Stack>
            </FormLayout>
          </Modal.Section>
        </Modal>
      </div>
    );
  };

  return (

    <Page title="Product list">

    <Button onClick={handleChange}>Create</Button>

      <Card>
        <DataTable
          columnContentTypes={[
            'text',
            'text',
            'text',
            'text',

          ]}
          headings={[
            'Product Title',
            'Status',
            'Vendor',

          ]}
          rows={rows}

        />

      </Card>
     <div>
     {ModalExample()}
     </div>
    </Page>
  );

  // return (
  //   <Page title="Product list" >
  //     <Button onClick={handleChange}>Create</Button>

  //     <ResourceList 
     
  //       resourceName={{ singular: "product", plural: "products" }}
  //       items={product}
  //       // selectedItems={selectedItems}
  //       // onSelectionChange={setSelectedItems}
  //       // selectable
  //       renderItem={(item) => {
  //         // const variants_id = item.variants.map((e) => {
  //         //   console.log("e", e);
  //         //   return e.id;
  //         // });
  //         const { title, status, vendor } = item;
  //         return (
  //           <>
  //             <ResourceItem>
  //               <div
  //                 style={{
  //                   display: "flex",
  //                   flexDirection: "row",
  //                   justifyContent: "space-between",
  //                 }}
  //               >
  //                 <div >
  //                   {"    "}
  //                   <TextStyle variation="strong">{title} </TextStyle>
  //                 </div>
  //                 <div>
  //                 {"    "}
  //                   <TextStyle variation="strong">{status}</TextStyle>
  //                 </div>
  //                 <div>
  //                 {"    "}
  //                   <TextStyle variation="strong">{vendor} </TextStyle>
  //                 </div>
  //                 {"    "}
  //                 <div>
  //                   <Button>Delete</Button>
  //                 </div>
  //                 <div></div>
  //               </div>
  //             </ResourceItem>
  //           </>
  //         );
  //       }}
  //     />
  //     <div>{ModalExample()}</div>
  //   </Page>
  // );
}

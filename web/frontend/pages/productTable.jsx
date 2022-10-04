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
  Spinner
} from "@shopify/polaris";
import React from "react";
import axios from "axios";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useCallback, useEffect, useState } from "react";
import { getSessionToken } from "@shopify/app-bridge-utils";

export function ProductTableExample() {
  const [loader, SetLoader] = useState(true);
  const [product, setProduct] = useState([]);
  const [active, setActive] = useState(false);
  const [activeCreate, setActiveCreate] = useState(false);

  const [input, setinput] = useState({
    id: "",
    title: "",
    vendor: "",
    status: true,
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

  const spinner=<Spinner accessibilityLabel="Spinner example" size="large" />

  const app = useAppBridge();

  const getAllOrders = async () => {
    const token = await getSessionToken(app);
    const config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    const { data } = await axios.get("/api/products", config);
    setProduct(data);
    SetLoader(false);
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
      ).then((response) => {
        console.log("response.data");
      });
    (input.vendor = ""), (input.status = true), (input.title = "");
  };

  const deleteProduct = async (id) => {
    // console.log(" delete id", id);
    const token = await getSessionToken(app);
    // console.log('token',token)
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        "ngrok-skip-browser-warning": false,
      },
    };
    // console.log('config   ', config)
    const { data } = await axios.delete(`/api/product/delete/${id}`, config);
    // console.log("delete record", data);
    if (data.success === true) {
      getAllOrders();
    }
  };

  const editProduct = async (input) => {
    console.log("update input", input);
    const token = await getSessionToken(app);
    const config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    const data = await axios.put(
      `/api/product/edit/${input.id}`,
      {
        id: input.id,
        title: input.title,
        vendor: input.vendor,
        status: input.status,
      },
      config
    );
        if (data.success === true) {
          getAllOrders()
     }

    (input.vendor = ""), (input.status = true), (input.title = "");
  };

  useEffect(() => {
    getAllOrders();
  },);

  const deleteData=()=>{
    input.status=false,
    input.title='',
    input.vendor=''
  }

  const updatepopmodel = () => {
    return (
      <div>
        <Modal
          open={active}
          onClose={()=>{
            deleteData();
              handleChange();
          }}
          title="Edit Product Details"
          primaryAction={{
            content: "Update",
            onAction: () => {
              editProduct(input);
              handleChange();
            },
          }}
          secondaryActions={[
            {
              content: "close",
              onAction:  () => {
              deleteData();
              handleChange();
            },
            },
          ]}>
          <Modal.Section>
            <TextContainer>
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
            </TextContainer>
          </Modal.Section>
        </Modal>
      </div>
    );
  };

  const ModalExample = () => {
    return (
      <div>
        <Modal
          open={activeCreate}
          onClose={()=>{
            deleteData();
              handleChangeCreate();
          }}
          title="Create Product Details"
          primaryAction={{
            content: "Add Product",
            onAction: () => {
              createProduct();
              handleChangeCreate();
            },
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction:  () => {
              deleteData();
              handleChangeCreate();
            },
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

  const resourceName = {
    singular: "product",
    plural: "products",
  };

  const rowMarkup = product.map(
    ({ title, status, vendor, id }, index) => (
    <IndexTable.Row
      id={id}
      key={id}
      position={index}
    >
      <IndexTable.Cell>
        <Button
          onClick={() => {
            setinput({
              id: id,
              title: title,
              vendor: vendor,
              status: status,
            });
            deleteProduct(id);
          }}
        >
          <TextStyle variation="strong">Delete</TextStyle>
        </Button>{" "}
        <Button
          onClick={() => {
            setActive(true);
            setinput({
              id: id,
              title: title,
              vendor: vendor,
              status: status,
            });
          }}
        >
          <TextStyle variation="strong">Edit</TextStyle>
        </Button>
      </IndexTable.Cell>
      <IndexTable.Cell>{title}</IndexTable.Cell>
      <IndexTable.Cell>{status}</IndexTable.Cell>
      <IndexTable.Cell>{vendor}</IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Page title="Product list">
      <div>
        <Button onClick={() => {
            setActiveCreate(true);
          }}>Create</Button>
      </div>
      <br />
      {loader? (
        <Spinner size="small" />
      ) : (
      <Card>
        <IndexTable
          resourceName={resourceName}
          itemCount={product.length}
          headings={[
            { title: "Delete / Edit" },
            { title: "Title" },
            { title: "Status" },
            { title: "Vendor" },
          ]}
          selectable={false}
        >
          {rowMarkup}
        </IndexTable>
      </Card>
      )}
      <div>
        {ModalExample()}
        {updatepopmodel()}
      </div>
    </Page>
  );
}

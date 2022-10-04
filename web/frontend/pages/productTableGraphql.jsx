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
import { useAppBridge } from "@shopify/app-bridge-react";
import { useCallback, useEffect, useState } from "react";
import { getSessionToken } from "@shopify/app-bridge-utils";

export function GraphqlDataTableExample() {
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

  const app = useAppBridge();

  const getAllOrders = async () => {
    try {
      const token = await getSessionToken(app);
      const config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      const { data } = await axios.get("/api/graphql/getdata", config);
      setProduct(data.body.data.products.edges);
      SetLoader(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  const createProduct = async () => {
    try {
      const token = await getSessionToken(app);
      const config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      const data = await axios.post(
        "/api/graphql/createdata",
        {
          title: input.title,
          vendor: input.vendor,
          status: input.status,
        },
        config
      );
      if (data.success === true) {
        // SetLoader(false);
        getAllOrders();
      }
      
    } catch (error) {
      console.log("error", error);
    }

    (input.vendor = ""), (input.status = true), (input.title = "");
  };

  const deleteProduct = async (did) => {
    const token = await getSessionToken(app);
    const id = did.split("/").splice(-1);
    const config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    // SetLoader(false)

    const { data } = await axios.get(`/api/graphql/delete/${id}`, config);
    if (data.success === true) {
      // SetLoader(false);
      getAllOrders();
    }
  };

  const editProduct = async (input) => {
    const token = await getSessionToken(app);
    const id = input.id.split("/").splice(-1);
    const config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    const { data } = await axios.post(
      `/api/graphql/update/${id}`,
      input,
      config
    );
    if (data.success === true) {
      // SetLoader(false);
      getAllOrders();
    }
    (input.vendor = ""), (input.status = true), (input.title = "");
  };

  useEffect(async () => {
    await getAllOrders();
  });

  const deleteData = () => {
    (input.status = false), (input.title = ""), (input.vendor = "");
  };

  const updatepopmodel = () => {
    return (
      <div>
        <Modal
          open={active}
          onClose={() => {
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
              onAction: () => {
                deleteData();
                handleChange();
              },
            },
          ]}
        >
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
                    label="ACTIVE"
                    checked={
                      input.status === "active" || input.status === "ACTIVE"
                    }
                    id="ACTIVE"
                    name="accounts"
                    onChange={(value) => {
                      setinput({ ...input, status: value ? "ACTIVE" : "" });
                    }}
                  />
                  <RadioButton
                    label="ARCHIVED"
                    id="ARCHIVED"
                    name="accounts"
                    checked={
                      input.status === "archived" || input.status === "ARCHIVED"
                    }
                    onChange={(value) => {
                      setinput({ ...input, status: value ? "ARCHIVED" : "" });
                    }}
                  />
                  <RadioButton
                    label="DRAFT"
                    id="DRAFT"
                    name="accounts"
                    checked={
                      input.status === "draft" || input.status === "DRAFT"
                    }
                    onChange={(value) => {
                      setinput({ ...input, status: value ? "DRAFT" : "" });
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
          onClose={() => {
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
              onAction: () => {
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
                  label="ACTIVE"
                  checked={
                    input.status === "active" || input.status === "ACTIVE"
                  }
                  id="ACTIVE"
                  name="accounts"
                  onChange={(value) => {
                    setinput({ ...input, status: value ? "ACTIVE" : "" });
                  }}
                />
                <RadioButton
                  label="ARCHIVED"
                  id="ARCHIVED"
                  name="accounts"
                  checked={
                    input.status === "archived" || input.status === "ARCHIVED"
                  }
                  onChange={(value) => {
                    setinput({ ...input, status: value ? "ARCHIVED" : "" });
                  }}
                />
                <RadioButton
                  label="DRAFT"
                  id="DRAFT"
                  name="accounts"
                  checked={input.status === "draft" || input.status === "DRAFT"}
                  onChange={(value) => {
                    setinput({ ...input, status: value ? "DRAFT" : "" });
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

  const rowMarkup = product.map(function (data, i, arr) {
    return (
      <IndexTable.Row id={arr[i].node.id} key={arr[i].node.id} position={i}>
        <IndexTable.Cell>
          <Button
            onClick={() => {
              setinput({
                id: arr[i].node.id,
                title: arr[i].node.title,
                vendor: arr[i].node.vendor,
                status: arr[i].node.status,
              });
              deleteProduct(arr[i].node.id);
            }}
          >
            <TextStyle variation="strong">Delete</TextStyle>
          </Button>{" "}
          <Button
            onClick={() => {
              setActive(true);
              setinput({
                id: arr[i].node.id,
                title: arr[i].node.title,
                vendor: arr[i].node.vendor,
                status: arr[i].node.status,
              });
            }}
          >
            <TextStyle variation="strong">Edit</TextStyle>
          </Button>
        </IndexTable.Cell>
        <IndexTable.Cell>{arr[i].node.title}</IndexTable.Cell>
        <IndexTable.Cell>{arr[i].node.status}</IndexTable.Cell>
        <IndexTable.Cell>{arr[i].node.vendor}</IndexTable.Cell>
      </IndexTable.Row>
    );
  });

  return (
    <Page title="Product list">
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

/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { shallowEqual, useSelector } from "react-redux";
import { isFunction, isEqual } from "lodash";
import * as actions from "../../../_redux/products/productsActions";
import * as supplierActions from "../../../_redux/suppliers/suppliersActions";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar
} from "../../../../../../_metronic/_partials/controls";
import { ProductEditForm } from "./ProductEditForm";
import { Specifications } from "../product-specifications/Specifications";
import { SpecificationsUIProvider } from "../product-specifications/SpecificationsUIContext";
import { useSubheader } from "../../../../../../_metronic/layout";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import { RemarksUIProvider } from "../product-remarks/RemarksUIContext";
import { Remarks } from "../product-remarks/Remarks";
import { initialFilter } from "../ProductsUIHelpers";
import { setSnackbar } from "../../../_redux/snackbar/snackbarActions";
import { SupplierEditForm } from "./SupplierEditForm";

const initProduct = {
  id: undefined,
  product_name: "",
  supplier_id: "",
  description: "",
  date: ""
};

const initSupplier = {
  supplier_name: "",
  address: "",
  phone_no: "",
  date: ""
};

export function ProductEdit({
  history,
  match: {
    params: { id }
  }
}) {
  // Subheader
  const suhbeader = useSubheader();

  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [tab, setTab] = useState("basic");
  const [title, setTitle] = useState("");

  const setQueryParams = useCallback(nextQueryParams => {
    setQueryParamsBase(prevQueryParams => {
      if (isFunction(nextQueryParams)) {
        nextQueryParams = nextQueryParams(prevQueryParams);
      }

      if (isEqual(prevQueryParams, nextQueryParams)) {
        return prevQueryParams;
      }

      return nextQueryParams;
    });
  }, []);

  const dispatch = useDispatch();
  // const layoutDispatch = useContext(LayoutContext.Dispatch);
  const {
    actionsLoading,
    error,
    productForEdit,
    supplierForEdit,
    supplierEntities,
    supplierError
  } = useSelector(
    state => ({
      actionsLoading: state.products.actionsLoading,
      error: state.products.error,
      productForEdit: state.products.productForEdit,
      supplierForEdit: state.suppliers.supplierForEdit,
      supplierEntities: state.suppliers.entities,
      supplierError: state.suppliers.error
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(actions.fetchProduct(id));
    dispatch(supplierActions.fetchSuppliers(queryParams));
  }, [id, dispatch, queryParams]);

  useEffect(() => {
    let _title = id ? "" : "New Product";
    if (productForEdit && id) {
      _title = `Edit product '${productForEdit.product_name}'`;
    }

    setTitle(_title);
    suhbeader.setTitle(_title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productForEdit, id]);

  const saveProduct = values => {
    if (!id) {
      dispatch(actions.createProduct(values)).then(() => {
        backToProductsList();
        dispatch(
          setSnackbar({
            status: !error ? "success" : "error",
            message: (
              <p style={{ fontSize: "16px" }}>Product created successfully!</p>
            ),
            show: true
          })
        );
      });
    } else {
      dispatch(actions.updateProduct(values)).then(() => {
        backToProductsList();
        dispatch(
          setSnackbar({
            status: !error ? "success" : "error",
            message: (
              <p style={{ fontSize: "16px" }}>Product updated successfully!</p>
            ),
            show: true
          })
        );
      });
    }
  };

  const saveSupplier = values => {
    dispatch(supplierActions.createSupplier(values)).then(() => {
      // backToProductsList();
      dispatch(
        setSnackbar({
          status: !supplierError ? "success" : "error",
          message: (
            <p style={{ fontSize: "16px" }}>Supplier added successfully!</p>
          ),
          show: true
        })
      );
    });
  };

  const btnRef = useRef();
  const saveProductClick = () => {
    if (btnRef && btnRef.current) {
      btnRef.current.click();
    }
  };

  const backToProductsList = () => {
    history.push(`/e-commerce/products`);
  };

  return (
    <Card>
      {actionsLoading && <ModalProgressBar />}
      <CardHeader title={title}>
        <CardHeaderToolbar>
          <button
            type="button"
            onClick={backToProductsList}
            className="btn btn-light"
          >
            <i className="fa fa-arrow-left"></i>
            Back
          </button>
          {`  `}
          {/* <button
            type="submit"
            className="btn btn-primary ml-2"
            onClick={saveProductClick}
          >
            Save
          </button> */}
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <ul className="nav nav-tabs nav-tabs-line " role="tablist">
          <li className="nav-item" onClick={() => setTab("basic")}>
            <a
              className={`nav-link ${tab === "basic" && "active"}`}
              data-toggle="tab"
              role="tab"
              aria-selected={(tab === "basic").toString()}
            >
              Basic info
            </a>
          </li>
          {/* {id && ( */}
          <li className="nav-item" onClick={() => setTab("suppliers")}>
            <a
              className={`nav-link ${tab === "suppliers" && "active"}`}
              data-toggle="tab"
              role="button"
              aria-selected={(tab === "suppliers").toString()}
            >
              Add Supplier
            </a>
          </li>
          {/* <li className="nav-item" onClick={() => setTab('specs')}>
                <a
                  className={`nav-link ${tab === 'specs' && 'active'}`}
                  data-toggle="tab"
                  role="tab"
                  aria-selected={(tab === 'specs').toString()}
                >
                  Product specifications
                </a>
              </li>
            </>
          {/* )} */}
        </ul>
        <div className="mt-5">
          {tab === "basic" && (
            <ProductEditForm
              actionsLoading={actionsLoading}
              product={productForEdit || initProduct}
              supplierEntities={supplierEntities}
              btnRef={btnRef}
              saveProduct={saveProduct}
              backToProductsList={backToProductsList}
            />
          )}
          {tab === "suppliers" && (
            <SupplierEditForm
              supplier={supplierForEdit || initSupplier}
              saveSupplier={saveSupplier}
              backToProductsList={backToProductsList}
            />
          )}
          {/* {tab === 'specs' && id && (
            <SpecificationsUIProvider currentProductId={id}>
              <Specifications />
            </SpecificationsUIProvider>
          )} */}
        </div>
      </CardBody>
    </Card>
  );
}

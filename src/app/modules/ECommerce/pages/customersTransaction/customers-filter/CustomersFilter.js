import React, { useMemo, useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { useHistory } from "react-router-dom";
import { useCustomersUIContext } from "../CustomersUIContext";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/products/productsActions";
import * as unitActions from "../../../_redux/units/unitsActions";
import * as stockEntryActions from "../../../_redux/stocksEntry/stocksEntryActions";
import * as saleActions from "../../../_redux/sales/salesActions";
import AlertDialog from "../../../../../../_metronic/_partials/controls/AlertDialog";
import helperFuncs from "../../utils/helper.funcs";
import AlertDialogSlide from "../../../../../../_metronic/_partials/controls/AlertDialog2";
import Slide from "@material-ui/core/Slide";

const prepareFilter = (queryParams, values) => {
  const { status, type, searchText } = values;
  const newQueryParams = { ...queryParams };
  const filter = {};
  // Filter by status
  filter.status = status !== "" ? +status : undefined;
  // Filter by type
  filter.type = type !== "" ? +type : undefined;
  // Filter by all fields
  filter.lastName = searchText;
  if (searchText) {
    filter.firstName = searchText;
    filter.email = searchText;
    filter.ipAddress = searchText;
  }
  newQueryParams.filter = filter;
  return newQueryParams;
};

const CustomerTransactionSchema = Yup.object().shape({
  unit_id: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  product: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  quantity: Yup.number()
    .min(1, "Too Short!")
    .required("Required"),
  amount: Yup.string().required("Required")
});

export function CustomersFilter({ listLoading }) {
  const [selectedProductId, setSelectedProductId] = useState();
  const [selectedUnitId, setSelectedUnitId] = useState();
  const [unitQuantity, setUnitQuantity] = useState(0);
  const [isOutOfStock, setIsOutOfStock] = useState(false);

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  // Customers UI Context
  const customersUIContext = useCustomersUIContext();
  const customersUIProps = useMemo(() => {
    return {
      queryParams: customersUIContext.queryParams,
      setQueryParams: customersUIContext.setQueryParams,
      queryParams: customersUIContext.queryParams,
      initTransaction: customersUIContext.initTransaction,
      productsSelected: customersUIContext.productsSelected,
      setProduct: customersUIContext.setProduct,
      itemForEdit: customersUIContext.itemForEdit,
      setItemForEdit: customersUIContext.setItemForEdit,
      insertSale: customersUIContext.insertSale,
      setInsertSale: customersUIContext.setInsertSale
    };
  }, [customersUIContext]);

  // queryParams, setQueryParams,
  const applyFilter = values => {
    const newQueryParams = prepareFilter(customersUIProps.queryParams, values);
    if (!isEqual(newQueryParams, customersUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      // update list by queryParams
      customersUIProps.setQueryParams(newQueryParams);
    }
  };

  // Getting curret state of products list from store (Redux)
  const {
    currentState,
    unitCurrentState,
    stocksEntryCurrentState
  } = useSelector(
    state => ({
      currentState: state.products,
      unitCurrentState: state.units,
      stocksEntryCurrentState: state.stocksEntry
    }),
    shallowEqual
  );
  const { totalCount } = currentState;
  const _products = currentState.entities;
  let quantityOfUnit;
  if (
    stocksEntryCurrentState &&
    stocksEntryCurrentState.entities &&
    stocksEntryCurrentState.entities.length > 0
  ) {
    let stocksEntryEntities = stocksEntryCurrentState.entities[0];

    if (stocksEntryEntities) {
      quantityOfUnit = stocksEntryEntities.quantity;
      // setUnitQuantity(stocksEntryEntities.quantity);
    }
  }

  // Products Redux state
  const dispatch = useDispatch();

  useEffect(() => {
    // clear selections list
    // productsUIProps.setIds([]);
    // server call by queryParams
    dispatch(actions.fetchProductsForSale(customersUIProps.queryParams));
    dispatch(unitActions.fetchUnitsForProduct(selectedProductId));
    if (selectedUnitId) {
      dispatch(stockEntryActions.fetchQuantityByUnitId(selectedUnitId));
    }

    // customersUIProps.setInsertSale(saveSale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, selectedProductId, selectedUnitId]);

  // server request for saving customer

  const initialValues = {
    product: "", // values => All=""/Susspended=0/Active=1/Pending=2,
    productId: "",
    quantity: "", // values => All=""/Business=0/Individual=1
    amount: "0",
    unit_id: "",
    unit: "",
    totalAmount: ""
  };

  const _oldEntities = _products;
  const selectedEntities = customersUIProps.productsSelected;
  let entitiesIds = _oldEntities ? _oldEntities.map(val => val._id) : [];
  let selectedEntitiesIds = selectedEntities.map(val => val.productId);
  let entities = [];
  let counter = 0;
  for (let item of entitiesIds) {
    let search = selectedEntitiesIds.indexOf(item);

    if (search === -1) {
      entities.push(_oldEntities[counter]);
    }
    counter++;
  }

  const initialValuesForEdit = customersUIProps.itemForEdit;
  return (
    <>
      <Formik
        initialValues={initialValuesForEdit || initialValues}
        enableReinitialize={true}
        validationSchema={CustomerTransactionSchema}
        onSubmit={async (values, { resetForm }) => {
          if (initialValues) {
            values.amount = helperFuncs.transformCurrencyStringToNumber(
              values.amount
            );
            // values.totalAmount = parseInt(values.totalAmount);
            values.quantity = parseInt(values.quantity);

            // stockEntry obj for checking if product is out of stock or not
            let stockEntry = {
              unit_id: values.unit_id,
              quantity: values.quantity
            };

            try {
              // getting response for the API if product is out of stock
              let isOutOfStock = await stockEntryActions.getIsOutOfStocksEntryResponse(
                stockEntry
              );

              if (!isOutOfStock) {
                values.totalAmount = values.amount * values.quantity;
                let productsSelected = [...customersUIProps.productsSelected];
                productsSelected.push(values);

                customersUIProps.setProduct(productsSelected);
                resetForm({ values: "" });
                setSelectedProductId("");
              } else {
                setIsOutOfStock(isOutOfStock);
                resetForm({ values: "" });
                setSelectedProductId("");
                return;
              }
            } catch (e) {
              return e.message;
            }
          }
          values.totalAmount = values.amount * values.quantity;
          let productsForEdit = { ...customersUIProps.itemForEdit };
          productsForEdit = values;
          let _productForEdit = customersUIProps.productsSelected;
          _productForEdit.push(productsForEdit);

          customersUIProps.setProduct(_productForEdit);
          resetForm({ values: "" });
        }}
      >
        {({
          values,
          handleSubmit,
          handleBlur,
          handleChange,
          setFieldValue,
          errors,
          touched
        }) => (
          <form onSubmit={handleSubmit} className="form form-label-right">
            <div className="form-group row">
              <div className="col-lg-2">
                <select
                  className="form-control"
                  placeholder="Product"
                  name="product"
                  onBlur={handleBlur}
                  onChange={e => {
                    let productId = e.target.value;
                    if (productId == "select") return false;
                    let product = {};
                    entities.forEach(item => {
                      if (item._id === productId) {
                        product = item;
                      }
                    });
                    setFieldValue("product", product.product_name);
                    setFieldValue("productId", product._id);
                    setSelectedProductId(product._id);
                  }}
                  value={values.productId}
                >
                  <option value="select">Select product</option>
                  {entities &&
                    entities.map((product, index) => (
                      <option key={product._id} value={product._id}>
                        {product.product_name}
                      </option>
                    ))}
                </select>
                <small className="form-text text-muted">
                  <b>Product</b>
                </small>
                {errors.product && touched.product ? (
                  <div style={{ color: "red" }}>{errors.product}</div>
                ) : null}
              </div>
              <div className="col-lg-2">
                <select
                  className="form-control"
                  placeholder="Unit"
                  name="unit_id"
                  onBlur={handleBlur}
                  onChange={e => {
                    let _selectedUnitId = e.target.value;
                    if (_selectedUnitId === "select") return false;
                    let selectedUnit = {};
                    unitCurrentState.entities.forEach(unit => {
                      if (unit._id === _selectedUnitId) {
                        selectedUnit = unit;
                      }
                    });

                    setFieldValue("unit_id", selectedUnit._id);
                    setFieldValue("unit", selectedUnit.name);
                    setFieldValue("amount", selectedUnit.price);
                    setSelectedUnitId(selectedUnit._id);
                  }}
                  value={values.unit_id}
                >
                  <option value="select">Select Unit</option>
                  {unitCurrentState.entities &&
                    unitCurrentState.entities.map(unit => (
                      <option value={unit._id} key={unit._id}>
                        {unit.name}
                      </option>
                    ))}
                </select>
                <small className="form-text text-muted">
                  <b>Unit</b>
                </small>
                {errors.unit_id && touched.unit_id ? (
                  <div style={{ color: "red" }}>{errors.unit_id}</div>
                ) : null}
              </div>
              <div className="col-lg-2">
                <input
                  type="text"
                  className="form-control"
                  name="amount"
                  placeholder="Amount"
                  onBlur={handleBlur}
                  disabled={true}
                  value={values.amount}
                  onChange={e => {
                    setFieldValue("amount", e.target.value);
                  }}
                />
                <small className="form-text text-muted">
                  <b>Amount</b>
                </small>
                {errors.amount && touched.amount ? (
                  <div style={{ color: "red" }}>{errors.amount}</div>
                ) : null}
              </div>
              <div className="col-lg-2">
                <input
                  type="text"
                  className="form-control"
                  name="quantity"
                  placeholder="Quantity"
                  // onBlur={handleBlur}
                  value={values.quantity}
                  onChange={e => {
                    setFieldValue("quantity", e.target.value);
                    setUnitQuantity(quantityOfUnit);
                  }}
                />
                <small className="form-text text-muted">
                  <b>Quantity</b>
                </small>
                {errors.quantity && touched.quantity ? (
                  <div style={{ color: "red" }}>{errors.quantity}</div>
                ) : null}
              </div>
              <div className="col-lg-2">
                <button
                  type="submit"
                  style={{ display: "block" }}
                  className="btn btn-primary"
                >
                  Add
                </button>
              </div>
            </div>
          </form>
        )}
      </Formik>

      <AlertDialogSlide
        open={isOutOfStock}
        title={`You're out of stock!!!`}
        text={`Oops! Sorry, you've exceeded the total number of quantities in stock. You only have ${unitQuantity} left. Would you love to convert now?`}
        btnText1={`Convert Now`}
        btnText2={`Cancel`}
        handleClose={() => setIsOutOfStock(false)}
        Transition={Transition}
      />
    </>
  );
}

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
  const [selectedProductId, setSelectedProductId] = useState("");
  // Customers UI Context
  const customersUIContext = useCustomersUIContext();
  const customersUIProps = useMemo(() => {
    return {
      queryParams: customersUIContext.queryParams,
      setQueryParams: customersUIContext.setQueryParams,
      queryParams: customersUIContext.queryParams,
      initTransaction: customersUIContext.initTransaction,
      productsSelected: customersUIContext.productsSelected,
      setProductsSelected: customersUIContext.setProductsSelected,
      itemForEdit: customersUIContext.itemForEdit,
      setItemForEdit: customersUIContext.setItemForEdit,
      unitsSelected: customersUIContext.unitsSelected,
      setUnitsSelected: customersUIContext.setUnitsSelected,
      insertSale: customersUIContext.insertSale,
      setInsertSale: customersUIContext.setInsertSale
    };
  }, [customersUIContext]);

  const { productsForSaleEntities, unitCurrentState } = useSelector(
    state => ({
      productsForSaleEntities: state.products.entities,
      unitCurrentState: state.units
    }),
    shallowEqual
  );

  const _units = unitCurrentState.entities;

  const history = useHistory();

  // Products Redux state
  const dispatch = useDispatch();

  useEffect(() => {
    // clear selections list
    // productsUIProps.setIds([]);
    // server call by queryParams
    dispatch(actions.fetchProductsForSale(customersUIProps.queryParams));
    dispatch(unitActions.fetchUnits(customersUIProps.queryParams));
  }, [dispatch, customersUIProps.unitsSelected, customersUIProps.queryParams]);

  const handleOnSubmit = async (values, resetForm) => {
    let _values = { ...values };
    if (initialValues) {
      // Converting both the amount and quantity to number
      _values.amount = helperFuncs.transformCurrencyStringToNumber(
        _values.amount
      );
      _values.quantity = parseInt(_values.quantity);

      // Creating the object schema to be passed as a parameter for checking if product is out of stock
      const outOfStockParams = {
        unit_id: _values.unit_id,
        quantity: _values.quantity
      };

      try {
        // Getting response from an API for determining if the selected product is out of stock
        let isOutOfStock = await stockEntryActions.getIsOutOfStocksEntryResponse(
          outOfStockParams
        );

        if (!isOutOfStock) {
          console.log("__values", _values);
          console.log("initialValues", initialValues);
          resetForm({ values: "" });
        } else {
          // alert('The selected product is out of stock.');
          console.log("The selected product is out of stock.");
        }
      } catch (e) {
        console.log("Error: ", e);
      }
    }
  };

  let unitsForProduct = [];

  const _oldUnits = _units;
  const selectedUnitEntities = customersUIProps.unitsSelected;
  let unitEntitiesId = _oldUnits ? _oldUnits.map(val => val._id) : [];
  let selectedUnitEntitiesIds = selectedUnitEntities.map(val => val.unit_id);
  let unitEntities = [];
  let unitCounter = 0;

  for (let item of unitEntitiesId) {
    let search = selectedUnitEntitiesIds.indexOf(item);

    if (search === -1) {
      unitEntities.push(_oldUnits[unitCounter]);
    }
    unitCounter++;
  }

  if (selectedProductId) {
    unitEntities.map(unit => {
      if (unit.product_id === selectedProductId) {
        unitsForProduct.push(unit);
      }
      return unit;
    });
  }

  const initialValues = {
    product: "", // values => All=""/Susspended=0/Active=1/Pending=2,
    productId: "",
    quantity: "", // values => All=""/Business=0/Individual=1
    amount: "0",
    unit_id: "",
    unit: "",
    totalAmount: ""
  };

  const initialValuesForEdit = customersUIProps.itemForEdit;
  return (
    <>
      <Formik
        initialValues={initialValuesForEdit || initialValues}
        enableReinitialize={true}
        validationSchema={CustomerTransactionSchema}
        onSubmit={(values, { resetForm }) => handleOnSubmit(values, resetForm)}
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
                    if (productId === "select") return false;

                    let product = {};
                    productsForSaleEntities.forEach(item => {
                      if (item._id === productId) {
                        product = item;
                      }
                    });

                    setFieldValue("productId", product._id);
                    setFieldValue("product", product.product_name);
                    setSelectedProductId(e.target.value);
                  }}
                  value={values.productId}
                >
                  <option value="select">Select product</option>
                  {productsForSaleEntities &&
                    productsForSaleEntities.length > 0 &&
                    productsForSaleEntities.map(product => (
                      <option key={product._id} value={product._id}>
                        {product.product_name}
                      </option>
                    ))}
                </select>
                {errors.product && touched.product ? (
                  <div style={{ color: "red" }}>{errors.product}</div>
                ) : (
                  <small className="form-text text-muted">
                    <b>Product</b>
                  </small>
                )}
              </div>
              <div className="col-lg-2">
                <select
                  className="form-control"
                  placeholder="Unit"
                  name="unit_id"
                  onBlur={handleBlur}
                  onChange={e => {
                    let unitId = e.target.value;
                    if (unitId === "select") return false;

                    let unit = {};
                    unitsForProduct.forEach(item => {
                      if (item._id === unitId) {
                        unit = item;
                      }
                    });

                    setFieldValue("unit_id", unit._id);
                    setFieldValue("unit", unit.name);
                    setFieldValue("amount", unit.price);
                  }}
                  value={values.unit_id}
                >
                  <option value="select">Select Unit</option>
                  {unitsForProduct &&
                    unitsForProduct.length > 0 &&
                    unitsForProduct.map(unit => (
                      <option key={unit._id} value={unit._id}>
                        {unit.name}
                      </option>
                    ))}
                </select>
                {errors.unit_id && touched.unit_id ? (
                  <div style={{ color: "red" }}>{errors.unit_id}</div>
                ) : (
                  <small className="form-text text-muted">
                    <b>Unit</b>
                  </small>
                )}
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
                {errors.amount && touched.amount ? (
                  <div style={{ color: "red" }}>{errors.amount}</div>
                ) : (
                  <small className="form-text text-muted">
                    <b>Amount</b>
                  </small>
                )}
              </div>
              <div className="col-lg-2">
                <input
                  type="text"
                  className="form-control"
                  name="quantity"
                  placeholder="Quantity"
                  onBlur={handleBlur}
                  value={values.quantity}
                  onChange={async e => {
                    setFieldValue("quantity", e.target.value);
                  }}
                />
                {errors.quantity && touched.quantity ? (
                  <div style={{ color: "red" }}>{errors.quantity}</div>
                ) : (
                  <small className="form-text text-muted">
                    <b>Quantity</b>
                  </small>
                )}
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

      {/* <AlertDialogSlide
        open={isOutOfStock}
        title={`You're out of stock!!!`}
        text={`Oops! Sorry, you've exceeded the total number of quantities in stock. You only have ${unitQuantity} left. Would you love to convert now?`}
        btnText1={`Convert Now`}
        btnText2={`Cancel`}
        handleConfirm={() => {
          history.push(
            `/e-commerce/customers-transaction/${selectedProductId}/unit-conversion`
          );
          setIsOutOfStock(false);
        }}
        handleClose={() => setIsOutOfStock(false)}
        // Transition={Transition}
      /> */}
    </>
  );
}

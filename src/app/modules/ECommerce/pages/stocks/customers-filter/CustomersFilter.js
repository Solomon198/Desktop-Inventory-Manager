import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { startOfDay, endOfDay } from "date-fns";
import { Formik } from "formik";
import { isEqual } from "lodash";
import * as Yup from "yup";
import * as actions from "../../../_redux/stocks/stocksActions";
import { useCustomersUIContext } from "../CustomersUIContext";

const FilterProductsSchema = Yup.object().shape({
  start_date: Yup.date().required("Start Date is required."),
  end_date: Yup.date().required("End Date is required.")
});

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

export function CustomersFilter({ listLoading }) {
  // Component States
  const [firstDate, setFirstDate] = useState("");
  const [disableEndDate, setDisableEndDate] = useState(true);
  // Customers UI Context
  const customersUIContext = useCustomersUIContext();
  const customersUIProps = useMemo(() => {
    return {
      queryParams: customersUIContext.queryParams,
      setQueryParams: customersUIContext.setQueryParams
    };
  }, [customersUIContext]);

  const dispatch = useDispatch();

  // queryParams, setQueryParams,
  const applyFilter = values => {
    const newQueryParams = prepareFilter(customersUIProps.queryParams, values);
    if (!isEqual(newQueryParams, customersUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      // update list by queryParams
      customersUIProps.setQueryParams(newQueryParams);
    }
  };

  const applyProductsFilter = values => {
    const newValues = { ...values };
    newValues.start_date = new Date(newValues.start_date);
    newValues.end_date = new Date(newValues.end_date);
    const _newStartDate = startOfDay(newValues.start_date);
    const _newEndDate = endOfDay(newValues.end_date);

    const _newValues = {
      start_date: _newStartDate,
      end_date: _newEndDate,
      pageNumber: newValues.pageNumber,
      pageSize: newValues.pageSize
    };
    dispatch(actions.fetchFilteredProducts(values));
  };

  const productsFilter = {
    start_date: "",
    end_date: "",
    pageNumber: 1,
    pageSize: 10
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-5">
          <Formik
            initialValues={{
              status: "", // values => All=""/Susspended=0/Active=1/Pending=2
              type: "", // values => All=""/Business=0/Individual=1
              searchText: ""
            }}
            onSubmit={values => {
              applyFilter(values);
            }}
          >
            {({
              values,
              handleSubmit,
              handleBlur,
              handleChange,
              setFieldValue
            }) => (
              <form onSubmit={handleSubmit} className="form form-label-right">
                <div className="form-group row">
                  <div className="col-lg-6">
                    <input
                      type="text"
                      className="form-control"
                      name="searchText"
                      placeholder="Search"
                      onBlur={handleBlur}
                      value={values.searchText}
                      onChange={e => {
                        setFieldValue("searchText", e.target.value);
                        handleSubmit();
                      }}
                    />
                    <small className="form-text text-muted">
                      <b>Search</b>
                    </small>
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </div>
        <div className="col-lg-7">
          <Formik
            initialValues={productsFilter}
            validationSchema={FilterProductsSchema}
            onSubmit={values => {
              applyProductsFilter(values);
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
                  <div className="col-lg-4">
                    <input
                      type="date"
                      className="form-control"
                      name="start_date"
                      placeholder="Start date"
                      onBlur={handleBlur}
                      value={values.start_date}
                      onChange={e => {
                        setFieldValue("start_date", e.target.value);
                        setFirstDate(e.target.value);
                        setDisableEndDate(false);
                      }}
                      // onChange={handleChange}
                    />

                    {errors.start_date && touched.start_date ? (
                      <div className="text-danger">{errors.start_date}</div>
                    ) : (
                      <small className="form-text text-muted">
                        <b>Start Date</b>
                      </small>
                    )}
                  </div>
                  <div className="col-lg-4">
                    <input
                      type="date"
                      className="form-control"
                      name="end_date"
                      disabled={disableEndDate}
                      placeholder="End date"
                      onBlur={handleBlur}
                      value={values.end_date}
                      // onChange={(e) => {
                      //   setFieldValue('end_date', e.target.value);
                      // }}
                      onChange={handleChange}
                      min={firstDate}
                    />

                    {errors.end_date && touched.end_date ? (
                      <div className="text-danger">{errors.end_date}</div>
                    ) : (
                      <small className="form-text text-muted">
                        <b>End Date</b>
                      </small>
                    )}
                  </div>
                  <div className="col-lg-4">
                    <input
                      type="submit"
                      onClick={() => handleSubmit}
                      value="Filter"
                      className="btn btn-primary"
                    />
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}

import React, { useMemo } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useCustomersUIContext } from "../CustomersUIContext";

const prepareFilter = (queryParams, values) => {
  const { status, type, searchText } = values;
  const newQueryParams = { ...queryParams };
  const filter = {};
  // Filter by status
  filter.status = status !== "" ? +status : undefined;
  // Filter by type
  filter.type = type !== "" ? +type : undefined;
  // Filter by all fields
  filter.role_name = searchText;
  if (searchText) {
    filter.role_name = searchText;
  }
  newQueryParams.filter = filter;
  return newQueryParams;
};

export function CustomersFilter({ listLoading }) {
  // Roles UI Context
  const rolesUIContext = useCustomersUIContext();
  const rolesUIProps = useMemo(() => {
    return {
      queryParams: rolesUIContext.queryParams,
      setQueryParams: rolesUIContext.setQueryParams
    };
  }, [rolesUIContext]);

  // queryParams, setQueryParams,
  const applyFilter = values => {
    const newQueryParams = prepareFilter(rolesUIProps.queryParams, values);
    if (!isEqual(newQueryParams, rolesUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      // update list by queryParams
      rolesUIProps.setQueryParams(newQueryParams);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
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
              <div className="col-lg-5">
                <input
                  type="text"
                  className="form-control"
                  name="searchText"
                  placeholder="Search for Roles"
                  onBlur={handleBlur}
                  value={values.searchText}
                  onChange={e => {
                    setFieldValue("searchText", e.target.value);
                    handleSubmit();
                  }}
                />
                <small className="form-text text-muted">
                  <b>Search</b> for roles
                </small>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
}

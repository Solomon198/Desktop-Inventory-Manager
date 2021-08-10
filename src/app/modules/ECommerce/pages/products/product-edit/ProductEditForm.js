// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Input, Select } from '../../../../../../_metronic/_partials/controls';
import {
  AVAILABLE_COLORS,
  AVAILABLE_MANUFACTURES,
  ProductStatusTitles,
  ProductConditionTitles,
} from '../ProductsUIHelpers';

// Validation schema
const ProductEditSchema = Yup.object().shape({
  product_name: Yup.string()
    .min(2, 'Minimum 2 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Model is required'),
  description: Yup.string(),
  // manufacturer: Yup.string()
  //   .min(2, "Minimum 2 symbols")
  //   .max(50, "Maximum 50 symbols")
  //   .required("Manufacture is required"),
});

export function ProductEditForm({ product, btnRef, saveProduct }) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={product}
        validationSchema={ProductEditSchema}
        onSubmit={(values) => {
          saveProduct(values);
        }}
      >
        {({ handleSubmit }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-6">
                  <Field
                    name="product_name"
                    component={Input}
                    placeholder="Product Name"
                    label="Product Name"
                  />
                </div>
                <div className="col-lg-6">
                  <Select name="manufacturer" label="Manufacturer">
                    {AVAILABLE_MANUFACTURES.map((manufacturer) => (
                      <option key={manufacturer} value={manufacturer}>
                        {manufacturer}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="form-group row"></div>
              <div className="form-group">
                <label>Description</label>
                <Field
                  name="description"
                  as="textarea"
                  className="form-control"
                />
              </div>
              <button
                type="submit"
                style={{ display: 'none' }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

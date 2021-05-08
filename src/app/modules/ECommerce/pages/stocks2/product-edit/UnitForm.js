// // Form is based on Formik
// // Data validation is based on Yup
// // Please, be familiar with article first:
// // https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
// import React from 'react';
// import { Modal } from 'react-bootstrap';
// import { Formik, Form, Field } from 'formik';
// import * as Yup from 'yup';
// import { Input, Select } from '../../../../../../_metronic/_partials/controls';
// // import {
// //   AVAILABLE_COLORS,
// //   AVAILABLE_MANUFACTURES,
// //   ProductStatusTitles,
// //   ProductConditionTitles,
// // } from '../ProductsUIHelpers';

// // Validation schema
// const UnitSchema = Yup.object().shape({
//   product_id: Yup.string()
//     .min(2, 'Minimum 2 symbols')
//     .max(50, 'Maximum 50 symbols')
//     .required('Product is required'),
//   name: Yup.string()
//     .min(2, 'Minimum 2 symbols')
//     .max(50, 'Maximum 50 symbols')
//     .required('unit name is required'),
//   price: Yup.number()
//     .min(1, '$1 is minimum')
//     .max(1000000, '$1000000 is maximum')
//     .required('Price is required'),
// });

// export function UnitForm({ product, btnRef, saveProduct }) {
//   return (
//     <>
//       <Formik
//         enableReinitialize={true}
//         initialValues={product}
//         validationSchema={UnitSchema}
//         onSubmit={(values) => {
//           saveProduct(values);
//         }}
//       >
//         {({ handleSubmit }) => (
//           <>
//             <Modal.Body className="overlay overlay-block cursor-default">
//               <Form className="form form-label-right">
//                 <div className="form-group row">
//                   <div className="col-lg-12">
//                     <div class="form-group">
//                       <Select name="product_id" label="Product">
//                         <option value="1">product 1</option>
//                       </Select>
//                     </div>
//                   </div>
//                   <div className="col-lg-12">
//                     <div class="form-group">
//                       <Field
//                         type="text"
//                         name="namer"
//                         component={Input}
//                         placeholder="Unit name"
//                         label="Unit Name"
//                       />
//                     </div>
//                   </div>
//                   <div className="col-lg-12">
//                     <div class="form-group">
//                       <Field
//                         type="number"
//                         name="price"
//                         component={Input}
//                         placeholder="Price"
//                         label="Price ($)"
//                         customFeedbackLabel="Please enter Price"
//                       />
//                     </div>
//                   </div>
//                   <div className="col-lg-12">
//                     <div class="form-group">
//                       <button
//                         type="submit"
//                         style={{ display: 'block' }}
//                         className="btn btn-primary"
//                         // disabled={disabled}
//                       >
//                         Finish sale
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </Form>
//             </Modal.Body>
//           </>
//         )}
//       </Formik>
//     </>
//   );
// }

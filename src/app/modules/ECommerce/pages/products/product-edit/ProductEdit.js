/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { shallowEqual, useSelector } from 'react-redux';
import { isFunction, isEqual } from 'lodash';
import * as actions from '../../../_redux/products/productsActions';
import * as supplierActions from '../../../_redux/suppliers/suppliersActions';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from '../../../../../../_metronic/_partials/controls';
import { ProductEditForm } from './ProductEditForm';
import { Specifications } from '../product-specifications/Specifications';
import { SpecificationsUIProvider } from '../product-specifications/SpecificationsUIContext';
import { useSubheader } from '../../../../../../_metronic/layout';
import { ModalProgressBar } from '../../../../../../_metronic/_partials/controls';
import { RemarksUIProvider } from '../product-remarks/RemarksUIContext';
import { Remarks } from '../product-remarks/Remarks';
import { initialFilter } from '../ProductsUIHelpers';

const initProduct = {
  id: undefined,
  product_name: '',
  supplier_id: '',
  description: '',
};

export function ProductEdit({
  history,
  match: {
    params: { id },
  },
}) {
  // Subheader
  const suhbeader = useSubheader();

  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [tab, setTab] = useState('basic');
  const [title, setTitle] = useState('');

  const setQueryParams = useCallback((nextQueryParams) => {
    setQueryParamsBase((prevQueryParams) => {
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
  const { actionsLoading, productForEdit, supplierEntities } = useSelector(
    (state) => ({
      actionsLoading: state.products.actionsLoading,
      productForEdit: state.products.productForEdit,
      supplierEntities: state.suppliers.entities,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(actions.fetchProduct(id));
    dispatch(supplierActions.fetchSuppliers(queryParams));
  }, [id, dispatch]);

  useEffect(() => {
    let _title = id ? '' : 'New Product';
    if (productForEdit && id) {
      _title = `Edit product '${productForEdit.product_name}'`;
    }

    setTitle(_title);
    suhbeader.setTitle(_title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productForEdit, id]);

  const saveProduct = (values) => {
    if (!id) {
      dispatch(actions.createProduct(values)).then(() => backToProductsList());
    } else {
      console.log(values);
      dispatch(actions.updateProduct(values)).then(() => backToProductsList());
    }
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
          <button className="btn btn-light ml-2">
            <i className="fa fa-redo"></i>
            Reset
          </button>
          {`  `}
          <button
            type="submit"
            className="btn btn-primary ml-2"
            onClick={saveProductClick}
          >
            Save
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <ul className="nav nav-tabs nav-tabs-line " role="tablist">
          <li className="nav-item" onClick={() => setTab('basic')}>
            <a
              className={`nav-link ${tab === 'basic' && 'active'}`}
              data-toggle="tab"
              role="tab"
              aria-selected={(tab === 'basic').toString()}
            >
              Basic info
            </a>
          </li>
          {id && (
            <>
              {' '}
              {/* <li className="nav-item" onClick={() => setTab('remarks')}>
                <a
                  className={`nav-link ${tab === 'remarks' && 'active'}`}
                  data-toggle="tab"
                  role="button"
                  aria-selected={(tab === 'remarks').toString()}
                >
                  Product remarks
                </a>
              </li> */}
              {/* <li className="nav-item" onClick={() => setTab('specs')}>
                <a
                  className={`nav-link ${tab === 'specs' && 'active'}`}
                  data-toggle="tab"
                  role="tab"
                  aria-selected={(tab === 'specs').toString()}
                >
                  Product specifications
                </a>
              </li> */}
            </>
          )}
        </ul>
        <div className="mt-5">
          {tab === 'basic' && (
            <ProductEditForm
              actionsLoading={actionsLoading}
              product={productForEdit || initProduct}
              supplierEntities={supplierEntities}
              btnRef={btnRef}
              saveProduct={saveProduct}
            />
          )}
          {/* {tab === 'remarks' && id && (
            <RemarksUIProvider currentProductId={id}>
              <Remarks />
            </RemarksUIProvider>
          )} */}
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

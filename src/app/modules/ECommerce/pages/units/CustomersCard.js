import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from '../../../../../_metronic/_partials/controls';
import * as actions from '../../_redux/products/productsActions';
import * as unitActions from '../../_redux/units/unitsActions';
import { CustomersTable } from './customers-table/CustomersTable';
import { ProductsList } from './products-list/ProductsList';
import { useCustomersUIContext } from './CustomersUIContext';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(6),
    backgroundColor: '#f8f8f8',
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
    marginTop: 0,
    marginBottom: 10,
    marginRight: 'auto',
    marginLeft: 'auto',
  },
}));

export function CustomersCard() {
  const classes = useStyles();
  const [productId, setProductId] = useState('');

  const customersUIContext = useCustomersUIContext();

  const { productEntities, unitCurrentState } = useSelector((state) => ({
    productEntities: state.products.entities,
    unitCurrentState: state.units,
  }));

  const { entities, totalCount, listLoading } = unitCurrentState;

  const customersUIProps = useMemo(() => {
    return {
      ids: customersUIContext.ids,
      queryParams: customersUIContext.queryParams,
      newCustomerButtonClick: customersUIContext.newCustomerButtonClick,
    };
  }, [customersUIContext]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchProducts(customersUIProps.queryParams));
    dispatch(unitActions.fetchUnitsForProduct(productId));
  }, [customersUIProps.queryParams, dispatch, productId]);

  const handleSelect = (productId) => {
    setProductId(productId);
  };

  return (
    <Card>
      <CardHeader title="Units Manager">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={customersUIProps.newCustomerButtonClick}
          >
            New Unit
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <div className="row">
          <div className="col-md-6">
            <ProductsList
              entities={productEntities === null ? [] : productEntities}
              handleSelect={handleSelect}
            />
          </div>
          <div className="col-md-6">
            {entities && entities.length > 0 ? (
              <div style={{ boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px' }}>
                <CustomersTable
                  entities={entities}
                  totalCount={totalCount}
                  listLoading={listLoading}
                />
              </div>
            ) : (
              <div className="text-center">
                <Avatar className={classes.root}>
                  <HourglassEmptyIcon
                    style={{ color: 'orangered', fontSize: 42 }}
                  />
                </Avatar>
                <h3 className="text-bold">No Units For Product Yet!!!</h3>
                <p className="text-muted">
                  Units that are related to a selected product will be displayed
                  here.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

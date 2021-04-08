import React, { useEffect, useState, useMemo } from 'react';
import { Modal } from 'react-bootstrap';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { ProductStatusCssClasses } from '../ProductsUIHelpers';
import * as actions from '../../../_redux/sales/salesActions';
import { useSalesUIContext } from '../ProductsUIContext';

const selectedSales = (entities, ids) => {
  const _sales = [];
  ids.forEach((id) => {
    const sale = entities.find((el) => el.id === id);
    if (sale) {
      _sales.push(sale);
    }
  });
  return _sales;
};

export function ProductsUpdateStatusDialog({ show, onHide }) {
  // Products UI Context
  const salesUIContext = useSalesUIContext();
  const salesUIProps = useMemo(() => {
    return {
      ids: salesUIContext.ids,
      setIds: salesUIContext.setIds,
      queryParams: salesUIContext.queryParams,
    };
  }, [salesUIContext]);

  // Products Redux state
  const { products, isLoading } = useSelector(
    (state) => ({
      products: selectedSales(state.sales.entities, salesUIProps.ids),
      isLoading: state.sales.actionsLoading,
    }),
    shallowEqual
  );

  // if there weren't selected sales we should close modal
  useEffect(() => {
    if (salesUIProps.ids || salesUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesUIProps.ids]);

  const [status, setStatus] = useState(0);

  const dispatch = useDispatch();
  // const updateStatus = () => {
  //   // server request for updateing sale by ids
  //   dispatch(actions.updateProductsStatus(salesUIProps.ids, status)).then(
  //     () => {
  //       // refresh list after deletion
  //       dispatch(actions.fetchProducts(salesUIProps.queryParams)).then(
  //         () => {
  //           // clear selections list
  //           salesUIProps.setIds([]);
  //           // closing delete modal
  //           onHide();
  //         }
  //       );
  //     }
  //   );
  // };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Status has been updated for selected sales
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="overlay overlay-block cursor-default">
        {isLoading && (
          <div className="overlay-layer bg-transparent">
            <div className="spinner spinner-lg spinner-warning" />
          </div>
        )}
        <div className="list-timeline list-timeline-skin-light padding-30">
          <div className="list-timeline-items">
            {/* {sales.map((sale) => (
              <div className="list-timeline-item mb-3" key={sale.id}>
                <span className="list-timeline-text">
                  <span
                    className={`label label-lg label-light-${
                      ProductStatusCssClasses[sale.status]
                    } label-inline`}
                    style={{ width: '60px' }}
                  >
                    ID: {sale.id}
                  </span>{' '}
                  <span className="ml-5">
                    {sale.manufacture}, {sale.model}
                  </span>
                </span>
              </div>
            ))} */}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="form">
        <div className="form-group">
          <select
            className={`form-control ${ProductStatusCssClasses[status]}`}
            value={status}
            onChange={(e) => setStatus(+e.target.value)}
          >
            <option value="0">Selling</option>
            <option value="1">Sold</option>
          </select>
        </div>
        <div className="form-group">
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light btn-elevate"
          >
            Cancel
          </button>
          <> </>
          {/* <button
            type="button"
            onClick={updateStatus}
            className="btn btn-primary btn-elevate"
          >
            Update Status
          </button> */}
        </div>
      </Modal.Footer>
    </Modal>
  );
}

import React, { useEffect, useMemo } from 'react';
import { Modal } from 'react-bootstrap';
import { shallowEqual, useSelector } from 'react-redux';
import { ProductStatusCssClasses } from '../ProductsUIHelpers';
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

export function ProductsFetchDialog({ show, onHide }) {
  // Products UI Context
  const salesUIContext = useSalesUIContext();
  const salesUIProps = useMemo(() => {
    return {
      ids: salesUIContext.ids,
      queryParams: salesUIContext.queryParams,
    };
  }, [salesUIContext]);

  // Products Redux state
  const { sales } = useSelector(
    (state) => ({
      sales: selectedSales(state.sales.entities, salesUIProps.ids),
    }),
    shallowEqual
  );

  // if there weren't selected ids we should close modal
  useEffect(() => {
    if (!salesUIProps.ids || salesUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesUIProps.ids]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Fetch selected elements
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="list-timeline list-timeline-skin-light padding-30">
          <div className="list-timeline-items">
            {sales.map((sale) => (
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
            ))}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light btn-elevate"
          >
            Cancel
          </button>
          <> </>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-primary btn-elevate"
          >
            Ok
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

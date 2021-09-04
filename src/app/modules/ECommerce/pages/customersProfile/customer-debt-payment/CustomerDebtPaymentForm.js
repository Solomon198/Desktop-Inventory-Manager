import React from 'react';
import helperFuncs from '../../utils/helper.funcs';

const CustomerDebtPaymentForm = ({
  name,
  val,
  onChange,
  onButtonClick,
  onCancelClick,
}) => (
  <>
    <div>
      <div className="form-group">
        <label>Enter Amount</label>
        <input
          className="form-control"
          type="text"
          name={name}
          value={helperFuncs
            .transformCurrencyStringToNumber(val)
            .toLocaleString()}
          onChange={onChange}
        />
      </div>
      <div className="form-group">
        <button
          style={{ backgroundColor: '#1d4082', color: '#fff' }}
          className="btn btn-sm mr-3"
          onClick={onButtonClick}
        >
          Pay Now
        </button>
        <button className="btn btn-sm btn-default" onClick={onCancelClick}>
          Cancel
        </button>
      </div>
    </div>
  </>
);

export default CustomerDebtPaymentForm;

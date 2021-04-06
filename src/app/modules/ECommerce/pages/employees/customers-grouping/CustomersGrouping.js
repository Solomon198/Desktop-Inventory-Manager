import React, { useMemo } from "react";
import { useEmployeesUIContext } from "../CustomersUIContext";

export function EmployeesGrouping() {
  // Employees UI Context
  const employeesUIContext = useEmployeesUIContext();
  const employeesUIProps = useMemo(() => {
    return {
      ids: employeesUIContext.ids,
      setIds: employeesUIContext.setIds,
      openDeleteEmployeesDialog: employeesUIContext.openDeleteEmployeesDialog,
      openFetchEmployeesDialog: employeesUIContext.openFetchEmployeesDialog,
      openUpdateEmployeesStatusDialog:
        employeesUIContext.openUpdateEmployeesStatusDialog
    };
  }, [employeesUIContext]);

  return (
    <div className="form">
      <div className="row align-items-center form-group-actions margin-top-20 margin-bottom-20">
        <div className="col-xl-12">
          <div className="form-group form-group-inline">
            <div className="form-label form-label-no-wrap">
              <label className="font-bold font-danger">
                <span>
                  Selected records count: <b>{employeesUIProps.ids.length}</b>
                </span>
              </label>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-danger font-weight-bolder font-size-sm"
                onClick={employeesUIProps.openDeleteEmployeesDialog}
              >
                <i className="fa fa-trash"></i> Delete All
              </button>
              &nbsp;
              {/* <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={employeesUIProps.openFetchEmployeesDialog}
              >
                <i className="fa fa-stream"></i> Fetch Selected
              </button>
              &nbsp;
              <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={employeesUIProps.openUpdateEmployeesStatusDialog}
              >
                <i className="fa fa-sync-alt"></i> Update Status
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

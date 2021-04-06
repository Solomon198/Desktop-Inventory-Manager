import React from "react";
import { Route } from "react-router-dom";
import { EmployeesLoadingDialog } from "./customers-loading-dialog/CustomersLoadingDialog";
import { EmployeeEditDialog } from "./customer-edit-dialog/CustomerEditDialog";
import { EmployeeDeleteDialog } from "./customer-delete-dialog/CustomerDeleteDialog";
import { EmployeesDeleteDialog } from "./customers-delete-dialog/CustomersDeleteDialog";
import { EmployeesFetchDialog } from "./customers-fetch-dialog/CustomersFetchDialog";
import { EmployeesUpdateStateDialog } from "./customers-update-status-dialog/CustomersUpdateStateDialog";
import { EmployeesUIProvider } from "./CustomersUIContext";
import { EmployeesCard } from "./CustomersCard";

export function EmployeesPage({ history }) {
  const employeesUIEvents = {
    newEmployeeButtonClick: () => {
      history.push("/e-commerce/employees/new");
    },
    openEditEmployeeDialog: id => {
      history.push(`/e-commerce/employees/${id}/edit`);
    },
    openDeleteEmployeeDialog: id => {
      history.push(`/e-commerce/employees/${id}/delete`);
    },
    openDeleteEmployeesDialog: () => {
      history.push(`/e-commerce/employees/deleteEmployees`);
    },
    openFetchEmployeeDialog: () => {
      history.push(`/e-commerce/employees/fetch`);
    },
    openUpdateEmployeeStatusDialog: () => {
      history.push("/e-commerce/employees/updateStatus");
    }
  };

  return (
    <EmployeesUIProvider employeesUIEvents={employeesUIEvents}>
      <EmployeesLoadingDialog />
      <Route path="/e-commerce/employees/new">
        {({ history, match }) => (
          <EmployeeEditDialog
            show={match != null}
            onHide={() => {
              history.push("/e-commerce/employees");
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/employees/:id/edit">
        {({ history, match }) => (
          <EmployeeEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/e-commerce/employees");
            }}
          />
        )}
      </Route>

      <Route path="/e-commerce/employees/deleteEmployees">
        {({ history, match }) => (
          <EmployeesDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/e-commerce/employees");
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/employees/:id/delete">
        {({ history, match }) => (
          <EmployeeDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/e-commerce/employees");
            }}
          />
        )}
      </Route>

      <Route path="/e-commerce/employees/fetch">
        {({ history, match }) => (
          <EmployeesFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/e-commerce/employees");
            }}
          />
        )}
      </Route>

      <Route path="/e-commerce/employees/updateStatus">
        {({ history, match }) => (
          <EmployeesUpdateStateDialog
            show={match != null}
            onHide={() => {
              history.push("/e-commerce/employees");
            }}
          />
        )}
      </Route>
      <EmployeesCard />
    </EmployeesUIProvider>
  );
}

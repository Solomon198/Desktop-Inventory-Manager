export const CustomerStatusCssClasses = ["success", "warning", "danger", ""];
export const CustomerStatusTitles = [
  "Select status",
  "Paid",
  "Outstanding",
  "Debt"
];
export const CustomerTransactionType = [
  "Select transaction type",
  "Cash",
  "Credit",
  "Transfer"
];
export const CustomerTypeCssClasses = ["success", "primary", ""];
export const CustomerTypeTitles = ["Business", "Individual", ""];
export const CustomerTypeUnits = ["Select unit", "Pieces", "Dozen"];
export const defaultSorted = [{ dataField: "id", order: "asc" }];
export const sizePerPageList = [
  { text: "3", value: 3 },
  { text: "5", value: 5 },
  { text: "10", value: 10 }
];
export const initialFilter = {
  filter: {
    lastName: "",
    firstName: "",
    email: "",
    ipAddress: ""
  },
  sortOrder: "asc", // asc||desc
  sortField: "id",
  pageNumber: 1,
  pageSize: 10
};

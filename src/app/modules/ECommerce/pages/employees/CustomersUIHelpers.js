export const CustomerStatusCssClasses = ['danger', 'success', 'info', ''];
export const CustomerStatusTitles = ['Suspended', 'Active', 'Pending', ''];
export const CustomerTypeCssClasses = ['success', 'primary', ''];
export const CustomerTypeTitles = ['Super Admin', 'Accountant', ''];
export const defaultSorted = [{ dataField: 'id', order: 'asc' }];
export const sizePerPageList = [
  { text: '3', value: 3 },
  { text: '5', value: 5 },
  { text: '10', value: 10 },
];
export const initialFilter = {
  filter: {
    lastName: '',
    firstName: '',
    gender: '',
  },
  sortOrder: 'asc', // asc||desc
  sortField: 'id',
  pageNumber: 1,
  pageSize: 10,
};

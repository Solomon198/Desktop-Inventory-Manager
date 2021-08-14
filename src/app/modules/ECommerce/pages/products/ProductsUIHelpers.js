export const ProductStatusCssClasses = ['success', 'info', ''];
export const ProductStatusTitles = ['Selling', 'Sold'];
export const ProductConditionCssClasses = ['success', 'danger', ''];
export const ProductConditionTitles = ['New', 'Used'];
export const defaultSorted = [{ dataField: 'product_name', order: 'asc' }];
export const sizePerPageList = [
  { text: '3', value: 3 },
  { text: '5', value: 5 },
  { text: '10', value: 10 },
];
export const initialFilter = {
  filter: {
    product_name: '',
  },
  sortOrder: 'asc', // asc||desc
  sortField: 'product_name',
  pageNumber: 1,
  pageSize: 10,
};

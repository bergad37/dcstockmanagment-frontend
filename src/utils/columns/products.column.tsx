export const customerColumns = () => [
  {
    name: 'Names',
    selector: (row: any) => row?.name
  },
  {
    name: 'Serial Number',
    selector: (row: any) => row?.email
  },
  { name: 'Category', selector: (row: any) => row?.phone },
  { name: 'Supplier', selector: (row: any) => row?.address },

  {
    name: 'Type',
    selector: (row: any) => row?.role ?? 'user'
  },
  //  if available it should be available in stock if not it should not be in stok
  {
    name: 'Status',
    selector: (row: any) => row?.status ?? 'available'
  }
];

export const customerColumns = () => [
  {
    name: 'Names',
    selector: (row: any) => row?.name
  },
  {
    name: 'Email',
    selector: (row: any) => row?.email
  },
  { name: 'phone', selector: (row: any) => row?.phone },
  { name: 'address', selector: (row: any) => row?.address },

  {
    name: 'Role',
    selector: (row: any) => row?.role ?? 'user'
  }
];

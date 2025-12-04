export const userColumns = () => [
  {
    name: 'Names',
    selector: (row: any) => row?.name
  },
  {
    name: 'Email',
    selector: (row: any) => row?.email
  },
  {
    name: 'Role',
    selector: (row: any) => row?.role ?? 'user'
  }
];

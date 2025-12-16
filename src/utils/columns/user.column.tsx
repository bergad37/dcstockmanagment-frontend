import { ActionButtons } from '../../components/ui/ActionButtons';

export const userColumns = (actions: any) => [
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
  },
  {
    name: 'Actions',
    type: 'actions',
    cell: (row: any) => (
      <ActionButtons row={row} key={row?.id} actions={actions} />
    )
  }
];

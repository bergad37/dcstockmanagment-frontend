import { ActionButtons } from '../../components/ui/ActionButtons';

export const userColumns = (actions: any, user: any) =>
  [
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
    user?.role === 'ADMIN' && {
      name: 'Actions',
      type: 'actions',
      cell: (row: any) => (
        <ActionButtons row={row} key={row?.id} actions={actions} />
      )
    }
  ].filter(Boolean);

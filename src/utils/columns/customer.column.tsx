import { ActionButtons } from '../../components/ui/ActionButtons';

export const customerColumns = (actions: any, user: any) =>
  [
    {
      name: 'Names',
      selector: (row: any) => row?.name
    },
    {
      name: 'Email',
      selector: (row: any) => row?.email ?? '-'
    },
    { name: 'Phone Number', selector: (row: any) => row?.phone ?? '-' },
    { name: 'address', selector: (row: any) => row?.address ?? '-' },
    user?.role === 'ADMIN' && {
      name: 'Actions',
      type: 'actions',
      cell: (row: any) => (
        <ActionButtons row={row} key={row?.id} actions={actions} />
      )
    }
  ].filter(Boolean);

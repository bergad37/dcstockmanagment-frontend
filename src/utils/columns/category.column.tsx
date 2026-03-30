import { ActionButtons } from '../../components/ui/ActionButtons';

export const productCategoriesColumns = (actions: any, user: any) =>
  [
    {
      name: 'Name',
      selector: (row: any) => row?.name
    },
    {
      name: 'Actions',
      type: 'actions',
      width: '100px',
      cell: (row: any) =>
        user?.role === 'ADMIN' && (
          <ActionButtons row={row} key={row?.id} actions={actions} />
        )
    }
  ].filter(Boolean);

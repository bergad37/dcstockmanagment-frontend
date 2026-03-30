
import { ActionButtons } from "../../components/ui/ActionButtons";

export const productCategoriesColumns = (actions: any, user: any) =>
  [
    {
      name: 'Name',
      selector: (row: any) => row?.name
    },
    user?.role === 'ADMIN' && {
      name: 'Actions',
      type: 'actions',
      width: '100px',
      cell: (row: any) => (
        <ActionButtons row={row} key={row?.id} actions={actions} />
      )
    }
  ].filter(Boolean);

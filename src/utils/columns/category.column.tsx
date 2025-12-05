import { ActionButtons } from "../../components/ui/ActionButtons";

export const productCategoriesColumns = (actions:any) => [
  {
    name: 'Name',
    selector: (row: any) => row?.name
  },
  {
    name: 'Actions',
    type: 'actions',
    cell: (row: any) => [
      <ActionButtons row={row} key={row?.id} actions={actions} />
    ]
  },
];

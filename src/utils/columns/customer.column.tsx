/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionButtons } from '../../components/ui/ActionButtons';

export const customerColumns = (actions: any) => [
  {
    name: 'Names',
    selector: (row: any) => row?.names
  },
  {
    name: 'Email',
    selector: (row: any) => row?.email
  },
  { name: 'Phone Number', selector: (row: any) => row?.phoneNumber },
  { name: 'address', selector: (row: any) => row?.address },
  {
    name: 'Actions',
    type: 'actions',
    cell: (row: any) => [
      <ActionButtons row={row} key={row?.id} actions={actions} />
    ]
  }
];

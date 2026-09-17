/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from 'react';
import { selectionStyles } from '../utils/ui.helper.styles';

/**
 * Row selection for a DataTable: checkboxes plus a highlight strong enough to
 * read in a screenshot. Spread `selectionProps` onto the table.
 */
export const useRowSelection = () => {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  // DataTable clears when this value *changes*, not when it is true
  const [clearToggle, setClearToggle] = useState(false);

  // must be stable: DataTable re-fires this on every render otherwise
  const onSelectedRowsChange = useCallback(
    ({ selectedRows: rows }: { selectedRows: any[] }) => {
      setSelectedRows(rows);
    },
    []
  );

  const clearSelection = useCallback(() => {
    setClearToggle((t) => !t);
    setSelectedRows([]);
  }, []);

  return {
    selectedRows,
    clearSelection,
    selectionProps: {
      selectableRows: true,
      selectableRowsHighlight: true,
      onSelectedRowsChange,
      clearSelectedRows: clearToggle,
      customStyles: selectionStyles
    }
  };
};

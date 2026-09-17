export const customStyles = {
  headCells: {
    style: {
      backgroundColor: '#073c56',
      color: '#fff',
      fontSize: '0.95rem',
      fontWeight: 'bold',
      paddingLeft: '16px'
    }
  },
  cells: {
    style: {
      paddingLeft: '16px',
      paddingRight: '16px'
    }
  },
  rows: {
    style: {
      minHeight: '56px',
      '&:hover': {
        backgroundColor: '#f0f5f8'
      }
    }
  }
};

// selected rows need to stand out clearly in screenshots, so override the
// subtle default highlight with a tinted row plus a left accent bar
export const selectionStyles = {
  ...customStyles,
  rows: {
    ...customStyles.rows,
    selectedHighlightStyle: {
      backgroundColor: '#e6f0f6',
      borderLeft: '4px solid #073c56',
      '&:hover': {
        backgroundColor: '#dbe9f2'
      }
    }
  }
};

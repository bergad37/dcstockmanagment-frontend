export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const formatStockTransactions = (transactions: any[] = []) => {
  return transactions.map((transaction) => {
    const item = transaction?.items?.[0]; // first item only

    return {
      id: transaction?.id ?? '',
      productId: item?.product?.id ?? '',
      productName: item?.product?.name ?? '',
      type: transaction?.type ?? '',
      clientName: transaction?.customer?.name ?? '',
      clientEmail: transaction?.customer?.email ?? '',
      quantity: item?.quantity ?? 0,
      transactionDate: transaction?.startDate ?? null,
      createdAt: transaction?.createdAt ?? null,
      updatedAt: transaction?.updatedAt ?? null
    };
  });
};

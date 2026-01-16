export const isAuthenticated = () => {
  const token = getToken();
  return !!token && !isTokenExpired(token);
};

export const getToken = () => localStorage.getItem('token');

/**
 * Safely parse a JWT token's payload.
 */
export const parseJwt = (token?: string) => {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1];
    // atob is available in browsers
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

export const isTokenExpired = (token?: string) => {
  const t = token ?? getToken();
  if (!t) return true;
  const payload: any = parseJwt(t);
  if (!payload) return true;
  // JWT exp is in seconds since epoch
  if (!payload.exp) return true;
  return Date.now() / 1000 > payload.exp;
};

export const formatStockTransactions = (transactions: any[] = []) => {
  return transactions.flatMap((transaction) => {
    const items = transaction?.items ?? [];

    return items.map((item: any) => ({
      id: transaction?.id ?? '',
      productId: item?.product?.id ?? '',
      productName: item?.product?.name ?? '',
      type: transaction?.type ?? '',
      clientName: transaction?.customer?.name ?? '',
      clientEmail: transaction?.customer?.email ?? '',
      quantity: item?.quantity ?? 0,
      transactionDate: transaction?.startDate ?? null,
      createdAt: transaction?.createdAt ?? null,
      updatedAt: transaction?.updatedAt ?? null,
      returnDate: transaction?.returnDate ?? '',
      expectedReturnDate: transaction?.expectedReturnDate ?? '',
      returnCondition: transaction?.returnCondition ?? '',
      totalAmount: transaction?.totalAmount ?? '',
      totalCost: transaction?.totalCost ?? '',
      profitLoss: transaction?.profitLoss ?? '',
      customer: transaction?.customer ?? {},
      product: item?.product ?? {},
      transaction: transaction
    }));
  });
};


export const getOverdueDays = (row: any): number => {
  if (!row.expectedReturnDate) return 0;

  const expected = new Date(row.expectedReturnDate);
  const actual = row.returnDate
    ? new Date(row.returnDate)
    : new Date(); // today

  // Normalize time to avoid partial-day issues
  expected.setHours(0, 0, 0, 0);
  actual.setHours(0, 0, 0, 0);

  const diffTime = actual.getTime() - expected.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
};

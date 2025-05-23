export const getUserRole = (token) => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || payload.roles?.[0] || null;
  } catch {
    return null;
  }
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
  }).format(price);
};
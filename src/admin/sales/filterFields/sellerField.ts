export const sellerField = (field: string, value: any) => {
  if (field === 'seller_name') {
    return {
      name: value,
    };
  } else if (field === 'seller_email') {
    return {
      email: value,
    };
  } else if (field === 'seller_doccument') {
    return {
      doccument: value,
    };
  }

  return undefined;
};

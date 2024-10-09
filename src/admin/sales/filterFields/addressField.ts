export const addressField = (field: string, value: any) => {
  if (field === 'address_city') {
    return {
      address_city: value,
    };
  } else if (field === 'address_state') {
    return {
      address_state: value,
    };
  }

  return undefined;
};

export const clientField = (field: string, value: any) => {
  if (field === 'client_name') {
    return {
      name: value,
    };
  } else if (field === 'client_email') {
    return {
      email: value,
    };
  } else if (field === 'client_doccument') {
    return {
      doccument: value,
    };
  }

  return undefined;
};

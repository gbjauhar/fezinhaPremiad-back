export const titlesQuantityField = (field: string, value: any) => {
  if (field === 'titles_quantity') {
    return {
      count: value,
    };
  }

  return undefined;
};

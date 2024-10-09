export const editionNameField = (field: string, value: any) => {
  if (field === 'edition_name') {
    return {
      edition: {
        name: value,
      },
    };
  }

  return undefined;
};

import { z } from 'zod';

const fieldSchema = z.enum([
  'seller_name',
  'doccument',
  'cel',
  'value',
  'created_at',
  'status',
]);

export type Field = z.infer<typeof fieldSchema>;

export function userField(field: Field, value: string) {
  if (field === 'seller_name') {
    return {
      user: {
        name: value,
      },
    };
  } else if (field === 'doccument' || field === 'cel') {
    return {
      user: {
        [field]: value,
      },
    };
  }

  return undefined;
}

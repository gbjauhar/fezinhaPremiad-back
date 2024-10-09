import {
  CreditHistory as DBCreditHistory,
  HistoryType,
  Status,
} from '@prisma/client';

export class CreditHistory implements DBCreditHistory {
  date_format: string;
  type: HistoryType;
  deleted: boolean;
  user_id: string;
  id: string;
  name: string;
  description: string;
  value: number;
  status: Status;
  deposit_type: 'PIX';
  created_at: Date;
  updated_at: Date;
}

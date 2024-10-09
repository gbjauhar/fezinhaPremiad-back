import {
  ValueHistory as DBValueHistory,
  HistoryType,
  Status,
} from '@prisma/client';

export class ValueHistory implements DBValueHistory {
  reference: string;
  date_format: string;
  type: HistoryType;
  deleted: boolean;
  user_id: string;
  id: string;
  name: string;
  description: string;
  value: number;
  deposit_type: string;
  status: Status;
  created_at: Date;
  updated_at: Date;
}

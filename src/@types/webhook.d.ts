interface BraipWebhook {
  client_name: string | null;
  client_email: string | null;
  client_cel: string | null;
  client_documment: string | null;
}

interface KiwifyWebhook {
  Customer: {
    full_name: string | null;
    email: string;
    mobile: string | null;
    CPF: string;
  };
}

interface PerfectPayWebhook {
  customer: {
    full_name: string;
    email: string;
    identification_number: string;
    phone_number: string;
  };
}

interface EvermartWebhook {
  name: string | null;
  email: string;
  mobile: string | null;
  doc: string;
  phone_local_code: string;
  phone_number: string;
}

interface ZLinpayWebhook {
  invoice_id: string;
  invoice_status: string;
  invoice_status_id: number;
  invoice_amount: string;
  invoice_amount_cents: string;
  invoice_description: string;
  invoice_due_date: string;
  invoice_payment_method: string;
  invoice_payment_method_name: string;
  invoice_code: string;
  user_name: string;
  user_phone: string;
  user_email: string;
}

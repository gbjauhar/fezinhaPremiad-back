export class PagstarAuthResponse {
  message: string;
  data: {
    access_token: string;
    expires_in: string;
    refresh_token: string;
    admin_type: number;
  };
}

export class PagstarCreatePixDto {
  message: string;
  data: {
    qr_code_url: string;
    favoured: string;
    external_reference: string;
    checkout: string;
    pix_key: string;
  };
}

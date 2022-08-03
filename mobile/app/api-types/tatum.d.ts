export interface TatumConnection {
  accountAddress: string;
  tatumId: string;
}

export interface CreateTatumConnectionRequest {
  accountAddress: string;
  tatumId: string;
}

export interface CreateTatumConnectionResponse {
  created: boolean;
}

export interface GetTatumConnectionRequest {
  accountAddress: string;
}

export interface GetTatumConnectionResponse {
  tatumId: string;
}

import { Personnel } from './Personnel';

export interface AccountDto {
  id : string;
  username: string;
  password: string;
  role: string;
  status: boolean;
  personnel: Personnel;
}

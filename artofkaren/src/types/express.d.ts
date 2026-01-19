import { UserRole } from './index';

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      role: UserRole;
      username?: string;
      full_name?: string;
      google_id?: string;
      provider?: string;
    }
  }
}

export {};

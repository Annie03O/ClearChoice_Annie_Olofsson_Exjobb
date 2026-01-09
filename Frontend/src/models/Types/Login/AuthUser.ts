export type AuthUser = {
  id: string;
  email: string;
  name: string;
  // Lägg till fler fält här om din backend skickar t.ex. role, createdAt etc.
  [key: string]: any;
} | null;

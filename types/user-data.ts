export interface UserData {
  name: string;
  age: number;
  email: string;
  settings: {
    theme: string;
    notifications: boolean;
  };
}
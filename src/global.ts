export interface UserAttributes {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  mobile: number;
  isActive: boolean;
}

export namespace Global {
  export var users: UserAttributes[] = [];
}

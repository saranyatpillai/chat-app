import { Injectable } from '@angular/core';

@Injectable()
export class AuthenticationService {

  userList = [
    { userName: 'saranya', password: 'saranya123' },
    { userName: 'mahesh', password: 'mahesh123' },
    { userName: 'aruna', password: 'aruna123' }
  ];

  constructor() { }

  login(username: string, password: string): boolean {
    const IS_VALID_USER =
      this.userList.find((user) => user.userName === username && user.password === password);
    return IS_VALID_USER ? true : false;
  }
}

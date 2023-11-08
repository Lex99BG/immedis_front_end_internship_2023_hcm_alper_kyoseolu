//Create
export class AddUsers {
  static readonly type = '[Users] Add';
  constructor(public payload: any) {}
}

//Update Users
export class UpdateUsers {
  static readonly type = '[Users] Update';
  constructor(public payload: any, public i: number) {}
}

//Update Profile
export class UpdateUserProfile {
  static readonly type = '[Users] Update Profile ';
  constructor(public payload: any, public i: number) {}
}

//Delete
export class DeleteUsers {
  static readonly type = '[Users] Delete';
  constructor(public index: number) {}
}

//Login
export class Login {
  static readonly type = '[Auth] Login';
  constructor(public userName: string, public password: string) {}
}

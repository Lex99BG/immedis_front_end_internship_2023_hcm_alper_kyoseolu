import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { UsersInterface } from 'src/app/model/users.model';
import {
  AddUsers,
  DeleteUsers,
  Login,
  UpdateUserProfile,
  UpdateUsers,
} from './admin.actions';

export interface UsersStateModel {
  users: UsersInterface[];
  deleteUser: any;
  updateUser: any;
  addUsers: any;
  loggedAs: UsersInterface;
}

@State<UsersStateModel>({
  name: 'users',
  defaults: {
    users: [
      {
        userName: 'Bob',
        password: 'Qweasd123',
        name: 'Bob Brown',
        email: 'bob-brown@mail.com',
        userType: 'Admin',
        profilePic: '../assets/user-one.png',
        tel: '+3598950669931',
        jobTitle: 'Front-end Developer',
        status: 'Senior',
        salary: 3902,
      },
      {
        userName: 'John',
        password: 'Qweasd123',
        name: 'John Doe',
        email: 'john-doe@mail.com',
        userType: 'Admin',
        profilePic: '../assets/user-two.png',
        tel: '+3598950669932',
        jobTitle: 'Front-end Developer',
        status: 'Senior',
        salary: 3902,
      },
      {
        userName: 'Jane',
        password: 'Qweasd123',
        name: 'Jane Smith',
        email: 'jane-smith@mail.com',
        userType: 'Admin',
        profilePic: '../assets/user-three.png',
        tel: '+3598950669933',
        jobTitle: 'Front-end Developer',
        status: 'Senior',
        salary: 3902,
      },
      {
        userName: 'Kevin',
        password: 'Qweasd123',
        name: 'Kevin Clark',
        email: 'kevin-clark@mail.com',
        userType: 'User',
        profilePic: '../assets/user-four.png',
        tel: '+3598950669934',
        jobTitle: 'Front-end Developer',
        status: 'Senior',
        salary: 3902,
      },
      {
        userName: 'Michael',
        password: 'Qweasd123',
        name: 'Michael Lee',
        email: 'michael-lee@mail.com',
        userType: 'User',
        profilePic: '../assets/user-five.png',
        tel: '+3598950669935',
        jobTitle: 'Front-end Developer',
        status: 'Senior',
        salary: 3902,
      },
      {
        userName: 'David',
        password: 'Qweasd123',
        name: 'David Miller',
        email: 'david-miller@mail.com',
        userType: 'User',
        profilePic: '../assets/user-six.png',
        tel: '+3598950669936',
        jobTitle: 'Back-end Developer',
        status: 'Junior',
        salary: 3902,
      },
    ],
    deleteUser: DeleteUsers,
    updateUser: UpdateUsers,
    addUsers: AddUsers,
    loggedAs: JSON.parse(localStorage.getItem('session') || '{}'),
  },
})
@Injectable()
export class UsersState {
  @Selector()
  static getUsers(state: UsersStateModel) {
    return state.users;
  }
  @Selector()
  static GetUserByIndex(state: UsersStateModel) {
    return (index: number) => {
      return state.users[index];
    };
  }
  @Selector()
  static getLoggedUser(state: UsersStateModel) {
    return state.loggedAs;
  }
  @Action(DeleteUsers)
  deleteDataFromState(
    ctx: StateContext<UsersStateModel>,
    { index }: DeleteUsers
  ) {
    const state = ctx.getState();
    let users = state.users;
    users.splice(index, 1);
    const loggedUser = state.loggedAs;
    if (loggedUser.userType === 'Admin') {
      ctx.setState({
        ...state,
        users,
      });
    }
  }

  @Action(AddUsers)
  addDataToState(ctx: StateContext<UsersStateModel>, { payload }: AddUsers) {
    const state = ctx.getState();
    const loggedUser = state.loggedAs;

    const userNameCheck = state.users.find(
      (u) => u.userName === payload.userName
    );
    const emailCheck = state.users.find((u) => u.email === payload.email);
    const telCheck = state.users.find((u) => u.tel === payload.tel);

    if (!userNameCheck && !emailCheck && !telCheck) {
      if (loggedUser.userType === 'Admin') {
        ctx.patchState({
          users: [...state.users, payload],
        });
      } else {
        alert('You do not have permission to add this user.');
      }
    } else {
      let errorMessage = '';
      if (userNameCheck) {
        errorMessage = 'Username is already used. ';
      }
      if (emailCheck) {
        errorMessage += 'Email is already used. ';
      }
      if (telCheck) {
        errorMessage += 'Telephone is already used. ';
      }

      alert('Error: ' + errorMessage);
    }
  }

  @Action(UpdateUsers)
  editUser(ctx: StateContext<UsersStateModel>, { payload, i }: UpdateUsers) {
    const state = ctx.getState();
    const userList = [...state.users];
    userList[i] = payload;

    const loggedUser = state.loggedAs;

    const userNameCheck = state.users.find(
      (u) => u.userName === payload.userName
    );
    const emailCheck = state.users.find((u) => u.email === payload.email);
    const telCheck = state.users.find((u) => u.tel === payload.tel);

    if (!userNameCheck || !emailCheck || !telCheck) {
      if (loggedUser.userType === 'Admin') {
        ctx.patchState({
          users: userList,
        });
      } else {
        alert('You do not have permission to edit this user.');
      }
    } else {
      let errorMessage = '';
      if (userNameCheck) {
        errorMessage = 'Username is already used. ';
      }
      if (emailCheck) {
        errorMessage += 'Email is already used. ';
      }
      if (telCheck) {
        errorMessage += 'Telephone is already used. ';
      }

      alert('Error: ' + errorMessage);
    }
  }

  @Action(UpdateUserProfile)
  UpdateProfile(
    ctx: StateContext<UsersStateModel>,
    { payload, i }: UpdateUserProfile
  ) {
    const state = ctx.getState();
    const userList = [...state.users];
    userList[i] = payload;
    ctx.patchState({
      users: userList,
    });
    localStorage.setItem('session', JSON.stringify(payload));
  }

  @Action(Login)
  login(ctx: StateContext<UsersStateModel>, { userName, password }: Login) {
    const state = ctx.getState();

    const user = state.users.find(
      (u) => u.userName === userName && u.password === password
    );

    if (user) {
      ctx.patchState({
        ...state,
        loggedAs: user,
      });
      localStorage.setItem('session', JSON.stringify(user));
    }
  }
}

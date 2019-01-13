import {Injectable} from '@angular/core';
import {User} from "../models/user.model";

@Injectable()
export class AuthService {
    private isAuthenticated = false;

    constructor() {
    }

    login(user: User) {
        this.isAuthenticated = true;
        window.localStorage.setItem('user', JSON.stringify(user));
    }

    logout() {
        this.isAuthenticated = false;
        window.localStorage.clear();
    }

    isLoggedIn(): boolean {
        return this.isAuthenticated;
    }

}

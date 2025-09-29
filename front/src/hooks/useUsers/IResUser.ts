export interface IResLogin {
    message: string;
    token:   string;
    user:    User;
}

export interface User {
    _id:   string;
    name:  string;
    email: string;
}



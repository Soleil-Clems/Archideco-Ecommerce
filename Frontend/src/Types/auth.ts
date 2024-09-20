
export interface LoginRequestBody {
    email: string;
    password: string;
}


export interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}


export interface RegisterRequestBody {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}


export interface RegisterResponse {
    message: string;
}

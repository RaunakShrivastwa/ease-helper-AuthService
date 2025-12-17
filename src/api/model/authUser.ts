class AuthUser{
    id: string;
    email: string;
    role: string;
    password: string;

    constructor(id: string, email: string, role: string, password: string){
        this.id = id;
        this.email = email;
        this.role = role;
        this.password = password;
    }
}
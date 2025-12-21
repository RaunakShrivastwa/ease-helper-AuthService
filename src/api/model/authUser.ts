enum ROLE {
  ADMIN = 'ADMIN',
  PROVIDER = 'PROVIDER',
  USER = 'USER'
}

class AuthUser {
    id: string;
    email: string;
    role: ROLE;
    password: string;
    location:string

    constructor(email: string, role: ROLE, password: string,location:string) {
        this.email = email;
        this.role = role;  // Corrected: now it's using the passed parameter
        this.password = password;
        this.location = location;
    }
}

export default AuthUser;
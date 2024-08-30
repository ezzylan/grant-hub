declare module "#auth-utils" {
  interface User {
    id: number;
    name: string;
    email: string;
    imageUrl: string | null | undefined;
  }

  interface UserSession {
    loggedInAt: Date;
  }
}

export {};

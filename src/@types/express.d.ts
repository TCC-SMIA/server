// Hack para inserir o USER ID vindo no token dentro das informações de Request

declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
  }
}

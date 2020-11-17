export default interface ICreateUserDTO {
  name: string;
  nickname?: string;
  cnpj?: string;
  email: string;
  password: string;
  type: string;
}

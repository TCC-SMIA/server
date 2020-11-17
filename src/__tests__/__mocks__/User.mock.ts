import { UserTypes } from '@domains/users/enums/UserEnums';

const reporterMock = {
  name: 'John Doe',
  email: 'doe@doe.com',
  nickname: 'johnzins',
  password: '123123',
  type: UserTypes.Reporter,
};

const environmentalAgencyMock = {
  name: 'valid_agency_name',
  email: 'valid_agency_mail@mail.com',
  cnpj: '58.017.080/0001-78',
  password: 'valid_password',
  type: UserTypes.EnvironmentalAgency,
};

export { reporterMock, environmentalAgencyMock };

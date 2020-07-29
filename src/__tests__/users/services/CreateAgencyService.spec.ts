import CreateAgencyService from '@domains/users/services/CreateAgencyService';
import IHashProvider from '@domains/users/providers/HashProvider/rules/IHashProvider';
import IAgencyRepository from '@domains/users/rules/IAgencyRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../fakes/FakeHashProvider';
import FakeAgencyRepository from '../fakes/FakeAgencyRepository';

let fakeAgencyRepository: IAgencyRepository;
let createAgencyService: CreateAgencyService;
let fakeHashProvider: IHashProvider;

describe('CreateAgencyService', () => {
  beforeEach(() => {
    fakeAgencyRepository = new FakeAgencyRepository();
    fakeHashProvider = new FakeHashProvider();
    createAgencyService = new CreateAgencyService(
      fakeAgencyRepository,
      fakeHashProvider,
    );
  });

  it('should be able to create a new Agency', async () => {
    const agency = await createAgencyService.execute({
      name: 'valid_agency_name',
      email: 'valid_agency_mail@mail.com',
      cnpj: '58.017.080/0001-78',
      password: 'valid_password',
    });

    expect(agency.name).toBe('valid_agency_name');
    expect(agency.cnpj).toBe('58.017.080/0001-78');
    expect(agency.email).toBe('valid_agency_mail@mail.com');
  });

  it('should not able to create a new agency with the same email', async () => {
    await createAgencyService.execute({
      name: 'valid_agency_name',
      email: 'same_email@mail.com',
      cnpj: '58.017.080/0001-78',
      password: 'valid_password',
    });

    await expect(
      createAgencyService.execute({
        name: 'valid_agency_name',
        email: 'same_email@mail.com',
        cnpj: '58.017.080/0001-78',
        password: 'valid_password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not able to create a new agency with the an existing cnpj', async () => {
    await createAgencyService.execute({
      name: 'valid_agency_name',
      email: 'same_email@mail.com',
      cnpj: '58.017.080/0001-78',
      password: 'valid_password',
    });

    await expect(
      createAgencyService.execute({
        name: 'valid_second_agency_name',
        email: 'same_email2@mail.com',
        cnpj: '58.017.080/0001-78',
        password: 'valid_password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

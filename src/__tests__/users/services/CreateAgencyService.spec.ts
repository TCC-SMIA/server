import CreateAgencyService from '@domains/users/services/CreateAgencyService';
import IHashProvider from '@domains/users/providers/HashProvider/rules/IHashProvider';
import IAgencyRepository from '@domains/users/rules/IAgencyRepository';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import FakeHashProvider from '../fakes/FakeHashProvider';
import FakeAgencyRepository from '../fakes/FakeAgencyRepository';
import FakeUsersRepository from '../fakes/FakeUsersRepository';

let fakeUsersRepository: IUsersRepository;
let fakeAgencyRepository: IAgencyRepository;
let createAgencyService: CreateAgencyService;
let fakeHashProvider: IHashProvider;

describe('CreateAgencyService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeAgencyRepository = new FakeAgencyRepository();
    fakeHashProvider = new FakeHashProvider();
    createAgencyService = new CreateAgencyService(
      fakeAgencyRepository,
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to create a new Agency', async () => {
    const createMock = jest.spyOn(fakeAgencyRepository, 'create');

    const agency = await createAgencyService.execute({
      name: 'valid_agency_name',
      email: 'valid_agency_mail@mail.com',
      cnpj: '58.017.080/0001-78',
      password: 'valid_password',
    });

    expect(agency).toBeTruthy();
    expect(agency.id).toBeTruthy();
    expect(agency.name).toBe('valid_agency_name');
    expect(agency.cnpj).toBe('58.017.080/0001-78');
    expect(agency.email).toBe('valid_agency_mail@mail.com');
    expect(createMock).toHaveBeenCalledWith({
      name: 'valid_agency_name',
      email: 'valid_agency_mail@mail.com',
      cnpj: '58.017.080/0001-78',
      password: 'valid_password',
    });
  });

  it('should not able to create a new agency with the same email', async () => {
    await createAgencyService.execute({
      name: 'valid_agency_name',
      email: 'same_email@mail.com',
      cnpj: '62728791000128',
      password: 'valid_password',
    });

    await expect(
      createAgencyService.execute({
        name: 'valid_second_agency_name',
        email: 'same_email@mail.com',
        cnpj: '58.017.080/0001-78',
        password: 'valid_password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not able to create a new agency with an existing cnpj', async () => {
    await createAgencyService.execute({
      name: 'valid_agency_name',
      email: 'valid_second_email@mail.com',
      cnpj: '62728791000128',
      password: 'valid_password',
    });

    await expect(
      createAgencyService.execute({
        name: 'valid_second_agency_name',
        email: 'valid_email@mail.com',
        cnpj: '62728791000128',
        password: 'valid_password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

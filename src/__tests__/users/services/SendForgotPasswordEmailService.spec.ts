import AppError from '@shared/errors/AppError';
import SendForgotPasswordEmailService from '@domains/users/services/SendForgotPasswordEmailService';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import IMailProvider from '@shared/providers/MailProvider/rules/IMailProvider';
import IUserTokensRepository from '@domains/users/rules/IUserTokensRepository';
import FakeUsersRepository from '../fakes/FakeUsersRepository';
import FakeMailProvider from '../../fakeProviders/FakeMailProvider/FakeMailProvider';
import FakeUserTokensRepository from '../fakes/FakeUserTokensRepository';

let fakeUsersRepository: IUsersRepository;
let fakeMailProvider: IMailProvider;
let fakeUserTokensRepository: IUserTokensRepository;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmailService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    fakeUserTokensRepository = new FakeUserTokensRepository();

    fakeMailProvider = new FakeMailProvider();

    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });
  it('should be able to recover the password using the email', async () => {
    const sendMailFunction = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
    });

    await sendForgotPasswordEmailService.execute({
      email: 'doe@doe.com',
    });

    expect(sendMailFunction).toHaveBeenCalled();
  });
  it('should not be able to recover the password of an non-existing email', async () => {
    await expect(
      sendForgotPasswordEmailService.execute({
        email: 'nonexisting@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generateTokenFunction = jest.spyOn(
      fakeUserTokensRepository,
      'generate',
    );

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
    });

    await sendForgotPasswordEmailService.execute({
      email: 'doe@doe.com',
    });

    expect(generateTokenFunction).toHaveBeenCalledWith(user.id);
  });
});

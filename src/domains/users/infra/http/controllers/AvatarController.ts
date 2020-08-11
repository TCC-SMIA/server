import { Response, Request } from 'express';

import UpdateUserAvatarService from '@domains/users/services/UpdateUserAvatarService';
import { container } from 'tsyringe';

class AvatarController {
  async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const { filename } = request.file;

    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    await updateUserAvatar.execute({
      user_id,
      avatarFilename: filename,
    });

    return response.json({ success: true });
  }
}

export default new AvatarController();

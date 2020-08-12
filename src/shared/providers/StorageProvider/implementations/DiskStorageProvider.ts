import path from 'path';
import fs from 'promise-fs';

import multerConfig from '@config/multerConfig';
import IStorageProvider from '@shared/providers/StorageProvider/rules/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    await fs.rename(
      path.resolve(multerConfig.tmpFolder, file),
      path.resolve(multerConfig.uploadsFolder, file),
    );
    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(multerConfig.uploadsFolder, file);

    try {
      await fs.stat(filePath);
    } catch {
      return;
    }

    await fs.unlink(filePath);
  }
}

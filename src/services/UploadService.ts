import fs from 'fs';
import mimeTypes from 'mime-types';
import path from 'path';
import pump from 'pump';
import { ErrorResponse } from '@/helpers/ErrorResponse';
import { FastifyRequest } from 'fastify';
import { MultipartFile } from '@fastify/multipart';
import { UserCharacterService } from '@/services/UserCharacterService';

export class UploadService {
  private userCharacterService = new UserCharacterService();

  async send(
    request: FastifyRequest,
    userId: number,
    characterId: number
  ): Promise<string | null> {
    this.validateRequestIsMultipart(request);
    const file = await this.validateAndGetFile(request);
    this.validateImage(file);
    const fileName = await this.saveFile(file);
    await this.userCharacterService.updateImage(userId, characterId, fileName);
    return fileName;
  }

  async getFile(fileName: string): Promise<string> {
    const filePath = path.join(__dirname, '..', '..', 'uploads', fileName);
    return new Promise<string>((resolve, reject) => {
      fs.access(filePath, fs.constants.F_OK, err => {
        if (err) {
          reject(new ErrorResponse('upload.file.not.found'));
        } else {
          resolve(filePath);
        }
      });
    });
  }

  private validateRequestIsMultipart(request: FastifyRequest): void {
    if (!request.isMultipart()) {
      throw new ErrorResponse('upload.is.multipart');
    }
  }

  private async validateAndGetFile(
    request: FastifyRequest
  ): Promise<MultipartFile> {
    const file = await request.file({
      limits: { fileSize: 500 * 1024 },
    });
    if (!file) {
      throw new ErrorResponse('upload.no.file');
    }
    return file;
  }

  private validateImage(file: MultipartFile): void {
    if (!this.isImageValid(file)) {
      throw new ErrorResponse('upload.is.image.valid');
    }
  }

  private isImageValid(file: MultipartFile): boolean {
    const validExtensions = ['image/jpeg', 'image/png'];
    const mimeType = file.mimetype;
    return validExtensions.includes(mimeType);
  }

  private async saveFile(file: MultipartFile): Promise<string> {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    const fileExtension = mimeTypes.extension(file.mimetype);
    const fileName = `${Date.now()}.${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);
    await new Promise<void>((resolve, reject) => {
      pump(file.file, fs.createWriteStream(filePath), err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    if (file.file.truncated) {
      fs.unlinkSync(filePath);
      throw new ErrorResponse('upload.size.max.file');
    }
    return fileName;
  }
}

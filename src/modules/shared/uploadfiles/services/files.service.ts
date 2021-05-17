import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class FilesService {
  // private s3 = new AWSS3Config.
  private bucketName: string;
  private s3: S3;
  constructor() {
    this.bucketName = process.env.AWS_S3_BUCKET_NAME;
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECERT_KEY,
    });
  }

  public async uploadFile({
    file,
    storagePath = 'files',
  }: {
    file: Express.Multer.File;
    storagePath?: string;
  }): Promise<string> {
    const randomString = this.makeid(10);
    const key = `${storagePath}/${randomString}-${new Date().getTime()}-${file.originalname}`;

    return await this.s3
      .upload({
        Body: file.buffer,
        Bucket: this.bucketName,
        Key: key,
      })
      .promise()
      .then((data) => {
        return data.Location;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
  }

  async deletePublicFile(path: string) {
    return await this.s3
      .deleteObject({
        Bucket: this.bucketName,
        Key: path,
      })
      .promise();
  }

  private makeid(length: number): string {
    const result = [];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
  }
}

import { FileUploadService } from 'src/s3/s3.service';

export async function getFilesS3(
  filesService: FileUploadService,
  file: Express.Multer.File,
) {
  if (file) {
    const { Key, Location } = await filesService.uploadFile(file);

    return {
      image_url: Location,
      image_key: Key,
    };
  }

  return {
    image_url: undefined,
    image_key: undefined,
  };
}

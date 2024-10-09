import { HttpException, Injectable } from '@nestjs/common';
import { CreateSortAssetDto } from './dto/create-sort-asset.dto';
import { UpdateSortAssetDto } from './dto/update-sort-asset.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileUploadService } from 'src/s3/s3.service';

@Injectable()
export class SortAssetsService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileUploadService,
  ) {}

  async create(
    createSortAssetDto: CreateSortAssetDto,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException('Arquivo não enviado', 400);
    }

    const fileExtension = file.originalname.split('.').pop();
    const isImage = ['jpg', 'jpeg', 'png'].includes(fileExtension);

    const assetAlreadyExists = await this.prisma.sortAsset.findFirst({
      where: {
        type: isImage ? 'IMAGE' : 'VIDEO',
      },
    });

    if (assetAlreadyExists) {
      throw new HttpException('Já existe um arquivo desse tipo', 400);
    }

    const { Key: file_key, Location: file_url } =
      await this.fileService.uploadFile(file);

    const createSortAsset = await this.prisma.sortAsset.create({
      data: {
        name: createSortAssetDto.name,
        file_url,
        file_key,
        type: isImage ? 'IMAGE' : 'VIDEO',
      },
    });

    return createSortAsset;
  }

  async findAll() {
    const sortAssets = await this.prisma.sortAsset.findMany();

    return sortAssets;
  }

  async findOne(id: string) {
    const sortAsset = await this.prisma.sortAsset.findUnique({
      where: {
        id,
      },
    });

    if (!sortAsset) {
      throw new HttpException('Arquivo não encontrado', 404);
    }

    return sortAsset;
  }

  async update(
    id: string,
    updateSortAssetDto: UpdateSortAssetDto,
    file?: Express.Multer.File,
  ) {
    const fileParams = {
      file_url: undefined,
      file_key: undefined,
      type: undefined,
    };

    let sortAsset = await this.prisma.sortAsset.findUnique({
      where: {
        id,
      },
    });

    if (!sortAsset) {
      throw new HttpException('Arquivo não encontrado', 404);
    }

    if (file) {
      const fileExtension = file.originalname.split('.').pop();
      const isImage = ['jpg', 'jpeg', 'png'].includes(fileExtension);

      if (isImage) {
        fileParams.type = 'IMAGE';
      }

      await this.fileService.deleteFile(sortAsset.file_key);
      const { Key, Location } = await this.fileService.uploadFile(file);

      fileParams.file_key = Key;
      fileParams.file_url = Location;
    }

    sortAsset = await this.prisma.sortAsset.update({
      where: {
        id,
      },
      data: {
        name: updateSortAssetDto.name,
        ...fileParams,
      },
    });

    return sortAsset;
  }

  async remove(id: string) {
    let sortAsset = await this.prisma.sortAsset.findUnique({
      where: {
        id,
      },
    });

    if (!sortAsset) {
      throw new HttpException('Arquivo não encontrado', 404);
    }

    sortAsset = await this.prisma.sortAsset.delete({
      where: {
        id,
      },
    });

    return sortAsset;
  }
}

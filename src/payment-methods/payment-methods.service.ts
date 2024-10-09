import { HttpException, Injectable } from '@nestjs/common';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentMethodsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPaymentMethodDto: CreatePaymentMethodDto) {
    const paymentMethod = this.prisma.paymentMethods.create({
      data: {
        name: createPaymentMethodDto.name,
        description: createPaymentMethodDto.description,
      },
    });

    return paymentMethod;
  }

  findAll() {
    const paymentMethods = this.prisma.paymentMethods.findMany();

    return paymentMethods;
  }

  findOne(id: string) {
    const paymentMethod = this.prisma.paymentMethods.findFirst({
      where: { id },
    });

    if (!paymentMethod) {
      throw new HttpException('Forma de pagamento não encontrada', 400);
    }

    return paymentMethod;
  }

  update(id: string, updatePaymentMethodDto: UpdatePaymentMethodDto) {
    let paymentMethod = this.prisma.paymentMethods.findFirst({
      where: { id },
    });

    if (!paymentMethod) {
      throw new HttpException('Forma de pagamento não encontrada', 400);
    }

    paymentMethod = this.prisma.paymentMethods.update({
      where: { id },
      data: {
        name: updatePaymentMethodDto.name,
        description: updatePaymentMethodDto.description,
      },
    });

    return paymentMethod;
  }

  remove(id: string) {
    let paymentMethod = this.prisma.paymentMethods.findFirst({
      where: { id },
    });

    if (!paymentMethod) {
      throw new HttpException('Forma de pagamento não encontrada', 400);
    }

    paymentMethod = this.prisma.paymentMethods.delete({
      where: { id },
    });

    return {
      message: 'Deletado com sucesso',
      status: 400,
    };
  }
}

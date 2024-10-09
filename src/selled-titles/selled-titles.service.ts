import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterSelledTitleDto } from './dto/filter-sells.dto';

@Injectable()
export class SelledTitlesService {
  constructor(private prisma: PrismaService) {}

  async findAllMySellers(user_id: string) {
    const selledTitles = await this.prisma.selledTitles.findMany({
      where: { seller_id: user_id },
      orderBy: {
        created_at: 'asc',
      },
      include: {
        buyed_titles: {
          include: {
            titles: {
              include: {
                edition: {
                  include: {
                    draw_items: true,
                  },
                },
              },
            },
            fisical_titles: true,
            user: {
              select: {
                id: true,
                name: true,
                cel: true,
                email: true,
                doccument: true,
              },
            },
          },
        },
      },
    });

    return selledTitles;
  }

  async findAllMySellersFilter(
    { sellFilter, userFilters, value }: FilterSelledTitleDto,
    user_id: string,
  ) {
    if (!sellFilter && !userFilters) {
      const selledTitles = await this.prisma.selledTitles.findMany({
        where: {
          seller_id: user_id,
        },
        orderBy: {
          created_at: 'desc',
        },
        include: {
          buyed_titles: {
            include: {
              titles: {
                include: {
                  edition: {
                    include: {
                      draw_items: true,
                    },
                  },
                },
              },
              fisical_titles: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  cel: true,
                  email: true,
                  doccument: true,
                },
              },
            },
          },
        },
      });

      return selledTitles;
    } else if (sellFilter && !userFilters) {
      const selledTitles = await this.prisma.selledTitles.findMany({
        where: {
          seller_id: user_id,
          [sellFilter]: value,
        },
        orderBy: {
          created_at: 'desc',
        },
        include: {
          buyed_titles: {
            include: {
              titles: {
                include: {
                  edition: {
                    include: {
                      draw_items: true,
                    },
                  },
                },
              },
              fisical_titles: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  cel: true,
                  email: true,
                  doccument: true,
                },
              },
            },
          },
        },
      });

      return selledTitles;
    } else if (!sellFilter && userFilters) {
      const selledTitles = await this.prisma.selledTitles.findMany({
        where: {
          seller_id: user_id,
          buyed_titles: { user: { [userFilters]: value } },
        },
        orderBy: {
          created_at: 'desc',
        },
        include: {
          buyed_titles: {
            include: {
              titles: {
                include: {
                  edition: {
                    include: {
                      draw_items: true,
                    },
                  },
                },
              },
              fisical_titles: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  cel: true,
                  email: true,
                  doccument: true,
                },
              },
            },
          },
        },
      });

      return selledTitles;
    }
  }

  async findOne(id: string, user_id: string) {
    const selledTitle = await this.prisma.selledTitles.findFirst({
      where: { id, seller_id: user_id },
      include: {
        buyed_titles: {
          include: {
            titles: {
              include: {
                edition: {
                  include: {
                    draw_items: true,
                  },
                },
              },
            },
            fisical_titles: true,
            user: {
              select: {
                id: true,
                name: true,
                cel: true,
                email: true,
                doccument: true,
              },
            },
          },
        },
      },
    });

    if (!selledTitle) {
      throw new HttpException('Venda não existe', 400);
    }

    return selledTitle;
  }
}

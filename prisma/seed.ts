import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as nReadlines from 'n-readlines';

const prisma = new PrismaClient();

async function initialDB() {
  const admin = await prisma.role.create({
    data: {
      name: 'ADMIN',
      description: 'Permite todas alterações ao usuário',
    },
  });

  const distributorExists = await prisma.role.findFirst({
    where: {
      name: 'DISTRIBUTOR',
    },
  });

  if (!distributorExists) {
    await prisma.role.create({
      data: {
        name: 'DISTRIBUTOR',
        description: 'Permite ser um distribuidor/gerente',
      },
    });
  }

  const sellerExists = await prisma.role.findFirst({
    where: { name: 'SELLER' },
  });

  if (!sellerExists) {
    await prisma.role.create({
      data: {
        name: 'SELLER',
        description: 'Permite ser um distribuidor/gerente',
      },
    });
  }

  const hashedPassword = await bcrypt.hash(
    '123456',
    Number(process.env.HASH_PASSWORD),
  );

  const tester = await prisma.user.upsert({
    where: { email: 'teste@gmail.com' },
    update: {
      email: 'teste@gmail.com',
      name: 'Teste',
      cel: '+55 11 12345-6789',
      password: hashedPassword,
      value: 999999,
      code: 'jI9lJk',
      doccument: '123.456.789-10',
      roles: {
        connect: {
          id: admin.id,
        },
      },
    },
    create: {
      email: 'teste@gmail.com',
      name: 'Teste',
      cel: '+55 11 12345-6789',
      password: hashedPassword,
      value: 999999,
      code: 'jI9lJk',
      doccument: '123.456.789-10',
      roles: {
        connect: {
          id: admin.id,
        },
      },
    },
  });
  console.log({ tester });

  const titles = await prisma.title.findMany();

  for (let i = 0; i < 4; i++) {
    const title = titles[i];

    const buyedTitle = await prisma.buyedTitles.create({
      data: {
        name: 'Venda realizada',
        description: 'Foi realizado uma venda de 10 títulos',
        payment_form: 'PIX',
        address_city: 'São Paulo',
        address_state: 'São Paulo',
        user: {
          connect: {
            id: tester.id,
          },
        },
        edition: {
          connect: {
            id: title.edition_id,
          },
        },
      },
    });

    await prisma.selledTitles.create({
      data: {
        name: 'Venda realizada',
        description: 'Foi realizado uma venda de 10 títulos',
        payment_form: 'PIX',
        seller: {
          connect: {
            id: tester.id,
          },
        },
        buyed_titles: {
          connect: {
            id: buyedTitle.id,
          },
        },
      },
    });
  }
}

async function insertTXTTitles() {
  // const firstEdition = await prisma.edition.findFirst();
  // const edition = await prisma.edition.upsert({
  //   where: { id: 'asiojdfsoiajf' },
  //   create: {
  //     name: '0001',
  //     draw_date: new Date(),
  //     order: 1,
  //   },
  //   update: {
  //     name: '0001',
  //     draw_date: new Date(),
  //     order: 1,
  //   },
  // });

  const broadbandLines = new nReadlines('prisma/titles.txt');

  let line;
  let lineNumber = 1;

  while ((line = broadbandLines.next())) {
    // console.log(`Line ${lineNumber} has: ${line.toString('ascii')}`);

    if (lineNumber >= 2 && lineNumber < 40) {
      const titleArr = line.toString('ascii').split(';');
      const rmLineBreak = new RegExp('\r|\n|,', 'g');

      const dozens = String(titleArr[1])?.split('-');
      const name = titleArr[0].replace(/\r|\n/g, '');

      const code = titleArr[2].replace(rmLineBreak, '');

      const title = await prisma.baseTitle.upsert({
        where: { id: '' },
        update: {
          name: name,
          dozens: dozens,
          bar_code: code,
          qr_code: code,
          chances: 1,
          value: 5,
        },
        create: {
          name: name,
          dozens: dozens,
          bar_code: code,
          qr_code: code,
          chances: 1,
          value: 5,
        },
      });
      if (lineNumber === 40) {
        console.log('terminou');
      }

      console.log(title);
    }
    lineNumber++;
  }

  console.log('end of file.');
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(
    `The script uses approximately ${Math.round(used * 100) / 100} MB`,
  );
}

async function main() {
  await insertTXTTitles();
  // await initialDB();
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

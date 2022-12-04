import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            avatarUrl: 'https://github.com/imdoamaral.png'
        }
    });

    const pool = await prisma.pool.create({
        data: {
            title: 'Example pool',
            code: 'BOL123',
            ownerId: user.id,

            // cria um participante no bolão com o ID do user 'John Doe'
            participants: {
                create: {
                    userId: user.id,
                }
            }
        }
    });

    // sempre salvar datas no BD com timestamp
    // new Date().toISOString()
    await prisma.game.create({
        data: {
            date: '2022-11-25T12:00:00.201Z',
            firstTeamCountryCode: 'DE',
            secondTeamCountryCode: 'BR',
        }
    });

    await prisma.game.create({
        data: {
            date: '2022-11-26T12:00:00.201Z',
            firstTeamCountryCode: 'BR',
            secondTeamCountryCode: 'AR',

            guesses: {
                create: {
                    firstTeamPoints: 2,
                    secondTeamPoints: 1,

                    participant: {
                        connect: {
                            userId_poolId: {
                                userId: user.id,
                                poolId: pool.id,
                            }
                        }
                    }
                }
            }
        }
    });
}

main();
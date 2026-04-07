import { prisma } from '@/lib/prisma';

type UserData = {
    clerkId : string,
    email: string,
    name?: string
};

export async function syncUser(user: UserData) {
    const existingUser = await prisma.user.findUnique({
        where: { clerkId: user.clerkId },
    });

    if(existingUser) return existingUser;

    return await prisma.user.create({
        data: {
            clerkId: user.clerkId,
            email: user.email,
            name: user.name
        },
    });
}
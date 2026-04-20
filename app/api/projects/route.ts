import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";


export async function POST(req: NextRequest) {
    try {
        const { userId: clerkId } = await auth();

        if (!clerkId) {
            return NextResponse.json({
                error: "Unauthorized",
                status: 401
            })
        };

        const body = await req.json();
        const { title, description } = body;

        if (!title || typeof title !== "string") {
            return NextResponse.json({
                error: "Title is required",
                status: 400
            });
        }

        let dbUser = await prisma.user.findUnique({
            where: { clerkId },
        });

        if (!dbUser) {
            const user = await currentUser();

            dbUser = await prisma.user.create({
                data: {
                    clerkId,
                    email: user?.emailAddresses?.[0].emailAddress || "",
                    name: user?.fullName || "",
                    username: user?.username || user?.emailAddresses[0]?.emailAddress.split("@")[0] || "",
                }
            })

            return NextResponse.json({
                error: "User not found in DB",
                status: 404
            });
        }

        const project = await prisma.project.create({
            data: {
                title,
                description: description || "",
                userId: dbUser.id
            },
        });

        return NextResponse.json({ project }, { status: 201 });

    } catch (error) {
        console.error("[POST /api/projects]", error);
        return Response.json({ error: 'Internal server Error' }, { status: 500 })
    }
}

export async function GET() {
    try {
        const { userId: clerkId } = await auth();

        if (!clerkId) return NextResponse.json({
            error: "Unauthorized",
            status: 401
        });

        const dbUser = await prisma.user.findUnique({
            where: { clerkId }
        });

        if (!dbUser) {
            return NextResponse.json({
                error: "DB user not found",
                status: 404
            });
        };

        const projects = await prisma.project.findMany({
            where: { userId: dbUser.id },
            include: {
                user: true,
            },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json({ projects });
    } catch (error) {
        console.error("[GET /api/projects]", error);
        return Response.json({
            error: "Internal server error",
            status: 500
        });
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();

        await prisma.project.delete({
            where: { id },
        });

        return Response.json({
            success: true,
            status: 200
        });
    } catch (error) {
        console.error("[DELETE api/projects]", error);
        return Response.json({
            error: "Failed to delete",
            status: 500
        })
    }
}
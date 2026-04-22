import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";


export async function POST(req: NextRequest) {
    try {
        const { userId: clerkId } = await auth();

        if (!clerkId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { title, description } = await req.json();

        if (!title || typeof title !== "string") {
            return NextResponse.json(
                { error: "Title is required" },
                { status: 400 }
            );
        }

        //  Find user
        let dbUser = await prisma.user.findUnique({
            where: { clerkId },
        });

        // Create user if not exists
        if (!dbUser) {
            const user = await currentUser();

            dbUser = await prisma.user.create({
                data: {
                    clerkId,
                    email: user?.emailAddresses?.[0]?.emailAddress || "",
                    name: user?.fullName || "",
                    username:
                        user?.username ||
                        user?.emailAddresses?.[0]?.emailAddress.split("@")[0] ||
                        "",
                },
            });
        }

        //  Create project
        const project = await prisma.project.create({
            data: {
                title: title.trim(),
                description: description || "",
                userId: dbUser.id,
            },
        });

        return NextResponse.json({ project }, { status: 201 });

    } catch (error) {
        //  Handle duplicate title
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            return NextResponse.json(
                { error: "You already have a project with this title" },
                { status: 400 }
            );
        }

        console.error("[POST /api/projects]", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
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
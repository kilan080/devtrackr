import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request, { params } : {params: Promise<{ id: string }>} ) {
    try {
        const { id } = await params;

        await params.activity.delete({
            where: { id },
        });

        return Response.json({ sucess: true })
    } catch (error) {
        console.error("Delete activity error:", error);
        return Response.json(
            { error: "Failed to delete activity" },
            { status: 500 }
        )
    }
}
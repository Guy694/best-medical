import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export async function GET(req, { params }) {
    try {
        const article = await prisma.category.findUnique({
            where: { id: Number(params.id) },
            select: {
                id: true,
                name: true,
            },
        });


        if (!category) {
            return Response.json({ error: "category not found" }, { status: 404 });
        }

        return Response.json(category);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}


export async function PUT(req, { params }) {
    try {
        const data = await req.json();
        const updatedcategory = await prisma.category.update({
            where: { id: Number(params.id) },
            data,
        });

        return Response.json(updatedcategory);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 400 });
    }
}


export async function DELETE(req, context) {
    try {
       const { params } = await context;
    await prisma.category.delete({
        where: { id: Number(params.id) },
    });
    return Response.json({ message: "category deleted successfully" });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 400 });
    }
}
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export async function GET(req, { params }) {
    try {
        const article = await prisma.product.findUnique({
            where: { id: Number(params.id) },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                 stock: true,
                categoryId: true,
                imageUrl: true,
                createdAt: true,
            },
        });


        if (!product) {
            return Response.json({ error: "product not found" }, { status: 404 });
        }

        return Response.json(product);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}


export async function PUT(req, { params }) {
    try {
        const data = await req.json();
        const updatedArticle = await prisma.product.update({
            where: { id: Number(params.id) },
            data,
        });

        return Response.json(updatedArticle);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 400 });
    }
}


export async function DELETE(req, context) {
    try {
       const { params } = await context;
    await prisma.product.delete({
        where: { id: Number(params.id) },
    });
    return Response.json({ message: "Product deleted successfully" });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 400 });
    }
}
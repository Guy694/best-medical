import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export async function GET(req, { params }) {
    try {
        const article = await prisma.articles.findUnique({
            where: { articleID: Number(params.articleID) },
            select: {
                articleID: true,
                article_title: true,
                article_content: true,
                article_author: true,
                article_banner: true,
                createdAt: true,
            },
        });

        if (!article) {
            return Response.json({ error: "article not found" }, { status: 404 });
        }

        return Response.json(article);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}


export async function PUT(req, { params }) {
    try {
        const data = await req.json();
        const updatedArticle = await prisma.articles.update({
            where: { articleID: Number(params.articleID) },
            data,
        });

        return Response.json(updatedArticle);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 400 });
    }
}


export async function DELETE(req, { params }) {
    try {
        await prisma.articles.delete({
            where: { articleID: Number(params.articleID) },
        });


        return Response.json({ message: "article deleted successfully" });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 400 });
    }
}
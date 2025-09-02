import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      select: {
        article_title: true,
        article_content: true,
        article_author: true,
        article_banner: true,
        createdAt: true,
      },
    });
    return Response.json(articles);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    const data = await req.json();
    const { article_title, article_content,article_author,article_banner} = data;

    const newUser = await prisma.user.create({
      data: {article_title,article_content,article_author,article_banner},
    });

    return Response.json(newUser, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

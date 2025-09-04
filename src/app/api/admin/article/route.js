import { prisma } from '@/lib/prisma';

export async function GET(req) {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return new Response(JSON.stringify(articles));
}

export async function POST(req) {
  const data = await req.json();
  const { title, content } = data;
  const article = await prisma.article.create({
    data: { title, content },
  });
  return new Response(JSON.stringify(article));
}

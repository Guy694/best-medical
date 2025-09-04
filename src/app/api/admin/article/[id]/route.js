import { prisma } from '@/lib/prisma';

export async function PATCH(req, { params }) {
  const { id } = params;
  const data = await req.json();
  const updated = await prisma.article.update({
    where: { id: parseInt(id) },
    data,
  });
  return new Response(JSON.stringify(updated));
}

export async function DELETE(req, { params }) {
  const { id } = params;
  await prisma.article.delete({ where: { id: parseInt(id) } });
  return new Response(JSON.stringify({ message: 'Deleted' }));
}

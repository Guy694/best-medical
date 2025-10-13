import pool from '@/app/lib/db';

export async function GET(req, context) {
  try {
    const { params } = context;
    const [rows] = await pool.execute(
      'SELECT * FROM Product INNER JOIN Category ON Product.categoryId = Category.id WHERE Product.id = ?',
      [params.id]
    );
    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(rows[0]), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// export async function PUT(req, { params }) {
//     try {
//         const data = await req.json();
//         const updatedArticle = await prisma.product.update({
//             where: { id: Number(params.id) },
//             data,
//         });

//         return Response.json(updatedArticle);
//     } catch (error) {
//         return Response.json({ error: error.message }, { status: 400 });
//     }
// }


// export async function DELETE(req, context) {
//     try {
//        const { params } = await context;
//     await prisma.product.delete({
//         where: { id: Number(params.id) },
//     });
//     return Response.json({ message: "Product deleted successfully" });
//     } catch (error) {
//         return Response.json({ error: error.message }, { status: 400 });
//     }
// }
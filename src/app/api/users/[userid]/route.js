import pool, { query } from '@/app/lib/db';

// GET user ตาม id
export async function GET(req, { params }) {
  try {
    const id = params.userid;
    const results = await query(
      'SELECT id, name, email, phone, address, role, createdAt FROM user WHERE id = ?',
      [id]
    );
    if (results.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    return Response.json(results[0]);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// PUT = update user
export async function PUT(req, { params }) {
  try {
    const id = params.userid;
    const data = await req.json();
    await query(
      'UPDATE user SET name = ?, email = ?, phone = ?, address = ?, role = ? WHERE id = ?',
      [data.name, data.email, data.phone, data.address, data.role, id]
    );
    // ดึงข้อมูลใหม่กลับไป
    const results = await query(
      'SELECT id, name, email, phone, address, role, createdAt FROM user WHERE id = ?',
      [id]
    );
    return Response.json(results[0]);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

// DELETE = ลบ user
export async function DELETE(req, { params }) {
  try {
    const id = params.userid;
    await query('DELETE FROM user WHERE id = ?', [id]);
    return Response.json({ message: "User deleted successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
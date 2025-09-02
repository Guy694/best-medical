import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const data = await req.json();
    const { contacts_name, contacts_email, contacts_phone, contacts_article, contacts_detail } = data;

    const newContact = await prisma.contact.create({
      data: {
        contacts_name,
        contacts_email,
        contacts_phone,
        contacts_article,
        contacts_detail,
      },
    });

    return new Response(
      JSON.stringify({ message: "บันทึกสำเร็จ", contact: newContact }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("DB Error:", error);
    return new Response(
      JSON.stringify({ message: "เกิดข้อผิดพลาด", error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
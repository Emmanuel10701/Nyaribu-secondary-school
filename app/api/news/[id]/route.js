import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

// Ensure upload folder exists
const uploadDir = path.join(process.cwd(), "public", "news");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 🔹 GET single news item
export async function GET(req, { params }) {
  try {
    const id = Number(params.id);
    const newsItem = await prisma.news.findUnique({ where: { id } });

    if (!newsItem) {
      return NextResponse.json({ success: false, error: "News not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, news: newsItem });
  } catch (error) {
    console.error("❌ GET News Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 🔹 PUT (update) news item
export async function PUT(req, { params }) {
  try {
    const id = Number(params.id);
    const formData = await req.formData();

    const dataToUpdate = {
      title: formData.get("title"),
      excerpt: formData.get("excerpt"),
      fullContent: formData.get("fullContent"),
      date: new Date(formData.get("date")),
      category: formData.get("category"),
      author: formData.get("author"),
    };

    // Handle optional image upload
    const file = formData.get("image");
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${randomUUID()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      dataToUpdate.image = `/news/${fileName}`;
    }

    const updatedNews = await prisma.news.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, news: updatedNews });
  } catch (error) {
    console.error("❌ PUT News Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 🔹 DELETE news item
export async function DELETE(req, { params }) {
  try {
    const id = Number(params.id);
    const deletedNews = await prisma.news.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "News deleted", news: deletedNews });
  } catch (error) {
    console.error("❌ DELETE News Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

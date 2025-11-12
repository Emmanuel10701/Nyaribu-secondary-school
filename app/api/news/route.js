import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

// Ensure upload folder exists
const uploadDir = path.join(process.cwd(), "public", "news");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 🔹 GET all news
export async function GET() {
  try {
    const newsList = await prisma.news.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json({ success: true, news: newsList });
  } catch (error) {
    console.error("❌ GET News Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch news" }, { status: 500 });
  }
}

// 🔹 POST new news item
export async function POST(req) {
  try {
    const formData = await req.formData();

    const title = formData.get("title");
    const excerpt = formData.get("excerpt");
    const fullContent = formData.get("fullContent");
    const date = new Date(formData.get("date"));
    const category = formData.get("category");
    const author = formData.get("author");

    // Handle optional image upload
    let imagePath = null;
    const file = formData.get("image");
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${randomUUID()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      imagePath = `/news/${fileName}`;
    }

    const newNews = await prisma.news.create({
      data: {
        title,
        excerpt,
        fullContent,
        date,
        category,
        author,
        image: imagePath,
      },
    });

    return NextResponse.json({ success: true, message: "News created successfully", news: newNews });
  } catch (error) {
    console.error("❌ POST News Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

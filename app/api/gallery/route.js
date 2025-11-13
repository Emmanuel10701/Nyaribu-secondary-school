import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

// Ensure upload folder exists
const uploadDir = path.join(process.cwd(), "public/gallery");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 🔹 GET all galleries
export async function GET() {
  try {
    const galleries = await prisma.galleryImage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, galleries });
  } catch (error) {
    console.error("❌ GET Gallery Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch galleries" },
      { status: 500 }
    );
  }
}

// 🔹 POST new gallery
export async function POST(req) {
  try {
    const formData = await req.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const department = formData.get("department");

    // Multiple files (images/videos)
    const files = [];
    const fileEntries = formData.getAll("files");
    for (const file of fileEntries) {
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${randomUUID()}-${file.name}`;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, buffer);
        files.push(`/gallery/${fileName}`);
      }
    }

    const newGallery = await prisma.galleryImage.create({
      data: { title, description, category, department, files },
    });

    return NextResponse.json({ success: true, gallery: newGallery });
  } catch (error) {
    console.error("❌ POST Gallery Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

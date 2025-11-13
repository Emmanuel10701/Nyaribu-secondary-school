import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

const uploadDir = path.join(process.cwd(), "public/gallery");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 🔹 GET single gallery
export async function GET(req, { params }) {
  try {
    const { id } = params;
    const gallery = await prisma.galleryImage.findUnique({ where: { id: parseInt(id) } });
    if (!gallery) {
      return NextResponse.json({ success: false, error: "Gallery not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, gallery });
  } catch (error) {
    console.error("❌ GET Single Gallery Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 🔹 PUT update gallery
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const formData = await req.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const department = formData.get("department");

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

    const updatedGallery = await prisma.galleryImage.update({
      where: { id: parseInt(id) },
      data: { title, description, category, department, files },
    });

    return NextResponse.json({ success: true, gallery: updatedGallery });
  } catch (error) {
    console.error("❌ PUT Gallery Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 🔹 DELETE gallery
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    await prisma.galleryImage.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true, message: "Gallery deleted successfully" });
  } catch (error) {
    console.error("❌ DELETE Gallery Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import path from "path";
import fs from "fs";
import { writeFile, unlink } from "fs/promises";
import { randomUUID } from "crypto";

// Upload folder setup
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Helper: upload file
async function uploadFile(file) {
  if (!file || !file.name || file.size === 0) return null;
  
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${randomUUID()}-${file.name.replace(/\s+/g, "-")}`;
  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, buffer);
  return `/uploads/${fileName}`;
}

// Helper: delete file
async function deleteFile(filePath) {
  if (!filePath) return;
  try {
    const fullPath = path.join(process.cwd(), "public", filePath.replace(/^\//, ""));
    if (fs.existsSync(fullPath)) {
      await unlink(fullPath);
    }
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
  }
}

// 🔹 GET all team members
export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({
      success: true,
      members,
    });
  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 🔹 POST create new team member
export async function POST(req) {
  try {
    const formData = await req.formData();
    
    const name = formData.get("name") || "";
    const role = formData.get("role") || "teacher";
    const title = formData.get("title") || null;
    const phone = formData.get("phone") || null;
    const email = formData.get("email") || null;
    const bio = formData.get("bio") || null;
    
    // Validate required fields
    if (!name.trim()) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }
    
    let image = null;
    const imageFile = formData.get("image");
    if (imageFile && imageFile.size > 0) {
      image = await uploadFile(imageFile);
    }
    
    const member = await prisma.teamMember.create({
      data: {
        name,
        role,
        title,
        phone,
        email,
        bio,
        image,
      }
    });
    
    return NextResponse.json({
      success: true,
      message: "Team member created successfully",
      member,
    });
  } catch (error) {
    console.error("❌ POST Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
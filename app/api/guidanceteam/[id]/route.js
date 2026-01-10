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

// 🔹 GET single team member
export async function GET(req, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid member ID" },
        { status: 400 }
      );
    }

    const member = await prisma.teamMember.findUnique({
      where: { id }
    });

    if (!member) {
      return NextResponse.json(
        { success: false, error: "Team member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      member,
    });
  } catch (error) {
    console.error("❌ GET Single Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 🔹 PUT update team member
export async function PUT(req, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid member ID" },
        { status: 400 }
      );
    }

    // Check if member exists
    const existingMember = await prisma.teamMember.findUnique({
      where: { id }
    });

    if (!existingMember) {
      return NextResponse.json(
        { success: false, error: "Team member not found" },
        { status: 404 }
      );
    }

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
    
    // Handle image update
    let image = existingMember.image; // Keep existing image by default
    const imageFile = formData.get("image");
    
    // Check if new image is uploaded
    if (imageFile && imageFile.size > 0) {
      // Delete old image if exists
      if (existingMember.image) {
        await deleteFile(existingMember.image);
      }
      // Upload new image
      image = await uploadFile(imageFile);
    }
    
    // Check if image should be removed
    const removeImage = formData.get("removeImage") === "true";
    if (removeImage && existingMember.image) {
      await deleteFile(existingMember.image);
      image = null;
    }
    
    const updatedMember = await prisma.teamMember.update({
      where: { id },
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
      message: "Team member updated successfully",
      member: updatedMember,
    });
  } catch (error) {
    console.error("❌ PUT Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 🔹 DELETE team member
export async function DELETE(req, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid member ID" },
        { status: 400 }
      );
    }

    // Check if member exists
    const existingMember = await prisma.teamMember.findUnique({
      where: { id }
    });

    if (!existingMember) {
      return NextResponse.json(
        { success: false, error: "Team member not found" },
        { status: 404 }
      );
    }

    // Delete image file if exists
    if (existingMember.image) {
      await deleteFile(existingMember.image);
    }

    // Delete member from database
    await prisma.teamMember.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error) {
    console.error("❌ DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
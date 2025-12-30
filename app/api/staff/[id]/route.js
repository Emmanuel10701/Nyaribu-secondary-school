import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

// Ensure upload folder exists
const uploadDir = path.join(process.cwd(), "public", "staff");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 🔹 GET single staff by ID
export async function GET(req, { params }) {
  try {
    const staff = await prisma.staff.findUnique({
      where: { id: Number(params.id) },
    });

    if (!staff) {
      return NextResponse.json(
        { success: false, error: "Staff not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, staff });
  } catch (error) {
    console.error("❌ GET Staff Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch staff" },
      { status: 500 }
    );
  }
}

// 🔹 UPDATE staff by ID
export async function PUT(req, { params }) {
  try {
    const formData = await req.formData();
    const data = {};

    // Basic fields
    if (formData.get("name")) data.name = formData.get("name");
    if (formData.get("role")) data.role = formData.get("role");
    if (formData.get("position")) data.position = formData.get("position");
    if (formData.get("department")) data.department = formData.get("department");
    if (formData.get("email")) data.email = formData.get("email");
    if (formData.get("phone")) data.phone = formData.get("phone");
    if (formData.get("bio")) data.bio = formData.get("bio");
    if (formData.get("quote")) data.quote = formData.get("quote");

    // JSON fields (safe parsing)
    const responsibilities = formData.get("responsibilities");
    if (responsibilities) {
      data.responsibilities = JSON.parse(responsibilities);
    }

    const expertise = formData.get("expertise");
    if (expertise) {
      data.expertise = JSON.parse(expertise);
    }

    const achievements = formData.get("achievements");
    if (achievements) {
      data.achievements = JSON.parse(achievements);
    }

    // Optional image upload
    const file = formData.get("image");
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${randomUUID()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      data.image = `/staff/${fileName}`;
    }

    const updatedStaff = await prisma.staff.update({
      where: { id: Number(params.id) },
      data,
    });

    return NextResponse.json({ success: true, staff: updatedStaff });
  } catch (error) {
    console.error("❌ PUT Staff Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 🔹 DELETE staff by ID
export async function DELETE(req, { params }) {
  try {
    await prisma.staff.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({
      success: true,
      message: "Staff deleted successfully",
    });
  } catch (error) {
    console.error("❌ DELETE Staff Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

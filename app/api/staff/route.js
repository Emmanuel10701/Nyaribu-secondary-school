import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

// Ensure upload folder exists
const uploadDir = path.join(process.cwd(), "public", "staff");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 🔹 GET all staff
export async function GET() {
  try {
    const staff = await prisma.staff.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, staff });
  } catch (error) {
    console.error("❌ GET Staff Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch staff" }, { status: 500 });
  }
}

// 🔹 POST new staff
export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const role = formData.get("role");
    const position = formData.get("position");
    const department = formData.get("department");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const bio = formData.get("bio");

    const responsibilities = JSON.parse(formData.get("responsibilities") || "[]");
    const expertise = JSON.parse(formData.get("expertise") || "[]");
    const achievements = JSON.parse(formData.get("achievements") || "[]");

    // Handle optional file upload
    let imagePath = null;
    const file = formData.get("image");
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${randomUUID()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      imagePath = `/staff/${fileName}`;
    }

    const newStaff = await prisma.staff.create({
      data: {
        name,
        role,
        position,
        department,
        email,
        phone,
        bio,
        responsibilities,
        expertise,
        achievements,
        image: imagePath,
      },
    });

    return NextResponse.json({ success: true, staff: newStaff });
  } catch (error) {
    console.error("❌ POST Staff Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

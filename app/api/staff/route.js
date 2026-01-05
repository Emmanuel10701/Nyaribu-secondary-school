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

// Helper: remove image safely
const removeImage = (imagePath) => {
  if (!imagePath) return;
  const fullPath = path.join(process.cwd(), "public", imagePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

// 🔹 GET all staff
export async function GET() {
  try {
    const staff = await prisma.staff.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, staff });
  } catch (error) {
    console.error("❌ GET Staff Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch staff" },
      { status: 500 }
    );
  }
}

// 🔹 Check principal/deputy principal limits
async function checkRoleLimits(role, staffId = null) {
  if (role === "Principal") {
    const existingPrincipal = await prisma.staff.findFirst({
      where: { 
        role: "Principal",
        ...(staffId && { id: { not: staffId } }) // Exclude current staff if updating
      }
    });
    
    if (existingPrincipal) {
      throw new Error("A principal already exists. There can only be one principal.");
    }
  } else if (role === "Deputy Principal") {
    const existingDeputies = await prisma.staff.findMany({
      where: { 
        role: "Deputy Principal",
        ...(staffId && { id: { not: staffId } }) // Exclude current staff if updating
      }
    });
    
    if (existingDeputies.length >= 3) {
      throw new Error("Maximum of three deputy principals allowed. Current count: " + existingDeputies.length);
    }
  }
}

// 🔹 POST new staff
export async function POST(req) {
  try {
    const formData = await req.formData();

    // Basic fields - Include ALL fields from your Prisma schema
    const name = formData.get("name");
    const role = formData.get("role");
    const position = formData.get("position");
    const department = formData.get("department");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const bio = formData.get("bio");
    const quote = formData.get("quote");
    const education = formData.get("education") || "";
    const experience = formData.get("experience") || "";
    const gender = formData.get("gender") || "male";
    const status = formData.get("status") || "active";
    const joinDate = formData.get("joinDate") || new Date().toISOString().split('T')[0];

    // 🔹 Validate role limits BEFORE processing image
    await checkRoleLimits(role);

    // 🔹 CRITICAL: Image handling - Image is REQUIRED
    const imageFile = formData.get("image");
    
    // Validate that an image was uploaded
    if (!imageFile || (typeof imageFile === "string" && imageFile.trim() === "")) {
      return NextResponse.json(
        { success: false, error: "Staff image is required. Please upload an image." },
        { status: 400 }
      );
    }
    
    let imageUrl = "";
    
    // Check if it's an actual file upload
    if (imageFile && typeof imageFile !== "string" && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const ext = path.extname(imageFile.name) || ".png";
      const fileName = `${randomUUID()}${ext}`;
      const filePath = path.join(uploadDir, fileName);
      
      fs.writeFileSync(filePath, buffer);
      imageUrl = `/staff/${fileName}`;
    } else if (typeof imageFile === "string" && imageFile.trim() !== "") {
      // If it's already a valid path string (for editing existing staff)
      imageUrl = imageFile;
    } else {
      // No image provided
      return NextResponse.json(
        { success: false, error: "Staff image is required. Please upload an image." },
        { status: 400 }
      );
    }

    // 🔹 JSON fields with safe parsing
    let responsibilities = [];
    let expertise = [];
    let achievements = [];

    try {
      const responsibilitiesStr = formData.get("responsibilities");
      if (responsibilitiesStr) {
        responsibilities = JSON.parse(responsibilitiesStr);
      }
    } catch (e) {
      console.error("Error parsing responsibilities:", e);
    }

    try {
      const expertiseStr = formData.get("expertise");
      if (expertiseStr) {
        expertise = JSON.parse(expertiseStr);
      }
    } catch (e) {
      console.error("Error parsing expertise:", e);
    }

    try {
      const achievementsStr = formData.get("achievements");
      if (achievementsStr) {
        achievements = JSON.parse(achievementsStr);
      }
    } catch (e) {
      console.error("Error parsing achievements:", e);
    }

    // 🔹 Save staff - Include ALL fields
    const newStaff = await prisma.staff.create({
      data: {
        name,
        role,
        position: position || null,
        department: department || null,
        email: email || null,
        phone: phone || null,
        bio: bio || null,
        quote: quote || null,
        education: education || null,
        experience: experience || null,
        gender: gender || "male",
        status: status || "active",
        joinDate: joinDate || new Date().toISOString().split('T')[0],
        image: imageUrl,
        responsibilities,
        expertise,
        achievements,
      },
    });

    return NextResponse.json(
      { success: true, staff: newStaff },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ POST Staff Error:", error);

    // Handle role limit errors
    if (error.message.includes("principal") || error.message.includes("deputy")) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create staff",
      },
      { status: 500 }
    );
  }
}
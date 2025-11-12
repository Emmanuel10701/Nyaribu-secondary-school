import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

// Ensure upload folder exists
const uploadDir = path.join(process.cwd(), "public", "events");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 🔹 GET all events
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json({ success: true, events });
  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// 🔹 POST new event
export async function POST(req) {
  try {
    const formData = await req.formData();

    const title = formData.get("title");
    const category = formData.get("category");
    const description = formData.get("description");
    const date = new Date(formData.get("date"));
    const time = formData.get("time");
    const type = formData.get("type");
    const location = formData.get("location");
    const featured = formData.get("featured") === "true";
    const attendees = formData.get("attendees"); // "student" or "staff"
    const speaker = formData.get("speaker") || "";

    // Handle optional file upload
    let imagePath = null;
    const file = formData.get("image");
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${randomUUID()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      imagePath = `/events/${fileName}`;
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        category,
        description,
        date,
        time,
        type,
        location,
        featured,
        image: imagePath,
        attendees, // added as string
        speaker,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    console.error("❌ POST Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

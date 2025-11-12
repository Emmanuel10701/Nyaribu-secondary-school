import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

// Ensure upload folder exists
const uploadDir = path.join(process.cwd(), "public", "events");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 🔹 GET single event by ID
export async function GET(req, { params }) {
  try {
    const id = Number(params.id);
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 🔹 PUT (update) event by ID
export async function PUT(req, { params }) {
  try {
    const id = Number(params.id);
    const formData = await req.formData();

    const dataToUpdate = {
      title: formData.get("title"),
      category: formData.get("category"),
      description: formData.get("description"),
      date: new Date(formData.get("date")),
      time: formData.get("time"),
      type: formData.get("type"),
      location: formData.get("location"),
      featured: formData.get("featured") === "true",
      attendees: formData.get("attendees"), // "student" or "staff"
      speaker: formData.get("speaker"),
    };

    // Handle optional file upload
    const file = formData.get("image");
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${randomUUID()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      dataToUpdate.image = `/events/${fileName}`;
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, event: updatedEvent });
  } catch (error) {
    console.error("❌ PUT Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 🔹 DELETE event by ID
export async function DELETE(req, { params }) {
  try {
    const id = Number(params.id);
    const deletedEvent = await prisma.event.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Event deleted", event: deletedEvent });
  } catch (error) {
    console.error("❌ DELETE Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

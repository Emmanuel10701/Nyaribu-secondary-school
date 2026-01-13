import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";

// Helpers
const ensureUploadDir = (uploadDir) => {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};

const uploadFile = async (file, uploadDir) => {
  if (!file || !file.name) return null;
  
  const buffer = Buffer.from(await file.arrayBuffer());
  const timestamp = Date.now();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `${timestamp}-${sanitizedFileName}`;
  const filePath = path.join(uploadDir, fileName);
  
  await writeFile(filePath, buffer);
  return {
    url: `/resources/${fileName}`,
    name: file.name,
    size: formatFileSize(file.size),
    extension: file.name.split('.').pop().toLowerCase(),
    uploadedAt: new Date().toISOString()
  };
};

const uploadMultipleFiles = async (files, uploadDir) => {
  if (!files || files.length === 0) return [];
  
  const uploadedFiles = [];
  
  for (const file of files) {
    if (file && file.name) {
      const fileData = await uploadFile(file, uploadDir);
      if (fileData) {
        uploadedFiles.push(fileData);
      }
    }
  }
  
  return uploadedFiles;
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileType = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  
  const typeMap = {
    pdf: 'pdf',
    doc: 'document', docx: 'document',
    txt: 'document',
    ppt: 'presentation', pptx: 'presentation',
    xls: 'spreadsheet', xlsx: 'spreadsheet', csv: 'spreadsheet',
    jpg: 'image', jpeg: 'image', png: 'image', gif: 'image',
    mp4: 'video', mov: 'video',
    mp3: 'audio', wav: 'audio',
    zip: 'archive', rar: 'archive'
  };
  
  return typeMap[ext] || 'document';
};

const determineMainTypeFromFiles = (files) => {
  if (!files || files.length === 0) return 'document';
  
  const types = files.map(file => getFileType(file.name));
  
  // Count occurrences
  const typeCount = {};
  types.forEach(type => {
    typeCount[type] = (typeCount[type] || 0) + 1;
  });
  
  // Return most common type
  const mostCommon = Object.keys(typeCount).reduce((a, b) => 
    typeCount[a] > typeCount[b] ? a : b
  );
  
  return mostCommon;
};

// 🔹 GET — Fetch all resources
export async function GET(request) {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(
      {
        success: true,
        resources,
        count: resources.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching resources:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 🔹 POST — Create resource with multiple files
export async function POST(request) {
  try {
    const formData = await request.formData();

    // Extract fields
    const title = formData.get("title")?.trim() || "";
    const subject = formData.get("subject")?.trim() || "";
    const className = formData.get("className")?.trim() || "";
    const teacher = formData.get("teacher")?.trim() || "";
    const description = formData.get("description")?.trim() || "";
    const category = formData.get("category")?.trim() || "general";
    const accessLevel = formData.get("accessLevel")?.trim() || "student";
    const uploadedBy = formData.get("uploadedBy")?.trim() || "System";
    const isActive = formData.get("isActive") !== "false";

    // Validate required fields
    if (!title || !subject || !className || !teacher) {
      return NextResponse.json(
        { success: false, error: "Title, subject, class, and teacher are required" },
        { status: 400 }
      );
    }

    // Get multiple files - use "files" as the field name
    const files = formData.getAll("files");
    
    // Validate files
    if (!files || files.length === 0 || (files.length === 1 && !files[0].name)) {
      return NextResponse.json(
        { success: false, error: "At least one file is required" },
        { status: 400 }
      );
    }

    // Upload directory
    const uploadDir = path.join(process.cwd(), "public/resources");
    ensureUploadDir(uploadDir);
    
    // Upload all files
    const uploadedFiles = await uploadMultipleFiles(files, uploadDir);
    if (uploadedFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to upload files" },
        { status: 500 }
      );
    }

    // Determine main type
    const mainType = determineMainTypeFromFiles(files);

    // Create resource with multiple files
    const resource = await prisma.resource.create({
      data: {
        title,
        subject,
        className,
        teacher,
        description,
        category,
        type: mainType,
        files: uploadedFiles, // Array of file objects
        accessLevel,
        uploadedBy,
        downloads: 0,
        isActive,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Resource created with ${uploadedFiles.length} file(s)`,
        resource,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating resource:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message
      },
      { status: 500 }
    );
  }
}
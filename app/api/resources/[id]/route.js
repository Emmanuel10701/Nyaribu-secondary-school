import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import path from "path";
import fs from "fs";
import { unlink, writeFile } from "fs/promises";

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
    ppt: 'presentation', pptx: 'presentation',
    xls: 'spreadsheet', xlsx: 'spreadsheet',
    jpg: 'image', jpeg: 'image', png: 'image',
    mp4: 'video', mp3: 'audio',
    zip: 'archive',
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

// 🔹 GET — Get single resource by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Resource ID is required" },
        { status: 400 }
      );
    }

    const resource = await prisma.resource.findUnique({
      where: { id: parseInt(id) },
    });

    if (!resource) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        resource,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching resource:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 🔹 PUT — Update a resource
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Resource ID is required" },
        { status: 400 }
      );
    }

    // Check if resource exists
    const existingResource = await prisma.resource.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingResource) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }

    // Check content type
    const contentType = request.headers.get("content-type") || "";
    
    if (contentType.includes("multipart/form-data")) {
      return await handleFormUpdate(request, id, existingResource);
    } else {
      return await handleJsonUpdate(request, id);
    }
  } catch (error) {
    console.error("❌ Error updating resource:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Handle JSON update (no file change)
async function handleJsonUpdate(request, id) {
  const body = await request.json();
  
  // Remove fields that shouldn't be updated
  const { id: _, createdAt, downloads, files, ...updateData } = body;
  
  // Update resource
  const resource = await prisma.resource.update({
    where: { id: parseInt(id) },
    data: {
      ...updateData,
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(
    {
      success: true,
      message: "Resource updated successfully",
      resource,
    },
    { status: 200 }
  );
}

// Handle form update with file operations
async function handleFormUpdate(request, id, existingResource) {
  const formData = await request.formData();
  const action = formData.get("action") || "update"; // "addFiles", "removeFile", "update"
  
  let updateData = {};
  let uploadedFiles = [...(existingResource.files || [])];
  
  switch (action) {
    case "addFiles":
      // Add new files
      const newFiles = formData.getAll("files");
      if (newFiles && newFiles.length > 0 && newFiles[0].name) {
        const uploadDir = path.join(process.cwd(), "public/resources");
        ensureUploadDir(uploadDir);
        
        const uploadedNewFiles = await uploadMultipleFiles(newFiles, uploadDir);
        uploadedFiles = [...uploadedFiles, ...uploadedNewFiles];
        
        // Update type based on all files
        const allFileNames = [...uploadedFiles.map(f => f.name)];
        const newMainType = determineMainTypeFromFiles(allFileNames);
        updateData.type = newMainType;
      }
      break;
      
    case "removeFile":
      // Remove specific file
      const fileNameToRemove = formData.get("fileName");
      if (fileNameToRemove) {
        // Find the file to remove
        const fileToRemove = uploadedFiles.find(f => f.name === fileNameToRemove);
        if (fileToRemove) {
          // Delete physical file
          const filePath = path.join(process.cwd(), "public/resources", 
            path.basename(fileToRemove.url));
          if (fs.existsSync(filePath)) {
            await unlink(filePath);
          }
          
          // Remove from array
          uploadedFiles = uploadedFiles.filter(f => f.name !== fileNameToRemove);
        }
      }
      break;
      
    case "update":
    default:
      // Update basic fields
      const title = formData.get("title")?.trim();
      const subject = formData.get("subject")?.trim();
      const className = formData.get("className")?.trim();
      const teacher = formData.get("teacher")?.trim();
      const description = formData.get("description")?.trim();
      const category = formData.get("category")?.trim();
      const accessLevel = formData.get("accessLevel")?.trim();
      const uploadedBy = formData.get("uploadedBy")?.trim();
      const isActive = formData.get("isActive");
      
      if (title) updateData.title = title;
      if (subject) updateData.subject = subject;
      if (className) updateData.className = className;
      if (teacher) updateData.teacher = teacher;
      if (description) updateData.description = description;
      if (category) updateData.category = category;
      if (accessLevel) updateData.accessLevel = accessLevel;
      if (uploadedBy) updateData.uploadedBy = uploadedBy;
      if (isActive !== null) updateData.isActive = isActive === "true";
      break;
  }
  
  // Always update files if modified
  if (action === "addFiles" || action === "removeFile") {
    updateData.files = uploadedFiles;
  }
  
  // Add updated timestamp
  updateData.updatedAt = new Date();
  
  // Update resource in database
  const resource = await prisma.resource.update({
    where: { id: parseInt(id) },
    data: updateData,
  });

  return NextResponse.json(
    {
      success: true,
      message: getUpdateMessage(action, uploadedFiles.length),
      resource,
    },
    { status: 200 }
  );
}

function getUpdateMessage(action, fileCount) {
  switch (action) {
    case "addFiles":
      return `Added ${fileCount} file(s) to resource`;
    case "removeFile":
      return "File removed from resource";
    default:
      return "Resource updated successfully";
  }
}

// 🔹 DELETE — Delete a resource
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Resource ID is required" },
        { status: 400 }
      );
    }

    // Get resource first to delete files
    const resource = await prisma.resource.findUnique({
      where: { id: parseInt(id) },
    });

    if (!resource) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }

    // Delete all associated files from storage
    try {
      if (resource.files && Array.isArray(resource.files)) {
        for (const file of resource.files) {
          if (file.url) {
            const filePath = path.join(process.cwd(), 'public', file.url);
            if (fs.existsSync(filePath)) {
              await unlink(filePath);
            }
          }
        }
      }
    } catch (fileError) {
      console.warn("Could not delete some files:", fileError.message);
    }

    // Delete from database
    await prisma.resource.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Resource and all associated files deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting resource:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 🔹 PATCH — Increment download count
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Resource ID is required" },
        { status: 400 }
      );
    }

    // Check if resource exists
    const existingResource = await prisma.resource.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingResource) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }

    // Increment download count
    const resource = await prisma.resource.update({
      where: { id: parseInt(id) },
      data: {
        downloads: {
          increment: 1
        },
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Download count updated",
        downloads: resource.downloads,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating download count:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
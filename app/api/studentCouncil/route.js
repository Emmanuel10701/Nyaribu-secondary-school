import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

// Ensure upload folder exists
const uploadDir = path.join(process.cwd(), "public", "council");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Helper function to map string positions to CouncilPosition enum
const mapPositionToEnum = (position) => {
  const positionMap = {
    'President': 'President',
    'DeputyPresident': 'DeputyPresident',
    'SchoolCaptain': 'SchoolCaptain',
    'DeputyCaptain': 'DeputyCaptain',
    'AcademicsSecretary': 'AcademicsSecretary',
    'SportsSecretary': 'SportsSecretary',
    'EntertainmentSecretary': 'EntertainmentSecretary',
    'CleaningSecretary': 'CleaningSecretary',
    'MealsSecretary': 'MealsSecretary',
    'BellRinger': 'BellRinger',
    'DisciplineSecretary': 'DisciplineSecretary',
    'HealthSecretary': 'HealthSecretary',
    'LibrarySecretary': 'LibrarySecretary',
    'TransportSecretary': 'TransportSecretary',
    'EnvironmentSecretary': 'EnvironmentSecretary',
    'SpiritualSecretary': 'SpiritualSecretary',
    'TechnologySecretary': 'TechnologySecretary',
    'Assistant': 'Assistant',
    'ClassRepresentative': 'ClassRepresentative',
    'ClassAssistant': 'ClassAssistant'
  };
  
  return positionMap[position];
};

// Helper function to map string departments to CouncilDepartment enum
const mapDepartmentToEnum = (department) => {
  const departmentMap = {
    'Presidency': 'Presidency',
    'Academics': 'Academics',
    'Sports': 'Sports',
    'Entertainment': 'Entertainment',
    'Cleaning': 'Cleaning',
    'Meals': 'Meals',
    'Discipline': 'Discipline',
    'Health': 'Health',
    'Library': 'Library',
    'Transport': 'Transport',
    'Environment': 'Environment',
    'Spiritual': 'Spiritual',
    'Technology': 'Technology',
    'Class': 'General', // Map 'Class' to 'General' since 'Class' doesn't exist in CouncilDepartment
    'General': 'General'
  };
  
  return departmentMap[department];
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const search = searchParams.get('search');

    // Search students for council assignment
    if (action === 'search-students') {
      const students = await prisma.student.findMany({
        where: {
          AND: [
            { status: 'Active' },
            {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { admissionNumber: { contains: search, mode: 'insensitive' } },
                { form: { contains: search, mode: 'insensitive' } },
                { stream: { contains: search, mode: 'insensitive' } },
              ]
            }
          ]
        },
        select: {
          id: true,
          name: true,
          admissionNumber: true,
          form: true,
          stream: true,
          gender: true,
          academicPerformance: true,
        },
        take: 20,
        orderBy: { name: 'asc' }
      });

      return NextResponse.json({ success: true, students });
    }

    // Get all council members with student details
    const councilMembers = await prisma.studentCouncil.findMany({
      include: {
        student: {
          select: {
            id: true,
            name: true,
            admissionNumber: true,
            form: true,
            stream: true,
            gender: true,
            academicPerformance: true,
          }
        }
      },
      orderBy: [
        { department: 'asc' },
        { position: 'asc' }
      ]
    });

    return NextResponse.json({ success: true, councilMembers });
  } catch (error) {
    console.error("❌ Student Council GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch student council data" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    
    // Extract text fields
    const studentId = formData.get('studentId');
    const position = formData.get('position');
    const department = formData.get('department');
    const startDate = formData.get('startDate');
    const endDate = formData.get('endDate');
    const responsibilities = formData.get('responsibilities');
    const achievements = formData.get('achievements');
    const imageFile = formData.get('image');
    const form = formData.get('form');
    const stream = formData.get('stream');

    console.log('Received form data:', {
      studentId, position, department, startDate, endDate, form, stream
    });

    // Validate required fields
    if (!studentId || !position || !startDate || !responsibilities) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Map position to enum
    const mappedPosition = mapPositionToEnum(position);
    if (!mappedPosition) {
      return NextResponse.json(
        { success: false, error: "Invalid position" },
        { status: 400 }
      );
    }

    // Map department to enum
    const mappedDepartment = department ? mapDepartmentToEnum(department) : null;
    if (department && !mappedDepartment) {
      return NextResponse.json(
        { success: false, error: "Invalid department" },
        { status: 400 }
      );
    }

    console.log('Mapped position:', mappedPosition);
    console.log('Mapped department:', mappedDepartment);

    // Department is required for non-class roles
    if (!['ClassRepresentative', 'ClassAssistant'].includes(mappedPosition) && !mappedDepartment) {
      return NextResponse.json(
        { success: false, error: "Department is required for this position" },
        { status: 400 }
      );
    }

    // Form and stream are required for class roles
    if (['ClassRepresentative', 'ClassAssistant'].includes(mappedPosition) && (!form || !stream)) {
      return NextResponse.json(
        { success: false, error: "Form and stream are required for class roles" },
        { status: 400 }
      );
    }

    // Check if student exists and is active
    const student = await prisma.student.findUnique({
      where: { id: parseInt(studentId) },
      select: { status: true, name: true, form: true, stream: true }
    });

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Student not found" },
        { status: 404 }
      );
    }

    if (student.status !== 'Active') {
      return NextResponse.json(
        { success: false, error: "Student is not active" },
        { status: 400 }
      );
    }

    // For class roles, verify student is in the correct class
    if (['ClassRepresentative', 'ClassAssistant'].includes(mappedPosition)) {
      if (student.form !== form || student.stream !== stream) {
        return NextResponse.json(
          { success: false, error: `Student is in ${student.form} ${student.stream}, not ${form} ${stream}` },
          { status: 400 }
        );
      }
    }

    // Check if position is already taken - USE MAPPED POSITION AND DEPARTMENT
    const positionTaken = await prisma.studentCouncil.findFirst({
      where: {
        position: mappedPosition,
        department: mappedDepartment, // Use mappedDepartment
        form: form || null,
        stream: stream || null,
        status: 'Active'
      }
    });

    if (positionTaken) {
      const location = mappedDepartment ? `${mappedDepartment} department` : `${form} ${stream}`;
      return NextResponse.json(
        { success: false, error: `${position} position in ${location} is already occupied` },
        { status: 400 }
      );
    }

    // Check if student already has an active position in same scope
    const existingPosition = await prisma.studentCouncil.findFirst({
      where: {
        studentId: parseInt(studentId),
        OR: [
          { department: mappedDepartment },
          { AND: [{ form: form || null }, { stream: stream || null }] }
        ],
        status: 'Active'
      }
    });

    if (existingPosition) {
      const location = existingPosition.department ? 
        `${existingPosition.department} department` : 
        `${existingPosition.form} ${existingPosition.stream}`;
      return NextResponse.json(
        { success: false, error: `Student already has an active position in ${location}` },
        { status: 400 }
      );
    }

    // Handle image upload
    let imagePath = null;
    if (imageFile && imageFile instanceof File) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(imageFile.type)) {
        return NextResponse.json(
          { success: false, error: "Invalid file type. Only JPEG, PNG, and WebP images are allowed." },
          { status: 400 }
        );
      }

      if (imageFile.size > maxSize) {
        return NextResponse.json(
          { success: false, error: "Image size too large. Maximum size is 5MB." },
          { status: 400 }
        );
      }

      // Generate unique filename
      const fileExtension = path.extname(imageFile.name);
      const fileName = `council_${randomUUID()}${fileExtension}`;
      const filePath = path.join(uploadDir, fileName);

      // Convert file to buffer and save
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(filePath, buffer);

      imagePath = `/council/${fileName}`;
    }

    // Create the council member - USE MAPPED POSITION AND DEPARTMENT
    const councilMember = await prisma.studentCouncil.create({
      data: {
        studentId: parseInt(studentId),
        position: mappedPosition,
        department: mappedDepartment, // Use mappedDepartment
        form: form || null,
        stream: stream || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        responsibilities,
        achievements: achievements || '',
        image: imagePath,
        status: 'Active'
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            admissionNumber: true,
            form: true,
            stream: true,
            gender: true,
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      councilMember,
      message: "Student added to council successfully" 
    });
  } catch (error) {
    console.error("❌ Student Council POST Error:", error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: "This student already holds this position" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
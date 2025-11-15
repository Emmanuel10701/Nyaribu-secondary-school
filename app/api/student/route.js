import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";

// 🔹 Handle all student operations
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const studentId = searchParams.get('studentId');

    // Handle promotion history requests
    if (action === 'promotion-history') {
      const history = await prisma.promotionHistory.findMany({
        where: studentId ? { studentId: parseInt(studentId) } : {},
        include: {
          student: {
            select: {
              name: true,
              admissionNumber: true
            }
          }
        },
        orderBy: { promotedAt: 'desc' }
      });

      return NextResponse.json({ success: true, history });
    }

    // Default: get all students
    const students = await prisma.student.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, students });
  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

// 🔹 POST new student
export async function POST(req) {
  try {
    const data = await req.json();

    const newStudent = await prisma.student.create({
      data: {
        admissionNumber: data.admissionNumber,
        name: data.name,
        form: data.form,
        stream: data.stream,
        gender: data.gender,
        dateOfBirth: new Date(data.dateOfBirth),
        enrollmentDate: new Date(data.enrollmentDate),
        kcpeMarks: data.kcpeMarks ? parseInt(data.kcpeMarks) : null,
        previousSchool: data.previousSchool,
        parentName: data.parentName,
        parentEmail: data.parentEmail,
        parentPhone: data.parentPhone,
        emergencyContact: data.emergencyContact,
        address: data.address,
        medicalInfo: data.medicalInfo,
        hobbies: data.hobbies,
        academicPerformance: data.academicPerformance,
        attendance: data.attendance,
        disciplineRecord: data.disciplineRecord,
        status: data.status || "Active",
      },
    });

    return NextResponse.json({ success: true, student: newStudent });
  } catch (error) {
    console.error("❌ POST Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 🔹 PUT update student
export async function PUT(req) {
  try {
    const data = await req.json();
    const { id, ...updateData } = data;

    const updatedStudent = await prisma.student.update({
      where: { id: parseInt(id) },
      data: {
        ...updateData,
        dateOfBirth: new Date(updateData.dateOfBirth),
        enrollmentDate: new Date(updateData.enrollmentDate),
        kcpeMarks: updateData.kcpeMarks ? parseInt(updateData.kcpeMarks) : null,
      },
    });

    return NextResponse.json({ success: true, student: updatedStudent });
  } catch (error) {
    console.error("❌ PUT Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 🔹 DELETE student
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    await prisma.student.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    console.error("❌ DELETE Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 🔹 PATCH promote/graduate class
export async function PATCH(req) {
  try {
    const data = await req.json();
    const { form, action } = data;

    if (action === 'graduate') {
      const updatedStudents = await prisma.student.updateMany({
        where: { 
          form: form,
          status: { not: "Graduated" }
        },
        data: {
          status: "Graduated"
        },
      });

      // Create promotion history records for graduated students
      const studentsToGraduate = await prisma.student.findMany({
        where: { 
          form: form,
          status: "Graduated"
        }
      });

      if (studentsToGraduate.length > 0) {
        const promotionRecords = studentsToGraduate.map(student => ({
          studentId: student.id,
          fromForm: student.form,
          toForm: 'Graduated',
          fromStream: student.stream,
          toStream: student.stream,
          promotedBy: 'System'
        }));

        await prisma.promotionHistory.createMany({
          data: promotionRecords
        });
      }

      return NextResponse.json({ 
        success: true, 
        message: `${updatedStudents.count} students graduated successfully`,
        count: updatedStudents.count
      });
    }

    if (action === 'promote') {
      // Define promotion mapping
      const promotionMap = {
        'Form 1': 'Form 2',
        'Form 2': 'Form 3', 
        'Form 3': 'Form 4',
        'Form 4': 'Graduated'
      };

      const nextForm = promotionMap[form];
      
      if (!nextForm) {
        return NextResponse.json({ 
          success: false, 
          error: "Invalid form for promotion" 
        }, { status: 400 });
      }

      if (nextForm === 'Graduated') {
        const studentsToUpdate = await prisma.student.findMany({
          where: { 
            form: form,
            status: { not: "Graduated" }
          }
        });

        if (studentsToUpdate.length === 0) {
          return NextResponse.json({ 
            success: false, 
            error: `No active students found in ${form} to graduate` 
          }, { status: 400 });
        }

        const updateResult = await prisma.student.updateMany({
          where: { 
            form: form,
            status: { not: "Graduated" }
          },
          data: {
            status: "Graduated"
          },
        });

        const promotionRecords = studentsToUpdate.map(student => ({
          studentId: student.id,
          fromForm: student.form,
          toForm: 'Graduated',
          fromStream: student.stream,
          toStream: student.stream,
          promotedBy: 'System'
        }));

        if (promotionRecords.length > 0) {
          await prisma.promotionHistory.createMany({
            data: promotionRecords
          });
        }

        return NextResponse.json({ 
          success: true, 
          message: `${updateResult.count} students graduated successfully`,
          count: updateResult.count
        });
      } else {
        const studentsToUpdate = await prisma.student.findMany({
          where: { 
            form: form,
            status: "Active"
          }
        });

        if (studentsToUpdate.length === 0) {
          return NextResponse.json({ 
            success: false, 
            error: `No active students found in ${form} to promote` 
          }, { status: 400 });
        }

        const updateResult = await prisma.student.updateMany({
          where: { 
            form: form,
            status: "Active"
          },
          data: {
            form: nextForm
          },
        });

        const promotionRecords = studentsToUpdate.map(student => ({
          studentId: student.id,
          fromForm: student.form,
          toForm: nextForm,
          fromStream: student.stream,
          toStream: student.stream,
          promotedBy: 'System'
        }));

        if (promotionRecords.length > 0) {
          await prisma.promotionHistory.createMany({
            data: promotionRecords
          });
        }

        return NextResponse.json({ 
          success: true, 
          message: `${updateResult.count} students promoted from ${form} to ${nextForm}`,
          count: updateResult.count
        });
      }
    }

    return NextResponse.json({ 
      success: false, 
      error: "Invalid action" 
    }, { status: 400 });

  } catch (error) {
    console.error("❌ PATCH Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';

// GET single fee balance by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const feeBalance = await prisma.feeBalance.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            form: true,
            stream: true,
            admissionNumber: true,
            parentPhone: true,
            email: true
          }
        },
        uploadBatch: {
          select: {
            fileName: true,
            uploadDate: true,
            uploadedBy: true,
            status: true
          }
        }
      }
    });

    if (!feeBalance) {
      return NextResponse.json(
        { success: false, message: 'Fee balance record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      feeBalance
    });
  } catch (error) {
    console.error('GET fee balance error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch fee balance record' },
      { status: 500 }
    );
  }
}

// PUT update fee balance
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    // Validate required fields
    if (!data.admissionNumber || !data.term || !data.academicYear || !data.amount) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Admission number, term, academic year, and amount are required' 
        },
        { status: 400 }
      );
    }

    if (data.amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Validate amountPaid doesn't exceed amount
    const amountPaid = data.amountPaid || 0;
    if (amountPaid > data.amount) {
      return NextResponse.json(
        { success: false, message: 'Amount paid cannot exceed total amount' },
        { status: 400 }
      );
    }

    // Check if the student exists
    const studentExists = await prisma.databaseStudent.findUnique({
      where: { admissionNumber: data.admissionNumber }
    });

    if (!studentExists) {
      return NextResponse.json(
        { success: false, message: 'Student with this admission number does not exist' },
        { status: 400 }
      );
    }

    // Calculate balance and payment status
    const balance = data.amount - amountPaid;
    const paymentStatus = balance <= 0 ? 'paid' : amountPaid > 0 ? 'partial' : 'pending';

    // Check for duplicate fee entry (same student, term, academic year)
    const existingFee = await prisma.feeBalance.findFirst({
      where: {
        admissionNumber: data.admissionNumber,
        term: data.term,
        academicYear: data.academicYear,
        NOT: { id: id }
      }
    });

    if (existingFee) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Fee entry already exists for this student, term, and academic year' 
        },
        { status: 400 }
      );
    }

    const updatedFeeBalance = await prisma.feeBalance.update({
      where: { id },
      data: {
        admissionNumber: data.admissionNumber,
        term: data.term,
        academicYear: data.academicYear,
        amount: data.amount,
        amountPaid: amountPaid,
        balance: balance,
        paymentStatus: paymentStatus,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        updatedAt: new Date()
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            form: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Fee balance updated successfully',
      feeBalance: updatedFeeBalance
    });
  } catch (error) {
    console.error('Update fee balance error:', error);
    
    // Handle Prisma not found error
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'Fee balance record not found' },
        { status: 404 }
      );
    }
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Fee entry already exists for this student, term, and academic year' 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to update fee balance' },
      { status: 500 }
    );
  }
}

// DELETE fee balance
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const deletedFeeBalance = await prisma.feeBalance.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Fee balance deleted successfully',
      feeBalance: deletedFeeBalance
    });
  } catch (error) {
    console.error('Delete fee balance error:', error);
    
    // Handle Prisma not found error
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'Fee balance record not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to delete fee balance' },
      { status: 500 }
    );
  }
}
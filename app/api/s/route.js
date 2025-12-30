import { NextResponse } from 'next/server';

// Import your Prisma client - adjust the path based on your actual structure
// If you have /lib/prisma.js:
import { prisma } from "../../../libs/prisma";

// Or if you have /libs/prisma.js:
// import { prisma } from "@/libs/prisma";

// Or create Prisma client directly:
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const format = url.searchParams.get('format') || 'json'; // 'json', 'array', or 'csv'
    const form = url.searchParams.get('form');
    const stream = url.searchParams.get('stream');
    
    // Build where clause
    const where = {
      email: {
        not: null,
        not: '' // Exclude empty strings
      }
    };
    
    // Add filters if provided
    if (form && form !== 'all') where.form = form;
    if (stream && stream !== 'all') where.stream = stream;
    
    // Get all students with emails
    const students = await prisma.databaseStudent.findMany({
      where,
      select: {
        admissionNumber: true,
        firstName: true,
        lastName: true,
        form: true,
        stream: true,
        email: true
      },
      orderBy: [
        { form: 'asc' },
        { lastName: 'asc' },
        { firstName: 'asc' }
      ]
    });
    
    // Return format based on request
    switch (format) {
      case 'array':
        // Return just email addresses as an array
        const emails = students.map(student => student.email).filter(email => email);
        return NextResponse.json({
          success: true,
          count: emails.length,
          emails: emails
        });
        
      case 'csv':
        // Return as CSV file
        let csvContent = 'Admission Number,First Name,Last Name,Form,Stream,Email\n';
        
        students.forEach(student => {
          const row = [
            student.admissionNumber || '',
            `"${student.firstName || ''}"`,
            `"${student.lastName || ''}"`,
            student.form || '',
            student.stream || '',
            `"${student.email}"`
          ].join(',');
          csvContent += row + '\n';
        });
        
        return new NextResponse(csvContent, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="student-emails-${new Date().toISOString().split('T')[0]}.csv"`
          }
        });
        
      case 'json':
      default:
        // Return full JSON response
        return NextResponse.json({
          success: true,
          count: students.length,
          data: students,
          filters: { form, stream },
          timestamp: new Date().toISOString()
        });
    }
    
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch emails',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
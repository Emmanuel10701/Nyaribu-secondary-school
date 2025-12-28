import { NextResponse } from 'next/server';
import { parse } from 'papaparse';
import * as XLSX from 'xlsx';
import { prisma } from "@/libs/prisma";

// ========== HELPER FUNCTIONS ==========

const parseAmount = (value) => {
  if (!value) return 0;
  
  const str = String(value).trim();
  const cleaned = str.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? 0 : Math.round(parsed * 100) / 100;
};

const parseDate = (dateStr) => {
  if (!dateStr) return null;
  
  const str = String(dateStr).trim();
  
  // Try Excel serial number
  if (!isNaN(str) && Number(str) > 0) {
    const excelDate = Number(str);
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  
  // Try ISO string
  let date = new Date(str);
  if (!isNaN(date.getTime())) {
    return date;
  }
  
  // Try common formats
  const formats = [
    /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/,
    /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/,
  ];
  
  for (const format of formats) {
    const match = str.match(format);
    if (match) {
      let year, month, day;
      
      if (match[0].includes('/')) {
        const parts = str.split(/[/-]/);
        if (parts.length === 3) {
          const part1 = parseInt(parts[0]);
          const part2 = parseInt(parts[1]);
          const part3 = parseInt(parts[2]);
          
          if (part3 > 31 && part1 <= 12) {
            // MM/DD/YYYY
            month = part1 - 1;
            day = part2;
            year = part3;
          } else if (part1 > 12 && part2 <= 12) {
            // DD/MM/YYYY
            day = part1;
            month = part2 - 1;
            year = part3;
          } else if (part3 > 1900) {
            // YYYY/MM/DD
            year = part3;
            month = part2 - 1;
            day = part1;
          }
        }
      } else {
        // YYYY-MM-DD
        year = parseInt(match[1]);
        month = parseInt(match[2]) - 1;
        day = parseInt(match[3]);
      }
      
      if (year && month >= 0 && day) {
        if (year < 100) year = 2000 + year;
        date = new Date(year, month, day);
        if (!isNaN(date.getTime())) {
          return date;
        }
      }
    }
  }
  
  return null;
};

const normalizeTerm = (term) => {
  if (!term) return term;
  
  const termStr = String(term).trim().toLowerCase();
  const termMap = {
    'term1': 'Term 1',
    'term 1': 'Term 1',
    '1': 'Term 1',
    'first term': 'Term 1',
    'term2': 'Term 2',
    'term 2': 'Term 2',
    '2': 'Term 2',
    'second term': 'Term 2',
    'term3': 'Term 3',
    'term 3': 'Term 3',
    '3': 'Term 3',
    'third term': 'Term 3'
  };
  
  return termMap[termStr] || termStr.charAt(0).toUpperCase() + termStr.slice(1);
};

const normalizeAcademicYear = (year) => {
  if (!year) return year;
  
  const yearStr = String(year).trim();
  if (/^\d{4}$/.test(yearStr)) {
    const startYear = parseInt(yearStr);
    return `${startYear}/${startYear + 1}`;
  }
  
  return yearStr;
};

// ========== PARSING FUNCTIONS ==========

const parseCSV = async (file) => {
  const text = await file.text();
  
  return new Promise((resolve, reject) => {
    parse(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        const normalized = header.trim().toLowerCase();
        
        // Fee balance mappings
        if (normalized.includes('admission') || normalized.includes('admno') || normalized.includes('adm')) {
          return 'admissionNumber';
        }
        if (normalized.includes('amount') || normalized.includes('balance') || normalized.includes('fee')) {
          return 'amount';
        }
        if (normalized.includes('term')) {
          return 'term';
        }
        if (normalized.includes('year') || normalized.includes('academic') || normalized.includes('session')) {
          return 'academicYear';
        }
        if (normalized.includes('paid')) {
          return 'amountPaid';
        }
        if (normalized.includes('total')) {
          return 'totalFees';
        }
        if (normalized.includes('due') && normalized.includes('date')) {
          return 'dueDate';
        }
        
        return normalized;
      },
      complete: (results) => {
        const data = results.data
          .map((row, index) => {
            try {
              const admissionNumber = String(row.admissionNumber || row.admission || row.admno || row.adm || '').trim();
              const amount = parseAmount(row.amount || row.balance || row.fee || 0);
              const amountPaid = parseAmount(row.amountPaid || row.paid || row['amount paid'] || 0);
              const balance = amount - amountPaid;
              const term = String(row.term || '').trim();
              const academicYear = String(row.academicYear || row.year || row.session || '').trim();
              const dueDate = parseDate(row.dueDate || row['due date'] || row.duedate);
              
              if (admissionNumber && amount > 0) {
                return {
                  admissionNumber,
                  amount,
                  amountPaid,
                  balance,
                  term,
                  academicYear,
                  dueDate,
                  paymentStatus: balance <= 0 ? 'paid' : amountPaid > 0 ? 'partial' : 'pending'
                };
              }
              return null;
            } catch (error) {
              console.error(`Error parsing CSV row ${index}:`, error);
              return null;
            }
          })
          .filter(item => item !== null);
        
        resolve(data);
      },
      error: reject
    });
  });
};

const parseExcel = async (file) => {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    const data = jsonData
      .map((row, index) => {
        try {
          const findValue = (possibleKeys) => {
            for (const key of possibleKeys) {
              if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
                return String(row[key]).trim();
              }
              const lowerKey = key.toLowerCase();
              for (const rowKey in row) {
                if (rowKey.toLowerCase() === lowerKey) {
                  const value = row[rowKey];
                  if (value !== undefined && value !== null && value !== '') {
                    return String(value).trim();
                  }
                }
              }
            }
            return '';
          };
          
          const admissionNumber = findValue(['admissionNumber', 'AdmissionNumber', 'Admission Number', 'ADMISSION_NUMBER', 'admno', 'AdmNo', 'AdmissionNo']);
          const amount = parseAmount(findValue(['amount', 'Amount', 'AMOUNT', 'balance', 'Balance', 'fee', 'Fee']));
          const amountPaid = parseAmount(findValue(['amountPaid', 'AmountPaid', 'Amount Paid', 'paid', 'Paid', 'PAID']));
          const balance = amount - amountPaid;
          const term = findValue(['term', 'Term', 'TERM']);
          const academicYear = findValue(['academicYear', 'AcademicYear', 'Academic Year', 'year', 'Year', 'YEAR', 'session', 'Session']);
          const dueDateStr = findValue(['dueDate', 'DueDate', 'Due Date', 'duedate']);
          const dueDate = parseDate(dueDateStr);
          
          if (admissionNumber && amount > 0) {
            return {
              admissionNumber,
              amount,
              amountPaid,
              balance,
              term,
              academicYear,
              dueDate,
              paymentStatus: balance <= 0 ? 'paid' : amountPaid > 0 ? 'partial' : 'pending'
            };
          }
          return null;
        } catch (error) {
          console.error(`Error parsing Excel row ${index}:`, error);
          return null;
        }
      })
      .filter(item => item !== null);
    
    return data;
    
  } catch (error) {
    console.error('Excel parsing error:', error);
    throw new Error(`Excel parsing failed: ${error.message}`);
  }
};

// ========== VALIDATION FUNCTIONS ==========

const validateFeeRecord = (record, index, defaultTerm, defaultAcademicYear) => {
  const errors = [];
  
  // Required fields
  if (!record.admissionNumber) {
    errors.push(`Row ${index + 2}: Admission number is required`);
  }
  
  if (record.amount <= 0) {
    errors.push(`Row ${index + 2}: Amount must be greater than 0 (got: ${record.amount})`);
  }
  
  if (record.amountPaid > record.amount) {
    errors.push(`Row ${index + 2}: Amount paid (${record.amountPaid}) cannot be greater than total amount (${record.amount})`);
  }
  
  // Set defaults if not provided in record
  if (!record.term && defaultTerm) {
    record.term = defaultTerm;
  }
  
  if (!record.academicYear && defaultAcademicYear) {
    record.academicYear = defaultAcademicYear;
  }
  
  // Normalize values
  record.term = normalizeTerm(record.term);
  record.academicYear = normalizeAcademicYear(record.academicYear);
  
  if (!record.term) {
    errors.push(`Row ${index + 2}: Term is required`);
  }
  
  if (!record.academicYear) {
    errors.push(`Row ${index + 2}: Academic year is required`);
  }
  
  return { isValid: errors.length === 0, errors };
};

// ========== PROCESSING FUNCTIONS ==========

const processFeeData = async (rawData, batchId, defaultTerm, defaultAcademicYear) => {
  const stats = {
    totalRows: rawData.length,
    validRows: 0,
    skippedRows: 0,
    errorRows: 0,
    errors: []
  };
  
  const validRecords = [];
  const seenCombinations = new Set();
  
  // Get all admission numbers from raw data
  const admissionNumbers = rawData
    .map(r => r.admissionNumber)
    .filter(Boolean)
    .filter((value, index, self) => self.indexOf(value) === index);
  
  // Get all existing students
  const existingStudents = await prisma.databaseStudent.findMany({
    where: {
      admissionNumber: {
        in: admissionNumbers
      },
      status: 'active'
    },
    select: { admissionNumber: true }
  });
  
  const existingAdmissionNumbers = new Set(
    existingStudents.map(s => s.admissionNumber)
  );
  
  // Check for missing students
  const missingStudents = admissionNumbers.filter(
    num => !existingAdmissionNumbers.has(num)
  );
  
  if (missingStudents.length > 0) {
    stats.errors.push(
      `The following students do not exist in the system: ${missingStudents.slice(0, 5).join(', ')}${missingStudents.length > 5 ? '...' : ''}. Please upload students first.`
    );
  }
  
  // Process each record
  for (const [index, record] of rawData.entries()) {
    const validation = validateFeeRecord(record, index, defaultTerm, defaultAcademicYear);
    
    if (!validation.isValid) {
      stats.errorRows++;
      stats.errors.push(...validation.errors);
      continue;
    }
    
    // Check if student exists
    if (!existingAdmissionNumbers.has(record.admissionNumber)) {
      stats.skippedRows++;
      stats.errors.push(`Row ${index + 2}: Student with admission number ${record.admissionNumber} not found. Student must be uploaded first.`);
      continue;
    }
    
    // Check for duplicate admissionNumber+term+academicYear in this upload
    const uniqueKey = `${record.admissionNumber}-${record.term}-${record.academicYear}`;
    if (seenCombinations.has(uniqueKey)) {
      stats.skippedRows++;
      stats.errors.push(`Row ${index + 2}: Duplicate fee entry for ${record.admissionNumber} in ${record.term} ${record.academicYear}`);
      continue;
    }
    seenCombinations.add(uniqueKey);
    
    validRecords.push(record);
    stats.validRows++;
  }
  
  // Process valid records
  if (validRecords.length > 0) {
    const CHUNK_SIZE = 50;
    
    for (let i = 0; i < validRecords.length; i += CHUNK_SIZE) {
      const chunk = validRecords.slice(i, i + CHUNK_SIZE);
      
      try {
        // Process each record individually
        for (const record of chunk) {
          try {
            // Check if fee balance already exists for this student-term-year
            const existingFee = await prisma.feeBalance.findUnique({
              where: {
                admissionNumber_term_academicYear: {
                  admissionNumber: record.admissionNumber,
                  term: record.term,
                  academicYear: record.academicYear
                }
              }
            });
            
            if (existingFee) {
              // Update existing fee balance
              await prisma.feeBalance.update({
                where: { id: existingFee.id },
                data: {
                  amount: record.amount,
                  amountPaid: record.amountPaid,
                  balance: record.balance,
                  paymentStatus: record.paymentStatus,
                  dueDate: record.dueDate,
                  updatedAt: new Date(),
                  uploadBatchId: batchId
                }
              });
            } else {
              // Create new fee balance
              await prisma.feeBalance.create({
                data: {
                  admissionNumber: record.admissionNumber,
                  term: record.term,
                  academicYear: record.academicYear,
                  amount: record.amount,
                  amountPaid: record.amountPaid,
                  balance: record.balance,
                  paymentStatus: record.paymentStatus,
                  dueDate: record.dueDate,
                  uploadBatchId: batchId
                }
              });
            }
          } catch (singleError) {
            console.error(`Failed to process record for ${record.admissionNumber}:`, singleError);
            stats.validRows--;
            stats.errorRows++;
            stats.errors.push(`Failed to save fee for ${record.admissionNumber}: ${singleError.message}`);
          }
        }
      } catch (chunkError) {
        console.error(`Error processing chunk starting at ${i}:`, chunkError);
        stats.errorRows += chunk.length;
        stats.errors.push(`Failed to process chunk: ${chunkError.message}`);
      }
      
      // Add delay between chunks
      if (i + CHUNK_SIZE < validRecords.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }
  
  return { stats, validRecords };
};

// ========== STATISTICS FUNCTIONS ==========

const calculateFeeStatistics = async (whereClause = {}) => {
  try {
    const summaryStats = await prisma.feeBalance.aggregate({
      _sum: {
        amount: true,
        amountPaid: true,
        balance: true
      },
      _count: {
        _all: true
      },
      where: whereClause
    });
    
    // Get payment status distribution
    const statusDistribution = await prisma.feeBalance.groupBy({
      by: ['paymentStatus'],
      where: whereClause,
      _count: {
        id: true
      }
    });
    
    // Get term distribution
    const termDistribution = await prisma.feeBalance.groupBy({
      by: ['term'],
      where: whereClause,
      _count: {
        id: true
      }
    });
    
    // Get academic year distribution
    const yearDistribution = await prisma.feeBalance.groupBy({
      by: ['academicYear'],
      where: whereClause,
      _count: {
        id: true
      }
    });
    
    return {
      summary: {
        totalAmount: summaryStats._sum.amount || 0,
        totalPaid: summaryStats._sum.amountPaid || 0,
        totalBalance: summaryStats._sum.balance || 0,
        totalRecords: summaryStats._count._all || 0
      },
      distribution: {
        paymentStatus: statusDistribution.map(s => ({
          status: s.paymentStatus,
          count: s._count.id
        })),
        term: termDistribution.map(t => ({
          term: t.term,
          count: t._count.id
        })),
        academicYear: yearDistribution.map(y => ({
          academicYear: y.academicYear,
          count: y._count.id
        }))
      }
    };
  } catch (error) {
    console.error('Error calculating fee statistics:', error);
    throw error;
  }
};

// ========== DATA CONSISTENCY FUNCTIONS ==========

const checkFeeDataConsistency = async () => {
  try {
    // Get total number of students
    const totalStudents = await prisma.databaseStudent.count({
      where: { status: 'active' }
    });
    
    // Get unique students with fee balances
    const studentsWithFees = await prisma.feeBalance.groupBy({
      by: ['admissionNumber'],
      _count: { id: true }
    });
    
    // Count fee balances per student
    const feeDistribution = await prisma.feeBalance.groupBy({
      by: ['admissionNumber'],
      _count: { id: true },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    });
    
    // Find orphaned fee balances (no student)
    const orphanedFees = await prisma.feeBalance.findMany({
      where: {
        student: null
      },
      select: {
        id: true,
        admissionNumber: true,
        term: true,
        academicYear: true
      }
    });
    
    // Find students without any fee balances
    const studentsWithoutFees = await prisma.databaseStudent.findMany({
      where: {
        status: 'active',
        feeBalances: {
          none: {}
        }
      },
      select: {
        admissionNumber: true,
        firstName: true,
        lastName: true,
        form: true
      }
    });
    
    return {
      totalStudents,
      studentsWithFees: studentsWithFees.length,
      totalFeeBalances: feeDistribution.reduce((sum, item) => sum + item._count.id, 0),
      averageFeesPerStudent: feeDistribution.length > 0 
        ? (feeDistribution.reduce((sum, item) => sum + item._count.id, 0) / feeDistribution.length).toFixed(2)
        : 0,
      maxFeesPerStudent: feeDistribution.length > 0 ? feeDistribution[0]._count.id : 0,
      orphanedFees: orphanedFees.length,
      orphanedFeesDetails: orphanedFees.slice(0, 10),
      studentsWithoutFees: studentsWithoutFees.length,
      studentsWithoutFeesDetails: studentsWithoutFees.slice(0, 10),
      feeDistributionSummary: feeDistribution.slice(0, 10)
    };
  } catch (error) {
    console.error('Fee data consistency check error:', error);
    throw error;
  }
};

const cleanupOrphanedFeeBalances = async () => {
  try {
    // Find all fee balances where student doesn't exist
    const orphanedFees = await prisma.feeBalance.findMany({
      where: {
        student: null
      },
      select: {
        id: true,
        admissionNumber: true,
        term: true,
        academicYear: true
      }
    });
    
    if (orphanedFees.length === 0) {
      return {
        success: true,
        message: 'No orphaned fee balances found',
        deletedCount: 0
      };
    }
    
    // Delete orphaned fee balances
    const deleted = await prisma.feeBalance.deleteMany({
      where: {
        id: {
          in: orphanedFees.map(fee => fee.id)
        }
      }
    });
    
    return {
      success: true,
      message: `Cleaned up ${deleted.count} orphaned fee balances`,
      deletedCount: deleted.count,
      details: orphanedFees
    };
  } catch (error) {
    console.error('Cleanup error:', error);
    throw error;
  }
};

// ========== API ENDPOINTS ==========

// POST - Upload fee balances
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const term = formData.get('term') || '';
    const academicYear = formData.get('academicYear') || '';
    const uploadedBy = formData.get('uploadedBy') || 'System';
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Validate required fields
    if (!term || !academicYear) {
      return NextResponse.json(
        { success: false, error: 'Term and academic year are required' },
        { status: 400 }
      );
    }
    
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.split('.').pop();
    
    if (!['csv', 'xlsx', 'xls'].includes(fileExtension)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Please upload CSV or Excel files.' },
        { status: 400 }
      );
    }
    
    // Normalize inputs
    const normalizedTerm = normalizeTerm(term);
    const normalizedAcademicYear = normalizeAcademicYear(academicYear);
    
    // Create batch record
    const batchId = `FEE_BATCH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const uploadBatch = await prisma.feeBalanceUpload.create({
      data: {
        id: batchId,
        fileName: file.name,
        fileType: fileExtension,
        uploadedBy,
        term: normalizedTerm,
        academicYear: normalizedAcademicYear,
        status: 'processing'
      }
    });
    
    try {
      // Parse file
      let rawData = [];
      
      if (fileExtension === 'csv') {
        rawData = await parseCSV(file);
      } else {
        rawData = await parseExcel(file);
      }
      
      if (rawData.length === 0) {
        throw new Error('No valid fee data found in file');
      }
      
      // Process data
      const { stats, validRecords } = await processFeeData(rawData, batchId, normalizedTerm, normalizedAcademicYear);
      
      // Calculate summary statistics
      const totalAmount = validRecords.length > 0 ? validRecords.reduce((sum, record) => sum + record.amount, 0) : 0;
      const totalPaid = validRecords.length > 0 ? validRecords.reduce((sum, record) => sum + record.amountPaid, 0) : 0;
      const totalBalance = validRecords.length > 0 ? validRecords.reduce((sum, record) => sum + record.balance, 0) : 0;
      
      // Update batch status
      await prisma.feeBalanceUpload.update({
        where: { id: batchId },
        data: {
          status: 'completed',
          processedDate: new Date(),
          totalRows: stats.totalRows,
          validRows: stats.validRows,
          skippedRows: stats.skippedRows,
          errorRows: stats.errorRows,
          errorLog: stats.errors.length > 0 ? stats.errors.slice(0, 50) : null
        }
      });
      
      return NextResponse.json({
        success: true,
        message: `Successfully processed ${stats.validRows} fee records`,
        batch: {
          id: batchId,
          fileName: uploadBatch.fileName,
          term: normalizedTerm,
          academicYear: normalizedAcademicYear,
          status: 'completed'
        },
        summary: {
          totalAmount,
          totalPaid,
          totalBalance,
          totalRecords: stats.validRows
        },
        statistics: {
          total: stats.totalRows,
          valid: stats.validRows,
          skipped: stats.skippedRows,
          errors: stats.errorRows
        },
        errors: stats.errors.slice(0, 10)
      });
      
    } catch (error) {
      console.error('Processing error:', error);
      
      // Update batch as failed
      await prisma.feeBalanceUpload.update({
        where: { id: batchId },
        data: {
          status: 'failed',
          processedDate: new Date(),
          errorRows: 1,
          errorLog: [error.message]
        }
      });
      
      throw error;
    }
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Fee balance upload failed'
      },
      { status: 500 }
    );
  }
}

// GET - Retrieve fee balances and upload history
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const admissionNumber = url.searchParams.get('admissionNumber');
    const term = url.searchParams.get('term');
    const academicYear = url.searchParams.get('academicYear');
    const paymentStatus = url.searchParams.get('paymentStatus');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const includeStudent = url.searchParams.get('includeStudent') === 'true';
    
    // Get upload history
    if (action === 'uploads') {
      const uploads = await prisma.feeBalanceUpload.findMany({
        orderBy: { uploadDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: {
            select: { feeBalances: true }
          }
        }
      });
      
      const total = await prisma.feeBalanceUpload.count();
      
      return NextResponse.json({
        success: true,
        uploads: uploads.map(upload => ({
          id: upload.id,
          fileName: upload.fileName,
          fileType: upload.fileType,
          status: upload.status,
          uploadedBy: upload.uploadedBy,
          uploadDate: upload.uploadDate,
          processedDate: upload.processedDate,
          totalRows: upload.totalRows,
          validRows: upload.validRows,
          skippedRows: upload.skippedRows,
          errorRows: upload.errorRows,
          term: upload.term,
          academicYear: upload.academicYear,
          feeCount: upload._count.feeBalances
        })),
        pagination: { 
          page, 
          limit, 
          total, 
          pages: Math.ceil(total / limit) 
        }
      });
    }
    
    // Get statistics
    if (action === 'stats') {
      const feeStats = await calculateFeeStatistics({});
      
      return NextResponse.json({
        success: true,
        data: feeStats
      });
    }
    
    // Check data consistency
    if (action === 'consistency-check') {
      const consistency = await checkFeeDataConsistency();
      return NextResponse.json({
        success: true,
        consistency
      });
    }
    
    // Get fee balances for a specific student
    if (action === 'student-fees' && admissionNumber) {
      const [feeBalances, student] = await Promise.all([
        prisma.feeBalance.findMany({
          where: { admissionNumber },
          orderBy: { updatedAt: 'desc' }
        }),
        includeStudent ? prisma.databaseStudent.findUnique({
          where: { admissionNumber },
          select: {
            firstName: true,
            lastName: true,
            form: true,
            stream: true,
            parentPhone: true,
            email: true
          }
        }) : Promise.resolve(null)
      ]);
      
      // Calculate student summary
      const studentSummary = feeBalances.reduce((acc, fee) => ({
        totalAmount: acc.totalAmount + fee.amount,
        totalPaid: acc.totalPaid + fee.amountPaid,
        totalBalance: acc.totalBalance + fee.balance,
        recordCount: acc.recordCount + 1
      }), { totalAmount: 0, totalPaid: 0, totalBalance: 0, recordCount: 0 });
      
      return NextResponse.json({
        success: true,
        student,
        feeBalances,
        summary: studentSummary
      });
    }
    
    // Default: Get fee balances with filters
    const where = {};
    
    if (admissionNumber) {
      where.admissionNumber = admissionNumber;
    }
    
    if (term) {
      where.term = term;
    }
    
    if (academicYear) {
      where.academicYear = academicYear;
    }
    
    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }
    
    // Get fee balances with student info
    const [feeBalances, total] = await Promise.all([
      prisma.feeBalance.findMany({
        where,
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
              form: true,
              stream: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.feeBalance.count({ where })
    ]);
    
    // Calculate summary
    const summary = await prisma.feeBalance.aggregate({
      where,
      _sum: {
        amount: true,
        amountPaid: true,
        balance: true
      },
      _count: {
        _all: true
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        feeBalances,
        summary: {
          totalAmount: summary._sum.amount || 0,
          totalPaid: summary._sum.amountPaid || 0,
          totalBalance: summary._sum.balance || 0,
          totalRecords: summary._count._all || 0
        },
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch fee balances'
      },
      { status: 500 }
    );
  }
}

// PUT - Update a fee balance
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Fee balance ID is required' },
        { status: 400 }
      );
    }
    
    // Calculate balance if amount or amountPaid is updated
    if (updateData.amount !== undefined || updateData.amountPaid !== undefined) {
      const currentFee = await prisma.feeBalance.findUnique({
        where: { id }
      });
      
      if (!currentFee) {
        return NextResponse.json(
          { success: false, error: 'Fee balance not found' },
          { status: 404 }
        );
      }
      
      const newAmount = updateData.amount !== undefined ? updateData.amount : currentFee.amount;
      const newAmountPaid = updateData.amountPaid !== undefined ? updateData.amountPaid : currentFee.amountPaid;
      const newBalance = newAmount - newAmountPaid;
      
      updateData.balance = newBalance;
      updateData.paymentStatus = newBalance <= 0 ? 'paid' : newAmountPaid > 0 ? 'partial' : 'pending';
    }
    
    // Update fee balance
    const updatedFee = await prisma.feeBalance.update({
      where: { id },
      data: {
        ...updateData,
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
      data: updatedFee
    });
    
  } catch (error) {
    console.error('PUT error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Fee balance not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Update failed'
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete fee balance or upload batch
export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const batchId = url.searchParams.get('batchId');
    const feeId = url.searchParams.get('feeId');
    const action = url.searchParams.get('action');
    
    // Cleanup orphaned fee balances
    if (action === 'cleanup-orphaned') {
      const result = await cleanupOrphanedFeeBalances();
      return NextResponse.json(result);
    }
    
    if (batchId) {
      // Delete fee balance upload batch and associated records
      const result = await prisma.$transaction(async (tx) => {
        const batch = await tx.feeBalanceUpload.findUnique({
          where: { id: batchId }
        });
        
        if (!batch) {
          throw new Error('Batch not found');
        }
        
        // Get fee balances from this batch
        const batchFees = await tx.feeBalance.findMany({
          where: { uploadBatchId: batchId },
          select: { admissionNumber: true, term: true, academicYear: true }
        });
        
        // Delete fee balances
        await tx.feeBalance.deleteMany({
          where: { uploadBatchId: batchId }
        });
        
        // Delete batch
        await tx.feeBalanceUpload.delete({
          where: { id: batchId }
        });
        
        return { batch, deletedCount: batchFees.length };
      }, {
        maxWait: 15000,
        timeout: 15000
      });
      
      return NextResponse.json({
        success: true,
        message: `Deleted fee batch ${result.batch.fileName} and ${result.deletedCount} fee records`
      });
    }
    
    if (feeId) {
      // Delete single fee balance
      const fee = await prisma.feeBalance.findUnique({
        where: { id: feeId }
      });
      
      if (!fee) {
        return NextResponse.json(
          { success: false, error: 'Fee balance not found' },
          { status: 404 }
        );
      }
      
      await prisma.feeBalance.delete({
        where: { id: feeId }
      });
      
      return NextResponse.json({
        success: true,
        message: `Deleted fee balance for ${fee.admissionNumber} (${fee.term} ${fee.academicYear})`
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Provide batchId or feeId' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Delete failed' },
      { status: 500 }
    );
  }
}
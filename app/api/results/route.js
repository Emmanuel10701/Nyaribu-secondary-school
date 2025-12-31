import { NextResponse } from 'next/server';
import { parse } from 'papaparse';
import * as XLSX from 'xlsx';
import { prisma } from "../../../libs/prisma";

// ========== HELPER FUNCTIONS ==========

const parseScore = (value) => {
  if (!value && value !== 0) return null;
  
  const str = String(value).trim();
  const cleaned = str.replace(/[^\d.]/g, '');
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? null : Math.round(parsed * 100) / 100;
};

const calculateGrade = (score) => {
  if (score === null) return null;
  
  if (score >= 80) return 'A';
  if (score >= 70) return 'A-';
  if (score >= 60) return 'B+';
  if (score >= 55) return 'B';
  if (score >= 50) return 'B-';
  if (score >= 45) return 'C+';
  if (score >= 40) return 'C';
  if (score >= 35) return 'C-';
  if (score >= 30) return 'D+';
  if (score >= 25) return 'D';
  return 'E';
};

const calculatePoints = (score, subjectType = 'main') => {
  if (score === null) return null;
  
  const grade = calculateGrade(score);
  const pointMap = {
    'A': subjectType === 'main' ? 12 : 7,
    'A-': subjectType === 'main' ? 11 : 6,
    'B+': subjectType === 'main' ? 10 : 5,
    'B': subjectType === 'main' ? 9 : 4,
    'B-': subjectType === 'main' ? 8 : 3,
    'C+': subjectType === 'main' ? 7 : 2,
    'C': subjectType === 'main' ? 6 : 1,
    'C-': subjectType === 'main' ? 5 : 0,
    'D+': subjectType === 'main' ? 4 : 0,
    'D': subjectType === 'main' ? 3 : 0,
    'E': 0
  };
  
  return pointMap[grade] || 0;
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
  
  if (/^\d{4}\/\d{4}$/.test(yearStr)) {
    return yearStr;
  }
  
  return yearStr;
};

// Subject name normalization mapping
const normalizeSubjectName = (subjectName) => {
  if (!subjectName) return '';
  
  const lowerName = subjectName.toLowerCase().trim();
  
  const subjectMap = {
    'english': 'English',
    'kiswahili': 'Kiswahili',
    'mathematics': 'Mathematics',
    'biology': 'Biology',
    'chemistry': 'Chemistry',
    'physics': 'Physics',
    'history': 'History',
    'geography': 'Geography',
    'cre': 'CRE',
    'business studies': 'Business Studies',
    'business': 'Business Studies',
    'bus': 'Business Studies',
    'agriculture': 'Agriculture',
    'agric': 'Agriculture',
    'computer studies': 'Computer Studies',
    'computer': 'Computer Studies',
    'comp': 'Computer Studies'
  };
  
  // Check for exact matches
  if (subjectMap[lowerName]) {
    return subjectMap[lowerName];
  }
  
  // Check for partial matches
  for (const [key, value] of Object.entries(subjectMap)) {
    if (lowerName.includes(key)) {
      return value;
    }
  }
  
  // If no match, capitalize properly
  return subjectName
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Debug function
const debugFileStructure = async (file, fileExtension) => {
  console.log('=== DEBUG FILE STRUCTURE ===');
  console.log(`File: ${file.name}, Type: ${fileExtension}`);
  
  if (fileExtension === 'csv') {
    const text = await file.text();
    const lines = text.split('\n');
    console.log(`Total lines: ${lines.length}`);
    console.log('First 3 lines:', lines.slice(0, 3));
    
    if (lines.length > 0) {
      const headers = lines[0].split(',');
      console.log('Headers count:', headers.length);
      console.log('First 10 headers:', headers.slice(0, 10));
      console.log('Header format sample:', headers.filter(h => h.includes('_Score')).slice(0, 5));
    }
  }
  console.log('=== END DEBUG ===');
};

// ========== UPDATED PARSING FUNCTIONS ==========

const parseResultsCSV = async (file) => {
  const text = await file.text();
  
  console.log('=== CSV PARSING START ===');
  const lines = text.split('\n');
  console.log(`File has ${lines.length} lines`);
  console.log('First 3 lines:', lines.slice(0, 3));
  
  return new Promise((resolve, reject) => {
    parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log('Parsed CSV headers:', results.meta.fields);
        console.log('First row sample data:', JSON.stringify(results.data[0], null, 2));
        
        const data = results.data
          .map((row, index) => {
            try {
              // Get basic info with flexible column names
              const admissionNumber = row.admissionNumber || row.admissionnumber || 
                                    Object.values(row).find(val => /^3[0-5]\d{2}$/.test(String(val))) || '';
              const form = row.form || '';
              const term = row.term || '';
              const academicYear = row.academicYear || row.academicyear || '';
              
              console.log(`\nRow ${index + 2}: Admission=${admissionNumber}, Form=${form}, Term=${term}, Year=${academicYear}`);
              
              if (!admissionNumber || !form || !term || !academicYear) {
                console.log(`Skipping row ${index + 2}: Missing required fields`);
                return null;
              }
              
              // Collect subject data from the specific format
              const subjects = [];
              const processedSubjects = new Set();
              
              // Look for subject score columns (ending with _Score)
              for (const [columnName, value] of Object.entries(row)) {
                const columnStr = String(columnName).trim();
                
                // Check if this is a subject score column
                if (columnStr.endsWith('_Score') || columnStr.toLowerCase().endsWith(' score')) {
                  // Extract subject name by removing _Score suffix
                  let subjectName = columnStr.replace(/_Score$/i, '').replace(/ score$/i, '').trim();
                  
                  // Skip if already processed
                  if (processedSubjects.has(subjectName.toLowerCase())) {
                    continue;
                  }
                  
                  // Get the score
                  const score = parseScore(value);
                  if (score === null || score < 0 || score > 100) {
                    console.log(`Invalid score for ${subjectName}: ${value}`);
                    continue;
                  }
                  
                  // Get grade, points, and comment from corresponding columns
                  const grade = row[`${subjectName}_Grade`] || 
                               row[`${subjectName} Grade`] || 
                               calculateGrade(score);
                  
                  const points = row[`${subjectName}_Points`] ? 
                                parseFloat(row[`${subjectName}_Points`]) :
                                row[`${subjectName} Points`] ?
                                parseFloat(row[`${subjectName} Points`]) :
                                calculatePoints(score);
                  
                  const comment = row[`${subjectName}_Comment`] || 
                                 row[`${subjectName} Comment`] || 
                                 '';
                  
                  // Normalize subject name
                  const normalizedSubject = normalizeSubjectName(subjectName);
                  
                  subjects.push({
                    subject: normalizedSubject,
                    score: score,
                    grade: String(grade).trim(),
                    points: typeof points === 'number' ? points : (parseFloat(points) || 0),
                    comment: String(comment).trim()
                  });
                  
                  processedSubjects.add(subjectName.toLowerCase());
                  console.log(`  Found subject: ${normalizedSubject} (${score}%, ${grade}, ${points} points)`);
                }
              }
              
              // Also check for simple subject name columns (without suffix)
              for (const [columnName, value] of Object.entries(row)) {
                const columnStr = String(columnName).trim();
                const lowerCol = columnStr.toLowerCase();
                
                // Skip columns we know aren't subjects
                if (lowerCol.includes('admission') || lowerCol.includes('form') || 
                    lowerCol.includes('term') || lowerCol.includes('year') ||
                    lowerCol.includes('total') || lowerCol.includes('average') ||
                    lowerCol.includes('grade') || lowerCol.includes('points') ||
                    lowerCol.includes('comment') || lowerCol.includes('position') ||
                    lowerCol.includes('stream') || lowerCol.includes('exam') ||
                    lowerCol.includes('status') || lowerCol.includes('date') ||
                    lowerCol.includes('remark')) {
                  continue;
                }
                
                // Check if this might be a subject column (has a score value)
                const score = parseScore(value);
                if (score !== null && score >= 0 && score <= 100) {
                  // Check if this subject was already processed in the _Score format
                  const normalizedCol = normalizeSubjectName(columnStr);
                  if (!processedSubjects.has(normalizedCol.toLowerCase())) {
                    subjects.push({
                      subject: normalizedCol,
                      score: score,
                      grade: calculateGrade(score),
                      points: calculatePoints(score),
                      comment: ''
                    });
                    
                    processedSubjects.add(normalizedCol.toLowerCase());
                    console.log(`  Found simple subject: ${normalizedCol} (${score}%)`);
                  }
                }
              }
              
              console.log(`Row ${index + 2}: Total subjects found: ${subjects.length}`);
              
              if (subjects.length === 0) {
                console.log(`Skipping row ${index + 2}: No valid subjects found`);
                return null;
              }
              
              return {
                admissionNumber: String(admissionNumber).trim(),
                form: form.startsWith('Form ') ? form : `Form ${form}`,
                term: term.startsWith('Term ') ? term : `Term ${term}`,
                academicYear: String(academicYear).trim(),
                subjects
              };
            } catch (error) {
              console.error(`Error parsing CSV row ${index + 2}:`, error);
              console.error('Row data:', row);
              return null;
            }
          })
          .filter(item => item !== null);
        
        console.log(`\n=== CSV PARSING END: ${data.length} valid rows ===`);
        if (data.length > 0) {
          console.log('Sample parsed record:', JSON.stringify(data[0], null, 2));
        }
        resolve(data);
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        reject(error);
      }
    });
  });
};

const parseResultsExcel = async (file) => {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    
    console.log('=== EXCEL PARSING START ===');
    console.log('First row:', jsonData[0]);
    
    const data = jsonData
      .map((row, index) => {
        try {
          console.log(`\nProcessing Excel row ${index + 2}`);
          
          // Get basic info
          const admissionNumber = row.admissionNumber || row.admissionnumber || 
                                Object.values(row).find(val => /^3[0-5]\d{2}$/.test(String(val))) || '';
          const form = row.form || '';
          const term = row.term || '';
          const academicYear = row.academicYear || row.academicyear || '';
          
          console.log(`Row ${index + 2}: Admission=${admissionNumber}, Form=${form}, Term=${term}, Year=${academicYear}`);
          
          if (!admissionNumber || !form || !term || !academicYear) {
            console.log(`Skipping row ${index + 2}: Missing required fields`);
            return null;
          }
          
          // Collect subject data
          const subjects = [];
          const processedSubjects = new Set();
          
          // Look for subject score columns
          for (const [columnName, value] of Object.entries(row)) {
            const columnStr = String(columnName).trim();
            
            // Check if this is a subject score column
            if (columnStr.endsWith('_Score') || columnStr.toLowerCase().endsWith(' score')) {
              let subjectName = columnStr.replace(/_Score$/i, '').replace(/ score$/i, '').trim();
              
              if (processedSubjects.has(subjectName.toLowerCase())) {
                continue;
              }
              
              const score = parseScore(value);
              if (score === null || score < 0 || score > 100) {
                continue;
              }
              
              // Get related data
              const grade = row[`${subjectName}_Grade`] || 
                           row[`${subjectName} Grade`] || 
                           calculateGrade(score);
              
              const points = row[`${subjectName}_Points`] ? 
                            parseFloat(row[`${subjectName}_Points`]) :
                            row[`${subjectName} Points`] ?
                            parseFloat(row[`${subjectName} Points`]) :
                            calculatePoints(score);
              
              const comment = row[`${subjectName}_Comment`] || 
                             row[`${subjectName} Comment`] || 
                             '';
              
              const normalizedSubject = normalizeSubjectName(subjectName);
              
              subjects.push({
                subject: normalizedSubject,
                score: score,
                grade: String(grade).trim(),
                points: typeof points === 'number' ? points : (parseFloat(points) || 0),
                comment: String(comment).trim()
              });
              
              processedSubjects.add(subjectName.toLowerCase());
            }
          }
          
          // Check for simple subject columns
          for (const [columnName, value] of Object.entries(row)) {
            const columnStr = String(columnName).trim();
            const lowerCol = columnStr.toLowerCase();
            
            // Skip non-subject columns
            if (lowerCol.includes('admission') || lowerCol.includes('form') || 
                lowerCol.includes('term') || lowerCol.includes('year') ||
                lowerCol.includes('total') || lowerCol.includes('average') ||
                lowerCol.includes('grade') || lowerCol.includes('points') ||
                lowerCol.includes('comment') || lowerCol.includes('position') ||
                lowerCol.includes('stream') || lowerCol.includes('exam') ||
                lowerCol.includes('status') || lowerCol.includes('date') ||
                lowerCol.includes('remark')) {
              continue;
            }
            
            const score = parseScore(value);
            if (score !== null && score >= 0 && score <= 100) {
              const normalizedCol = normalizeSubjectName(columnStr);
              if (!processedSubjects.has(normalizedCol.toLowerCase())) {
                subjects.push({
                  subject: normalizedCol,
                  score: score,
                  grade: calculateGrade(score),
                  points: calculatePoints(score),
                  comment: ''
                });
                
                processedSubjects.add(normalizedCol.toLowerCase());
              }
            }
          }
          
          console.log(`Row ${index + 2}: Found ${subjects.length} subjects`);
          
          if (subjects.length === 0) {
            return null;
          }
          
          return {
            admissionNumber: String(admissionNumber).trim(),
            form: form.startsWith('Form ') ? form : `Form ${form}`,
            term: term.startsWith('Term ') ? term : `Term ${term}`,
            academicYear: String(academicYear).trim(),
            subjects
          };
        } catch (error) {
          console.error(`Error parsing Excel row ${index + 2}:`, error);
          return null;
        }
      })
      .filter(item => item !== null);
    
    console.log(`=== EXCEL PARSING END: ${data.length} valid rows ===`);
    return data;
    
  } catch (error) {
    console.error('Excel parsing error:', error);
    throw new Error(`Excel parsing failed: ${error.message}`);
  }
};

// ========== POST ENDPOINT - UPLOAD RESULTS ==========

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
    
    console.log(`Uploading: ${fileName}, Term: ${normalizedTerm}, Year: ${normalizedAcademicYear}`);
    
    // Debug file structure
    await debugFileStructure(file, fileExtension);
    
    // Create batch record
    const batchId = `RESULT_BATCH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const uploadBatch = await prisma.resultUpload.create({
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
        console.log('Parsing CSV file...');
        rawData = await parseResultsCSV(file);
      } else {
        console.log('Parsing Excel file...');
        rawData = await parseResultsExcel(file);
      }
      
      console.log(`Parsed ${rawData.length} records from file`);
      
      if (rawData.length === 0) {
        // Get more debug info
        if (fileExtension === 'csv') {
          const text = await file.text();
          const lines = text.split('\n');
          console.log(`File has ${lines.length} lines`);
          console.log('First 3 lines:', lines.slice(0, 3));
          console.log('First row columns:', lines[0]?.split(','));
        }
        
        throw new Error(`No valid result data found in file. Parsed ${rawData.length} records. Please check file format.`);
      }
      
      // Process each record
      const stats = {
        totalRows: rawData.length,
        validRows: 0,
        skippedRows: 0,
        errorRows: 0,
        errors: []
      };
      
      for (const [index, record] of rawData.entries()) {
        try {
          console.log(`Processing ${index + 1}/${rawData.length}: ${record.admissionNumber} - ${record.form}`);
          
          // Validate required fields
          if (!record.admissionNumber) {
            stats.skippedRows++;
            stats.errors.push(`Row ${index + 2}: Missing admission number`);
            continue;
          }
          
          if (!record.form) {
            stats.skippedRows++;
            stats.errors.push(`Row ${index + 2}: Missing form`);
            continue;
          }
          
          if (!record.subjects || record.subjects.length === 0) {
            stats.skippedRows++;
            stats.errors.push(`Row ${index + 2}: No subject scores found`);
            continue;
          }
          
          // Check if student exists
          const student = await prisma.databaseStudent.findUnique({
            where: { admissionNumber: record.admissionNumber }
          });
          
          if (!student) {
            stats.skippedRows++;
            stats.errors.push(`Row ${index + 2}: Student ${record.admissionNumber} not found in database`);
            continue;
          }
          
          // Clean subjects - filter out non-subject entries
          const cleanSubjects = record.subjects
            .map(subject => ({
              subject: subject.subject,
              score: Math.max(0, Math.min(100, subject.score || 0)),
              grade: subject.grade || calculateGrade(subject.score || 0),
              points: subject.points || calculatePoints(subject.score || 0),
              comment: subject.comment || ''
            }))
            .filter(subject => 
              subject.subject && 
              !subject.subject.toLowerCase().includes('admission') &&
              !subject.subject.toLowerCase().includes('total') &&
              !subject.subject.toLowerCase().includes('average') &&
              !subject.subject.toLowerCase().includes('position') &&
              !subject.subject.toLowerCase().includes('date')
            );
          
          if (cleanSubjects.length === 0) {
            stats.skippedRows++;
            stats.errors.push(`Row ${index + 2}: No valid subjects after cleaning`);
            continue;
          }
          
          // Check for existing result
          const existingResult = await prisma.studentResult.findFirst({
            where: {
              admissionNumber: record.admissionNumber,
              term: normalizedTerm,
              academicYear: normalizedAcademicYear
            }
          });
          
          if (existingResult) {
            // Update existing result
            await prisma.studentResult.update({
              where: { id: existingResult.id },
              data: {
                subjects: cleanSubjects,
                updatedAt: new Date(),
                uploadBatchId: batchId
              }
            });
            console.log(`✓ Updated: ${record.admissionNumber}`);
          } else {
            // Create new result
            await prisma.studentResult.create({
              data: {
                admissionNumber: record.admissionNumber,
                form: record.form,
                term: normalizedTerm,
                academicYear: normalizedAcademicYear,
                subjects: cleanSubjects,
                uploadBatchId: batchId
              }
            });
            console.log(`✓ Created: ${record.admissionNumber}`);
          }
          
          stats.validRows++;
          
        } catch (error) {
          stats.errorRows++;
          const errorMsg = `Row ${index + 2}: ${error.message}`;
          stats.errors.push(errorMsg);
          console.error(`✗ Error: ${errorMsg}`);
        }
      }
      
      // Update batch status
      await prisma.resultUpload.update({
        where: { id: batchId },
        data: {
          status: stats.validRows > 0 ? 'completed' : 'failed',
          processedDate: new Date(),
          totalRows: stats.totalRows,
          validRows: stats.validRows,
          skippedRows: stats.skippedRows,
          errorRows: stats.errorRows,
          errorLog: stats.errors.length > 0 ? stats.errors.slice(0, 50) : null
        }
      });
      
      const response = {
        success: stats.validRows > 0,
        message: stats.validRows > 0 
          ? `Successfully processed ${stats.validRows} out of ${stats.totalRows} records`
          : `Failed to process any records.`,
        batch: {
          id: batchId,
          fileName: uploadBatch.fileName,
          term: normalizedTerm,
          academicYear: normalizedAcademicYear,
          status: stats.validRows > 0 ? 'completed' : 'failed'
        },
        statistics: {
          total: stats.totalRows,
          valid: stats.validRows,
          skipped: stats.skippedRows,
          errors: stats.errorRows
        },
        errors: stats.errors.slice(0, 10)
      };
      
      if (rawData.length > 0) {
        response.sample = {
          admissionNumber: rawData[0].admissionNumber,
          form: rawData[0].form,
          subjectsCount: rawData[0].subjects?.length || 0,
          subjectsSample: rawData[0].subjects?.slice(0, 3) || []
        };
      }
      
      return NextResponse.json(response);
      
    } catch (error) {
      console.error('Processing error:', error);
      
      // Update batch as failed
      await prisma.resultUpload.update({
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
        error: error.message || 'Results upload failed',
        suggestion: 'Please ensure your file has columns for admission number (3000-3500), form, and subject scores. Sample format: admissionNumber, form, English_Score, English_Grade, etc.'
      },
      { status: 500 }
    );
  }
}

// ========== SIMPLIFIED GET ENDPOINT ==========
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const admissionNumber = url.searchParams.get('admissionNumber');
    const form = url.searchParams.get('form');
    const term = url.searchParams.get('term');
    const academicYear = url.searchParams.get('academicYear');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    // Get student results
    if (action === 'student-results' && admissionNumber) {
      const student = await prisma.databaseStudent.findUnique({
        where: { admissionNumber },
        select: {
          firstName: true,
          lastName: true,
          admissionNumber: true,
          form: true,
          stream: true,
        },
      });

      if (!student) {
        return NextResponse.json(
          {
            success: false,
            error: 'Student not found',
          },
          { status: 404 }
        );
      }

      const results = await prisma.studentResult.findMany({
        where: { admissionNumber },
        orderBy: [{ academicYear: 'desc' }, { term: 'desc' }],
      });

      const formattedResults = results.map((result) => {
        let subjects = [];
        try {
          if (typeof result.subjects === 'string') {
            subjects = JSON.parse(result.subjects);
          } else if (Array.isArray(result.subjects)) {
            subjects = result.subjects;
          }
        } catch {
          subjects = [];
        }

        const totalScore = subjects.reduce((sum, s) => sum + (s.score || 0), 0);
        const averageScore =
          subjects.length > 0 ? totalScore / subjects.length : 0;
        const totalPoints = subjects.reduce(
          (sum, s) => sum + (s.points || 0),
          0
        );

        return {
          id: result.id,
          admissionNumber: result.admissionNumber,
          form: result.form,
          term: result.term,
          academicYear: result.academicYear,
          subjects,
          totalScore: Number(totalScore.toFixed(2)),
          averageScore: Number(averageScore.toFixed(2)),
          totalPoints,
          overallGrade: calculateGrade(averageScore),
          uploadBatchId: result.uploadBatchId,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
        };
      });

      return NextResponse.json({
        success: true,
        student: {
          firstName: student.firstName,
          lastName: student.lastName,
          fullName: `${student.firstName} ${student.lastName}`,
          admissionNumber: student.admissionNumber,
          form: student.form,
          stream: student.stream,
        },
        results: formattedResults,
      });
    }

    // Default: Get all results with filters
    const where = {};

    if (admissionNumber) where.admissionNumber = admissionNumber;
    if (form) where.form = form;
    if (term) where.term = term;
    if (academicYear) where.academicYear = academicYear;

    const [results, total] = await Promise.all([
      prisma.studentResult.findMany({
        where,
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
              form: true,
              stream: true,
            },
          },
        },
        orderBy: [{ academicYear: 'desc' }, { term: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.studentResult.count({ where }),
    ]);

    const parsedResults = results.map((result) => {
      let subjects = [];
      try {
        if (typeof result.subjects === 'string') {
          subjects = JSON.parse(result.subjects);
        } else if (Array.isArray(result.subjects)) {
          subjects = result.subjects;
        }
      } catch {
        subjects = [];
      }

      const totalScore = subjects.reduce((sum, s) => sum + (s.score || 0), 0);
      const averageScore =
        subjects.length > 0 ? totalScore / subjects.length : 0;

      return {
        ...result,
        subjects,
        totalScore: Number(totalScore.toFixed(2)),
        averageScore: Number(averageScore.toFixed(2)),
        overallGrade: calculateGrade(averageScore),
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        results: parsedResults,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('[API] GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch results',
      },
      { status: 500 }
    );
  }
}


// ========== PUT ENDPOINT ==========

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, subjects, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Result ID is required' },
        { status: 400 }
      );
    }
    
    // Validate subjects if provided
    if (subjects) {
      if (!Array.isArray(subjects)) {
        return NextResponse.json(
          { success: false, error: 'Subjects must be an array' },
          { status: 400 }
        );
      }
      
      for (const subject of subjects) {
        if (subject.score < 0 || subject.score > 100) {
          return NextResponse.json(
            { success: false, error: `Score for ${subject.subject} must be between 0-100` },
            { status: 400 }
          );
        }
      }
    }
    
    // Update result
    const updatedResult = await prisma.studentResult.update({
      where: { id },
      data: {
        ...(subjects && { subjects }),
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
      message: 'Result updated successfully',
      data: updatedResult
    });
    
  } catch (error) {
    console.error('PUT error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Result not found' },
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

// ========== DELETE ENDPOINT ==========

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const batchId = url.searchParams.get('batchId');
    const resultId = url.searchParams.get('resultId');
    
    if (batchId) {
      // Delete result upload batch and associated records
      const result = await prisma.$transaction(async (tx) => {
        const batch = await tx.resultUpload.findUnique({
          where: { id: batchId }
        });
        
        if (!batch) {
          throw new Error('Batch not found');
        }
        
        // Delete results
        const deleteCount = await tx.studentResult.deleteMany({
          where: { uploadBatchId: batchId }
        });
        
        // Delete batch
        await tx.resultUpload.delete({
          where: { id: batchId }
        });
        
        return { batch, deletedCount: deleteCount.count };
      });
      
      return NextResponse.json({
        success: true,
        message: `Deleted results batch ${result.batch.fileName} and ${result.deletedCount} result records`
      });
    }
    
    if (resultId) {
      // Delete single result
      const result = await prisma.studentResult.findUnique({
        where: { id: resultId }
      });
      
      if (!result) {
        return NextResponse.json(
          { success: false, error: 'Result not found' },
          { status: 404 }
        );
      }
      
      await prisma.studentResult.delete({
        where: { id: resultId }
      });
      
      return NextResponse.json({
        success: true,
        message: `Deleted result for ${result.admissionNumber}`
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Provide batchId or resultId' },
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
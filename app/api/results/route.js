import { NextResponse } from 'next/server';
import { parse } from 'papaparse';
import * as XLSX from 'xlsx';
import { prisma } from "../../../libs/prisma";

// ========== ENHANCED HELPER FUNCTIONS ==========

const parseScore = (value) => {
  if (!value && value !== 0) return null;
  
  const str = String(value).trim();
  const cleaned = str.replace(/[^\d.]/g, '');
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? null : Math.round(parsed * 100) / 100;
};

// Enhanced calculateGrade with subject-specific thresholds
const calculateGrade = (score, subjectName = '') => {
  if (score === null || score === undefined) return 'N/A';
  
  // Mathematics has different thresholds (A starts at 75)
  const isMathematics = subjectName.toLowerCase().includes('mathematics');
  
  if (isMathematics) {
    if (score >= 75) return 'A';
    if (score >= 70) return 'A-';
    if (score >= 65) return 'B+';
    if (score >= 60) return 'B';
    if (score >= 55) return 'B-';
    if (score >= 50) return 'C+';
    if (score >= 45) return 'C';
    if (score >= 40) return 'C-';
    if (score >= 35) return 'D+';
    if (score >= 30) return 'D';
    return 'E';
  } else {
    // Standard thresholds for other subjects (A starts at 80)
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
  }
};

// AUTO-GENERATED COMMENT SYSTEM
const generateSubjectComment = (score, subjectName = '') => {
  if (score === null || score === undefined) return '';
  
  // Mathematics has different thresholds
  const isMathematics = subjectName.toLowerCase().includes('mathematics');
  
  // Determine grade first
  const grade = calculateGrade(score, subjectName);
  
  // Core subjects with specific grading
  const coreSubjects = ['english', 'kiswahili', 'biology', 'chemistry', 'physics'];
  const humanitiesSubjects = ['cre', 'ire', 'hre', 'geography', 'history'];
  const optionalSubjects = ['agriculture', 'business studies', 'home science', 'computer studies', 'german', 'french'];
  
  const subjectLower = subjectName.toLowerCase().trim();
  const isCoreSubject = coreSubjects.some(sub => subjectLower.includes(sub));
  const isHumanities = humanitiesSubjects.some(sub => subjectLower.includes(sub));
  const isOptional = optionalSubjects.some(sub => subjectLower.includes(sub));
  
  // Grade-based comment templates with progressive tones
  const commentTemplates = {
    'A': {
      excellent: [
        "Outstanding performance! Demonstrates exceptional mastery of concepts. Keep setting the bar high!",
        "Exceptional work! Shows deep understanding and excellent application skills. Maintain this excellence!",
        "Brilliant performance! Your dedication and hard work are clearly evident. Continue to excel!"
      ],
      standard: [
        "Excellent performance! Shows strong command of the subject. Keep up the great work!",
        "Very impressive work! Demonstrates thorough understanding of concepts. Keep it up!",
        "Superb performance! Consistent effort and understanding are evident. Well done!"
      ]
    },
    'A-': [
      "Very good performance! Shows clear understanding and consistent effort. Aim for even higher!",
      "Strong work! Demonstrates good grasp of concepts with minor areas for improvement.",
      "Impressive performance! Maintain this level and strive for perfection in next assessments."
    ],
    'B+': [
      "Good performance! Understanding is evident with room for growth in application.",
      "Solid work! Shows competence in most areas. Focus on strengthening weaker topics.",
      "Promising performance! With continued effort, you can achieve even better results."
    ],
    'B': [
      "Satisfactory performance. Understands basic concepts but needs to work on depth.",
      "Adequate performance. Shows potential but requires more consistent practice.",
      "Fair understanding demonstrated. Focus on regular revision to improve."
    ],
    'B-': [
      "Fair performance. Basic understanding present but application needs improvement.",
      "Average performance. Would benefit from additional practice and attention to detail.",
      "Shows some understanding. Needs to work on consistency and thoroughness."
    ],
    'C+': [
      "Below average performance. Requires more focused study and regular practice.",
      "Needs improvement. Basic concepts need reinforcement through additional practice.",
      "Shows partial understanding. Would benefit from seeking extra help or resources."
    ],
    'C': [
      "Poor performance. Fundamental concepts need serious attention and review.",
      "Below standard. Requires significant improvement through dedicated study.",
      "Struggling with core concepts. Seek teacher guidance and additional support."
    ],
    'C-': [
      "Very poor performance. Immediate intervention and remedial work needed.",
      "Significant improvement required. Focus on foundational concepts first.",
      "Serious attention needed. Consider extra classes or tutoring to catch up."
    ],
    'D+': [
      "Minimal understanding demonstrated. Requires urgent attention and support.",
      "Below expectations. Needs comprehensive review of all subject materials.",
      "Struggling significantly. Must dedicate substantial time to improve."
    ],
    'D': [
      "Marginal performance. Lacks basic understanding of core concepts.",
      "Very weak performance. Requires complete revision from basics.",
      "Failing to grasp fundamental concepts. Immediate remedial action needed."
    ],
    'E': [
      "Failed to meet minimum requirements. Requires complete relearning of subject.",
      "Insufficient understanding demonstrated. Needs to restart learning from basics.",
      "Performance below acceptable standards. Mandatory remedial work required."
    ]
  };

  // Select appropriate comment based on score
  let selectedComment = '';
  
  if (grade === 'A') {
    if (score >= 90) {
      // Excellent comments for 90+ scores
      const excellentComments = commentTemplates.A.excellent;
      selectedComment = excellentComments[Math.floor(Math.random() * excellentComments.length)];
    } else {
      // Standard A comments for 80-89 (or 75-89 for Math)
      const standardComments = commentTemplates.A.standard;
      selectedComment = standardComments[Math.floor(Math.random() * standardComments.length)];
    }
  } else {
    const gradeComments = commentTemplates[grade];
    if (gradeComments && Array.isArray(gradeComments)) {
      selectedComment = gradeComments[Math.floor(Math.random() * gradeComments.length)];
    } else {
      // Fallback comment
      selectedComment = `Performance graded as ${grade}. ${score >= 50 ? 'Keep working hard!' : 'Needs significant improvement.'}`;
    }
  }

  return selectedComment;
};

const calculateResultAverage = (result) => {
  if (!result.subjects) return 0;
  
  let subjects = result.subjects;
  
  if (typeof subjects === 'string') {
    try {
      subjects = JSON.parse(subjects);
    } catch (e) {
      return 0;
    }
  }
  
  if (!Array.isArray(subjects) || subjects.length === 0) return 0;
  
  const totalScore = subjects.reduce((sum, s) => {
    const score = parseFloat(s.score) || 0;
    return sum + score;
  }, 0);
  
  return subjects.length > 0 ? parseFloat((totalScore / subjects.length).toFixed(2)) : 0;
};

const calculatePoints = (score, subjectName = '') => {
  if (score === null) return null;
  
  const grade = calculateGrade(score, subjectName);
  
  // Determine subject type (main vs optional)
  const subjectLower = subjectName.toLowerCase().trim();
  const optionalSubjects = ['agriculture', 'business studies', 'home science', 'computer studies', 'german', 'french', 'art', 'music', 'drama'];
  const isOptional = optionalSubjects.some(sub => subjectLower.includes(sub));
  const subjectType = isOptional ? 'optional' : 'main';
  
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

const normalizeSubjectName = (subjectName) => {
  if (!subjectName) return '';
  
  const lowerName = subjectName.toLowerCase().trim();
  
  const subjectMap = {
    'english': 'English',
    'eng': 'English',
    'kiswahili': 'Kiswahili',
    'kiswa': 'Kiswahili',
    'kisw': 'Kiswahili',
    'mathematics': 'Mathematics',
    'maths': 'Mathematics',
    'math': 'Mathematics',
    'biology': 'Biology',
    'bio': 'Biology',
    'chemistry': 'Chemistry',
    'chem': 'Chemistry',
    'physics': 'Physics',
    'phy': 'Physics',
    'history': 'History',
    'hist': 'History',
    'geography': 'Geography',
    'geo': 'Geography',
    'cre': 'CRE',
    'christian religious education': 'CRE',
    'ire': 'IRE',
    'islamic religious education': 'IRE',
    'hre': 'HRE',
    'hindu religious education': 'HRE',
    'business studies': 'Business Studies',
    'business': 'Business Studies',
    'bus': 'Business Studies',
    'agriculture': 'Agriculture',
    'agric': 'Agriculture',
    'agri': 'Agriculture',
    'home science': 'Home Science',
    'home science': 'Home Science',
    'computer studies': 'Computer Studies',
    'computer': 'Computer Studies',
    'comp': 'Computer Studies',
    'ict': 'Computer Studies',
    'german': 'German',
    'french': 'French',
    'art': 'Art and Design',
    'music': 'Music',
    'physical education': 'Physical Education',
    'pe': 'Physical Education'
  };
  
  if (subjectMap[lowerName]) {
    return subjectMap[lowerName];
  }
  
  for (const [key, value] of Object.entries(subjectMap)) {
    if (lowerName.includes(key)) {
      return value;
    }
  }
  
  return subjectName
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// ========== ENHANCED PARSING FUNCTIONS WITH AUTO-COMMENTS ==========

const parseResultsCSV = async (file, term, academicYear) => {
  const text = await file.text();
  
  return new Promise((resolve, reject) => {
    parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data
          .map((row, index) => {
            try {
              // Extract admission number
              const admissionNumber = row.admissionNumber || row.admissionnumber || 
                                    row.admno || row.AdmNo || row.admission || row.Admission ||
                                    Object.values(row).find(val => /^3[0-5]\d{2}$/.test(String(val))) || '';
              
              if (!admissionNumber) {
                return null;
              }
              
              const subjects = [];
              const processedSubjects = new Set();
              
              // Extract all subject scores from the row
              for (const [columnName, value] of Object.entries(row)) {
                const columnStr = String(columnName).trim();
                
                // Skip non-subject columns
                if (columnStr.toLowerCase().includes('admission') ||
                    columnStr.toLowerCase().includes('form') ||
                    columnStr.toLowerCase().includes('stream') ||
                    columnStr.toLowerCase().includes('term') ||
                    columnStr.toLowerCase().includes('year') ||
                    columnStr.toLowerCase().includes('total') ||
                    columnStr.toLowerCase().includes('average') ||
                    columnStr.toLowerCase().includes('grade') && !columnStr.toLowerCase().includes('_grade') ||
                    columnStr.toLowerCase().includes('points') && !columnStr.toLowerCase().includes('_points') ||
                    columnStr.toLowerCase().includes('comment') && !columnStr.toLowerCase().includes('_comment') ||
                    columnStr.toLowerCase().includes('position') ||
                    columnStr.toLowerCase().includes('remark') ||
                    columnStr.toLowerCase().includes('date') ||
                    columnStr.toLowerCase().includes('status')) {
                  continue;
                }
                
                // Check if this is a score column
                if (columnStr.endsWith('_Score') || 
                    columnStr.toLowerCase().endsWith(' score') ||
                    columnStr.toLowerCase().includes('score') && !columnStr.toLowerCase().includes('total')) {
                  
                  let subjectName = columnStr.replace(/_Score$/i, '').replace(/ score$/i, '').trim();
                  
                  if (processedSubjects.has(subjectName.toLowerCase())) {
                    continue;
                  }
                  
                  const score = parseScore(value);
                  if (score === null || score < 0 || score > 100) {
                    continue;
                  }
                  
                  const normalizedSubject = normalizeSubjectName(subjectName);
                  
                  // AUTO-GENERATE GRADE, POINTS, AND COMMENT
                  const grade = calculateGrade(score, normalizedSubject);
                  const points = calculatePoints(score, normalizedSubject);
                  const comment = generateSubjectComment(score, normalizedSubject);
                  
                  subjects.push({
                    subject: normalizedSubject,
                    score: score,
                    grade: grade,
                    points: points,
                    comment: comment
                  });
                  
                  processedSubjects.add(subjectName.toLowerCase());
                }
              }
              
              // Also check for columns that might just be subject names with scores
              for (const [columnName, value] of Object.entries(row)) {
                const columnStr = String(columnName).trim();
                const lowerCol = columnStr.toLowerCase();
                
                if (lowerCol.includes('admission') || 
                    lowerCol.includes('form') || 
                    lowerCol.includes('term') ||
                    lowerCol.includes('year') ||
                    lowerCol.includes('total') ||
                    lowerCol.includes('average') ||
                    lowerCol.includes('position') ||
                    lowerCol.includes('remark') ||
                    lowerCol.includes('status') ||
                    lowerCol.includes('date')) {
                  continue;
                }
                
                // Skip if already processed as a subject with _Score suffix
                const isProcessed = Array.from(processedSubjects).some(processed => 
                  lowerCol.startsWith(processed) && 
                  (lowerCol.endsWith('_grade') || lowerCol.endsWith('_points') || lowerCol.endsWith('_comment'))
                );
                
                if (isProcessed) {
                  continue;
                }
                
                const score = parseScore(value);
                if (score !== null && score >= 0 && score <= 100) {
                  const normalizedCol = normalizeSubjectName(columnStr);
                  if (!processedSubjects.has(normalizedCol.toLowerCase())) {
                    // AUTO-GENERATE GRADE, POINTS, AND COMMENT
                    const grade = calculateGrade(score, normalizedCol);
                    const points = calculatePoints(score, normalizedCol);
                    const comment = generateSubjectComment(score, normalizedCol);
                    
                    subjects.push({
                      subject: normalizedCol,
                      score: score,
                      grade: grade,
                      points: points,
                      comment: comment
                    });
                    
                    processedSubjects.add(normalizedCol.toLowerCase());
                  }
                }
              }
              
              if (subjects.length === 0) {
                return null;
              }
              
              return {
                admissionNumber: String(admissionNumber).trim(),
                subjects,
                csvTerm: row.term || term || '',
                csvAcademicYear: row.academicYear || row.academicyear || academicYear || '',
                csvForm: row.form || '',
                csvStream: row.stream || ''
              };
            } catch (error) {
              console.error(`Error parsing row ${index}:`, error);
              return null;
            }
          })
          .filter(item => item !== null);
        
        resolve(data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

const parseResultsExcel = async (file, term, academicYear) => {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    
    const data = jsonData
      .map((row, index) => {
        try {
          // Extract admission number
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
          
          const admissionNumber = findValue([
            'admissionNumber', 'AdmissionNumber', 'Admission Number', 
            'ADMISSION_NUMBER', 'admno', 'AdmNo', 'admission', 'Admission',
            'Adm', 'adm', 'RegNo', 'regno', 'Registration', 'registration'
          ]);
          
          if (!admissionNumber) {
            return null;
          }
          
          const subjects = [];
          const processedSubjects = new Set();
          
          // Extract all subject scores
          for (const [columnName, value] of Object.entries(row)) {
            const columnStr = String(columnName).trim();
            
            // Skip non-subject columns
            if (columnStr.toLowerCase().includes('admission') ||
                columnStr.toLowerCase().includes('form') ||
                columnStr.toLowerCase().includes('stream') ||
                columnStr.toLowerCase().includes('term') ||
                columnStr.toLowerCase().includes('year') ||
                columnStr.toLowerCase().includes('total') ||
                columnStr.toLowerCase().includes('average') ||
                columnStr.toLowerCase().includes('grade') && !columnStr.toLowerCase().includes('_grade') ||
                columnStr.toLowerCase().includes('points') && !columnStr.toLowerCase().includes('_points') ||
                columnStr.toLowerCase().includes('comment') && !columnStr.toLowerCase().includes('_comment') ||
                columnStr.toLowerCase().includes('position') ||
                columnStr.toLowerCase().includes('remark') ||
                columnStr.toLowerCase().includes('date') ||
                columnStr.toLowerCase().includes('status')) {
              continue;
            }
            
            // Check if this is a score column
            if (columnStr.endsWith('_Score') || 
                columnStr.toLowerCase().endsWith(' score') ||
                columnStr.toLowerCase().includes('score') && !columnStr.toLowerCase().includes('total')) {
              
              let subjectName = columnStr.replace(/_Score$/i, '').replace(/ score$/i, '').trim();
              
              if (processedSubjects.has(subjectName.toLowerCase())) {
                continue;
              }
              
              const score = parseScore(value);
              if (score === null || score < 0 || score > 100) {
                continue;
              }
              
              const normalizedSubject = normalizeSubjectName(subjectName);
              
              // AUTO-GENERATE GRADE, POINTS, AND COMMENT
              const grade = calculateGrade(score, normalizedSubject);
              const points = calculatePoints(score, normalizedSubject);
              const comment = generateSubjectComment(score, normalizedSubject);
              
              subjects.push({
                subject: normalizedSubject,
                score: score,
                grade: grade,
                points: points,
                comment: comment
              });
              
              processedSubjects.add(subjectName.toLowerCase());
            }
          }
          
          // Also check for columns that might just be subject names with scores
          for (const [columnName, value] of Object.entries(row)) {
            const columnStr = String(columnName).trim();
            const lowerCol = columnStr.toLowerCase();
            
            if (lowerCol.includes('admission') || 
                lowerCol.includes('form') || 
                lowerCol.includes('term') ||
                lowerCol.includes('year') ||
                lowerCol.includes('total') ||
                lowerCol.includes('average') ||
                lowerCol.includes('position') ||
                lowerCol.includes('remark') ||
                lowerCol.includes('status') ||
                lowerCol.includes('date')) {
              continue;
            }
            
            // Skip if already processed as a subject with _Score suffix
            const isProcessed = Array.from(processedSubjects).some(processed => 
              lowerCol.startsWith(processed) && 
              (lowerCol.endsWith('_grade') || lowerCol.endsWith('_points') || lowerCol.endsWith('_comment'))
            );
            
            if (isProcessed) {
              continue;
            }
            
            const score = parseScore(value);
            if (score !== null && score >= 0 && score <= 100) {
              const normalizedCol = normalizeSubjectName(columnStr);
              if (!processedSubjects.has(normalizedCol.toLowerCase())) {
                // AUTO-GENERATE GRADE, POINTS, AND COMMENT
                const grade = calculateGrade(score, normalizedCol);
                const points = calculatePoints(score, normalizedCol);
                const comment = generateSubjectComment(score, normalizedCol);
                
                subjects.push({
                  subject: normalizedCol,
                  score: score,
                  grade: grade,
                  points: points,
                  comment: comment
                });
                
                processedSubjects.add(normalizedCol.toLowerCase());
              }
            }
          }
          
          if (subjects.length === 0) {
            return null;
          }
          
          return {
            admissionNumber: String(admissionNumber).trim(),
            subjects,
            csvTerm: row.term || row.Term || term || '',
            csvAcademicYear: row.academicYear || row.academicyear || row.year || academicYear || '',
            csvForm: row.form || row.Form || '',
            csvStream: row.stream || row.Stream || ''
          };
        } catch (error) {
          console.error(`Error parsing Excel row ${index}:`, error);
          return null;
        }
      })
      .filter(item => item !== null);
    
    return data;
    
  } catch (error) {
    throw new Error(`Excel parsing failed: ${error.message}`);
  }
};

// ========== MAIN POST ENDPOINT ==========
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const term = formData.get('term') || '';
    const academicYear = formData.get('academicYear') || '';
    const uploadedBy = formData.get('uploadedBy') || 'System';
    const uploadMode = formData.get('uploadMode') || 'create';
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }
    
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
    
    const normalizedTerm = normalizeTerm(term);
    const normalizedAcademicYear = normalizeAcademicYear(academicYear);
    
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
      let rawData = [];
      
      // Parse file
      if (fileExtension === 'csv') {
        rawData = await parseResultsCSV(file, term, academicYear);
      } else {
        rawData = await parseResultsExcel(file, term, academicYear);
      }
      
      if (rawData.length === 0) {
        throw new Error(`No valid result data found in file. Parsed ${rawData.length} records. Please check file format.`);
      }
      
      const stats = {
        totalRows: rawData.length,
        validRows: 0,
        skippedRows: 0,
        errorRows: 0,
        studentNotFound: 0,
        inactiveStudents: 0,
        newRecords: 0,
        updatedRecords: 0,
        duplicateRecords: 0,
        errors: [],
        warnings: []
      };
      
      // Get all admission numbers for batch lookup
      const csvAdmissionNumbers = rawData.map(r => r.admissionNumber);
      
      // Batch fetch all students
      const students = await prisma.databaseStudent.findMany({
        where: {
          admissionNumber: {
            in: csvAdmissionNumbers
          }
        },
        select: {
          admissionNumber: true,
          firstName: true,
          middleName: true,
          lastName: true,
          form: true,
          stream: true,
          status: true
        }
      });
      
      // Create a map for quick lookup
      const studentMap = new Map();
      students.forEach(student => {
        studentMap.set(student.admissionNumber, student);
      });
      
      // Process each record
      for (const [index, record] of rawData.entries()) {
        try {
          if (!record.admissionNumber) {
            stats.skippedRows++;
            stats.errors.push(`Row ${index + 2}: Missing admission number`);
            continue;
          }
          
          const student = studentMap.get(record.admissionNumber);
          
          if (!student) {
            stats.studentNotFound++;
            stats.errors.push(`Row ${index + 2}: Student ${record.admissionNumber} not found in database`);
            continue;
          }
          
          if (student.status !== 'active') {
            stats.inactiveStudents++;
            stats.errors.push(`Row ${index + 2}: Student ${student.admissionNumber} (${student.firstName} ${student.lastName}) is not active (status: ${student.status})`);
            continue;
          }
          
          if (!record.subjects || record.subjects.length === 0) {
            stats.skippedRows++;
            stats.errors.push(`Row ${index + 2}: No subject scores found`);
            continue;
          }
          
          const studentForm = student.form;
          const studentStream = student.stream;
          const studentName = `${student.firstName} ${student.lastName}`;
          
          const resultTerm = record.csvTerm ? normalizeTerm(record.csvTerm) : normalizedTerm;
          const resultAcademicYear = record.csvAcademicYear ? normalizeAcademicYear(record.csvAcademicYear) : normalizedAcademicYear;
          
          // Check for existing result
          const existingResult = await prisma.studentResult.findFirst({
            where: {
              admissionNumber: record.admissionNumber,
              term: resultTerm,
              academicYear: resultAcademicYear
            }
          });
          
          // Process subjects (comments are already auto-generated)
          const cleanSubjects = record.subjects
            .map(subject => ({
              subject: subject.subject,
              score: Math.max(0, Math.min(100, subject.score || 0)),
              grade: subject.grade,
              points: subject.points,
              comment: subject.comment // Already auto-generated
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
          
          // Handle duplicates vs new records
          if (existingResult) {
            if (uploadMode === 'update') {
              // Update existing record
              await prisma.studentResult.update({
                where: { id: existingResult.id },
                data: {
                  form: studentForm,
                  subjects: cleanSubjects,
                  updatedAt: new Date(),
                  uploadBatchId: batchId
                }
              });
              stats.updatedRecords++;
              stats.validRows++;
              
              if (existingResult.form !== studentForm) {
                stats.warnings.push(`Row ${index + 2}: Updated form from ${existingResult.form} to ${studentForm} for ${studentName}`);
              }
            } else {
              // Skip duplicate record
              stats.duplicateRecords++;
              stats.skippedRows++;
              stats.warnings.push(`Row ${index + 2}: Duplicate record skipped for ${studentName} (${resultTerm} ${resultAcademicYear}) - Use update mode to replace`);
            }
          } else {
            // Create new record
            await prisma.studentResult.create({
              data: {
                admissionNumber: record.admissionNumber,
                form: studentForm,
                term: resultTerm,
                academicYear: resultAcademicYear,
                subjects: cleanSubjects,
                uploadBatchId: batchId
              }
            });
            stats.newRecords++;
            stats.validRows++;
            
            // Log if student has previous results
            const previousResults = await prisma.studentResult.findMany({
              where: {
                admissionNumber: record.admissionNumber
              },
              select: {
                term: true,
                academicYear: true
              }
            });
            
            if (previousResults.length > 0) {
              stats.warnings.push(`Row ${index + 2}: Created new result for ${studentName} (${resultTerm} ${resultAcademicYear}) - Student has ${previousResults.length} previous result(s)`);
            }
          }
          
        } catch (error) {
          stats.errorRows++;
          const errorMsg = `Row ${index + 2}: ${error.message}`;
          stats.errors.push(errorMsg);
        }
      }
      
      // Update batch with statistics
      await prisma.resultUpload.update({
        where: { id: batchId },
        data: {
          status: stats.validRows > 0 ? 'completed' : 'failed',
          processedDate: new Date(),
          totalRows: stats.totalRows,
          validRows: stats.validRows,
          skippedRows: stats.skippedRows,
          errorRows: stats.errorRows,
          newRecords: stats.newRecords,
          updatedRecords: stats.updatedRecords,
          duplicateRecords: stats.duplicateRecords,
          errorLog: stats.errors.length > 0 ? stats.errors.slice(0, 50) : null,
          warningLog: stats.warnings.length > 0 ? stats.warnings.slice(0, 50) : null
        }
      });
      
      // Prepare response
      const response = {
        success: stats.validRows > 0,
        message: stats.validRows > 0 
          ? `Successfully processed ${stats.validRows} out of ${stats.totalRows} records (${stats.newRecords} new, ${stats.updatedRecords} updated, ${stats.duplicateRecords} duplicates skipped)`
          : `Failed to process any records.`,
        batch: {
          id: batchId,
          fileName: uploadBatch.fileName,
          term: normalizedTerm,
          academicYear: normalizedAcademicYear,
          uploadMode: uploadMode || 'create',
          status: stats.validRows > 0 ? 'completed' : 'failed'
        },
        statistics: {
          total: stats.totalRows,
          valid: stats.validRows,
          newRecords: stats.newRecords,
          updatedRecords: stats.updatedRecords,
          duplicateRecords: stats.duplicateRecords,
          skipped: stats.skippedRows,
          errors: stats.errorRows,
          studentNotFound: stats.studentNotFound,
          inactiveStudents: stats.inactiveStudents
        },
        warnings: stats.warnings.slice(0, 10),
        errors: stats.errors.slice(0, 10)
      };
      
      return NextResponse.json(response);
      
    } catch (error) {
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
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Results upload failed',
        suggestion: 'Please ensure your file has columns for admission number (3000-3500), term, academic year, and subject scores. Sample format: admissionNumber, English_Score, Mathematics_Score, etc. Comments are automatically generated.'
      },
      { status: 500 }
    );
  }
}

// ========== OTHER ENDPOINTS (GET, PUT, DELETE) ==========
// [Keep all other endpoints exactly as they were - unchanged]
// GET, PUT, DELETE endpoints remain the same

export async function GET(request) {
  // ... keep existing GET endpoint exactly as it was ...
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const admissionNumber = url.searchParams.get('admissionNumber');
    const form = url.searchParams.get('form');
    const term = url.searchParams.get('term');
    const academicYear = url.searchParams.get('academicYear');
    const subject = url.searchParams.get('subject');
    const minScore = url.searchParams.get('minScore');
    const maxScore = url.searchParams.get('maxScore');
    const sortBy = url.searchParams.get('sortBy') || 'updatedAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';
    const includeStudent = url.searchParams.get('includeStudent') === 'true';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    if (action === 'uploads') {
      const uploads = await prisma.resultUpload.findMany({
        orderBy: { uploadDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          fileName: true,
          fileType: true,
          status: true,
          uploadedBy: true,
          uploadDate: true,
          processedDate: true,
          term: true,
          academicYear: true,
          totalRows: true,
          uploadMode: true,
          validRows: true,
          skippedRows: true,
          errorRows: true,
          errorLog: true
        }
      });

      const total = await prisma.resultUpload.count();

      return NextResponse.json({
        success: true,
        uploads,
        pagination: { 
          page, 
          limit, 
          total, 
          pages: Math.ceil(total / limit) 
        }
      });
    }

    if (action === 'stats') {
      // Get total results count
      const totalResults = await prisma.studentResult.count();
      
      // Get all results for calculations
      const allResults = await prisma.studentResult.findMany({
        select: {
          id: true,
          form: true,
          term: true,
          subjects: true,
          admissionNumber: true
        }
      });

      let totalScore = 0;
      let resultCount = 0;
      let topScore = 0;
      
      // Initialize with all forms (even if zero)
      const formDistribution = {
        'Form 1': 0,
        'Form 2': 0,
        'Form 3': 0,
        'Form 4': 0
      };
      
      const termDistribution = {
        'Term 1': 0,
        'Term 2': 0,
        'Term 3': 0
      };
      
      const gradeDistribution = {
        'A': 0, 'A-': 0, 'B+': 0, 'B': 0, 'B-': 0,
        'C+': 0, 'C': 0, 'C-': 0, 'D+': 0, 'D': 0, 'E': 0
      };
      
      const subjectPerformance = {};
      const uniqueStudents = new Set();
      
      // Process each result
      allResults.forEach(result => {
        // Track unique students
        uniqueStudents.add(result.admissionNumber);
        
        // Update form distribution
        if (result.form) {
          const formKey = result.form.includes('Form ') ? result.form : `Form ${result.form}`;
          if (formDistribution[formKey] !== undefined) {
            formDistribution[formKey] = (formDistribution[formKey] || 0) + 1;
          }
        }
        
        // Update term distribution
        if (result.term) {
          const termKey = result.term.includes('Term ') ? result.term : `Term ${result.term}`;
          if (termDistribution[termKey] !== undefined) {
            termDistribution[termKey] = (termDistribution[termKey] || 0) + 1;
          }
        }
        
        // Parse subjects
        let subjects = [];
        try {
          if (typeof result.subjects === 'string') {
            subjects = JSON.parse(result.subjects);
          } else if (Array.isArray(result.subjects)) {
            subjects = result.subjects;
          }
        } catch (e) {
          console.error('Error parsing subjects:', e);
          return; // Skip this result if subjects can't be parsed
        }
        
        // Calculate average score for this result
        if (subjects.length > 0) {
          const resultTotal = subjects.reduce((sum, s) => sum + (parseFloat(s.score) || 0), 0);
          const avg = resultTotal / subjects.length;
          
          totalScore += avg;
          resultCount++;
          
          if (avg > topScore) topScore = avg;
          
          // Process each subject
          subjects.forEach(subject => {
            const score = parseFloat(subject.score) || 0;
            const subjectName = subject.subject || 'Unknown';
            const grade = subject.grade || calculateGrade(score, subjectName);
            
            // Update subject performance (average score per subject)
            if (!subjectPerformance[subjectName]) {
              subjectPerformance[subjectName] = {
                totalScore: 0,
                count: 0,
                average: 0
              };
            }
            subjectPerformance[subjectName].totalScore += score;
            subjectPerformance[subjectName].count++;
            subjectPerformance[subjectName].average = 
              subjectPerformance[subjectName].totalScore / subjectPerformance[subjectName].count;
            
            // Update grade distribution
            if (gradeDistribution[grade] !== undefined) {
              gradeDistribution[grade]++;
            } else {
              // For any unexpected grades, add them
              gradeDistribution[grade] = 1;
            }
          });
        }
      });

      // Calculate overall averages
      const averageScore = resultCount > 0 ? totalScore / resultCount : 0;
      
      // Format subject performance for response
      const formattedSubjectPerformance = {};
      Object.keys(subjectPerformance).forEach(subject => {
        formattedSubjectPerformance[subject] = {
          averageScore: parseFloat(subjectPerformance[subject].average.toFixed(2)),
          totalResults: subjectPerformance[subject].count
        };
      });

      return NextResponse.json({
        success: true,
        stats: {
          totalResults,
          totalStudents: uniqueStudents.size,
          averageScore: parseFloat(averageScore.toFixed(2)),
          topScore: parseFloat(topScore.toFixed(2)),
          formDistribution,
          termDistribution,
          gradeDistribution,
          subjectPerformance: formattedSubjectPerformance,
          updatedAt: new Date().toISOString()
        }
      });
    }

    if (action === 'student-report' && admissionNumber) {
      const results = await prisma.studentResult.findMany({
        where: { admissionNumber },
        orderBy: [{ academicYear: 'desc' }, { term: 'desc' }]
      });

      const parsedResults = results.map(result => {
        let subjects = [];
        try {
          if (typeof result.subjects === 'string') {
            subjects = JSON.parse(result.subjects);
          } else if (Array.isArray(result.subjects)) {
            subjects = result.subjects;
          }
        } catch (e) {
          subjects = [];
        }

        const totalScore = subjects.reduce((sum, s) => sum + (s.score || 0), 0);
        const averageScore = subjects.length > 0 ? totalScore / subjects.length : 0;

        return {
          ...result,
          subjects,
          totalScore,
          averageScore: parseFloat(averageScore.toFixed(2)),
          overallGrade: calculateGrade(averageScore)
        };
      });

      return NextResponse.json({
        success: true,
        data: {
          admissionNumber,
          results: parsedResults,
          summary: {
            totalResults: results.length,
            latestResult: parsedResults[0] || null
          }
        }
      });
    }

    if (action === 'student-results' && admissionNumber) {
      const student = await prisma.databaseStudent.findUnique({
        where: { admissionNumber },
        select: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
          admissionNumber: true,
          form: true,
          stream: true,
          gender: true,
          dateOfBirth: true,
          email: true,
          parentPhone: true,
          address: true,
          status: true
        }
      });

      if (!student) {
        return NextResponse.json({
          success: false,
          error: 'Student not found'
        }, { status: 404 });
      }

      const results = await prisma.studentResult.findMany({
        where: { admissionNumber },
        orderBy: [{ academicYear: 'desc' }, { term: 'desc' }]
      });

      const parsedResults = results.map(result => {
        let subjects = [];
        try {
          if (typeof result.subjects === 'string') {
            subjects = JSON.parse(result.subjects);
          } else if (Array.isArray(result.subjects)) {
            subjects = result.subjects;
          }
        } catch (e) {
          subjects = [];
        }

        const totalScore = subjects.reduce((sum, s) => sum + (s.score || 0), 0);
        const averageScore = subjects.length > 0 ? totalScore / subjects.length : 0;

        return {
          ...result,
          subjects,
          totalScore,
          averageScore: parseFloat(averageScore.toFixed(2)),
          overallGrade: calculateGrade(averageScore)
        };
      });

      return NextResponse.json({
        success: true,
        student,
        results: parsedResults
      });
    }

    const where = {};

    if (admissionNumber) where.admissionNumber = admissionNumber;
    if (form) where.form = form;
    if (term) where.term = term;
    if (academicYear) where.academicYear = academicYear;

    const orderBy = {};
    if (sortBy === 'averageScore') {
      orderBy.updatedAt = sortOrder;
    } else {
      orderBy[sortBy] = sortOrder;
    }

    const allMatchingResults = await prisma.studentResult.findMany({
      where,
      orderBy,
      include: includeStudent ? {
        student: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            admissionNumber: true,
            form: true,
            stream: true,
            email: true
          }
        }
      } : undefined
    });

    const allParsedResults = allMatchingResults.map(result => {
      let subjects = [];
      try {
        if (typeof result.subjects === 'string') {
          subjects = JSON.parse(result.subjects);
        } else if (Array.isArray(result.subjects)) {
          subjects = result.subjects;
        }
      } catch (e) {
        subjects = [];
      }

      const totalScore = subjects.reduce((sum, s) => sum + (s.score || 0), 0);
      const averageScore = subjects.length > 0 ? totalScore / subjects.length : 0;

      return {
        ...result,
        subjects,
        totalScore,
        averageScore: parseFloat(averageScore.toFixed(2)),
        overallGrade: calculateGrade(averageScore),
        student: result.student || null
      };
    });

    let filteredResults = allParsedResults;
    
    if (subject) {
      filteredResults = filteredResults.filter(result => {
        return result.subjects.some(s => 
          s.subject.toLowerCase().includes(subject.toLowerCase())
        );
      });
    }

    if (minScore) {
      const min = parseFloat(minScore);
      filteredResults = filteredResults.filter(result => 
        result.averageScore >= min
      );
    }

    if (maxScore) {
      const max = parseFloat(maxScore);
      filteredResults = filteredResults.filter(result => 
        result.averageScore <= max
      );
    }

    const totalFiltered = filteredResults.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = filteredResults.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        results: paginatedResults,
        pagination: {
          page,
          limit,
          total: totalFiltered,
          pages: Math.ceil(totalFiltered / limit)
        }
      }
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch results data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

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

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const batchId = url.searchParams.get('batchId');
    const resultId = url.searchParams.get('resultId');
    
    if (batchId) {
      const batch = await prisma.resultUpload.findUnique({
        where: { id: batchId },
        select: {
          fileName: true,
          validRows: true
        }
      });
      
      if (!batch) {
        return NextResponse.json(
          { success: false, error: 'Upload batch not found' },
          { status: 404 }
        );
      }
      
      await prisma.resultUpload.delete({
        where: { id: batchId }
      });
      
      return NextResponse.json({
        success: true,
        message: `Deleted upload batch "${batch.fileName}" and ${batch.validRows || 0} result records`
      });
    }
    
    if (resultId) {
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
        message: `Deleted result for admission ${result.admissionNumber}`
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Provide batchId or resultId' },
      { status: 400 }
    );
    
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Record not found' },
        { status: 404 }
      );
    }
    
    if (error.code === 'P2028' || error.code === 'P2034') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database operation timed out. Please try again or delete in smaller batches.',
          suggestion: 'Try deleting individual results instead of the entire batch.'
        },
        { status: 408 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Delete operation failed',
        code: error.code
      },
      { status: 500 }
    );
  }
}
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

const getFormSubjects = (form) => {
  const allSubjects = [
    // Core subjects for all forms
    { name: 'English', code: 'ENG', type: 'main', category: 'language' },
    { name: 'Kiswahili', code: 'KIS', type: 'main', category: 'language' },
    { name: 'Mathematics', code: 'MAT', type: 'main', category: 'mathematics' },
    
    // Humanities
    { name: 'History', code: 'HIS', type: 'main', category: 'humanities' },
    { name: 'Geography', code: 'GEO', type: 'main', category: 'humanities' },
    { name: 'CRE', code: 'CRE', type: 'main', category: 'humanities' },
    { name: 'IRE', code: 'IRE', type: 'main', category: 'humanities' },
    { name: 'HRE', code: 'HRE', type: 'main', category: 'humanities' },
    
    // Sciences
    { name: 'Biology', code: 'BIO', type: 'main', category: 'sciences' },
    { name: 'Physics', code: 'PHY', type: 'main', category: 'sciences' },
    { name: 'Chemistry', code: 'CHE', code: 'CHE', type: 'main', category: 'sciences' },
    
    // Technical subjects
    { name: 'Business Studies', code: 'BUS', type: 'main', category: 'technical' },
    { name: 'Agriculture', code: 'AGR', type: 'main', category: 'technical' },
    { name: 'Computer Studies', code: 'COM', type: 'main', category: 'technical' },
    { name: 'Home Science', code: 'HSC', type: 'main', category: 'technical' },
    { name: 'Art and Design', code: 'ART', type: 'main', category: 'technical' },
    { name: 'Music', code: 'MUS', type: 'main', category: 'technical' },
    
    // Optional subjects (mainly for Form 3/4)
    { name: 'French', code: 'FRE', type: 'optional', category: 'language' },
    { name: 'German', code: 'GER', type: 'optional', category: 'language' },
    { name: 'Arabic', code: 'ARA', type: 'optional', category: 'language' },
    { name: 'Physical Education', code: 'PE', type: 'optional', category: 'sports' },
  ];
  
  // For Form 1 & 2: Return all core subjects
  if (form === 'Form 1' || form === 'Form 2') {
    return allSubjects.filter(subject => 
      ['ENG', 'KIS', 'MAT', 'HIS', 'GEO', 'CRE', 'IRE', 'HRE', 'BIO', 'PHY', 'CHE'].includes(subject.code)
    );
  }
  
  return allSubjects;
};

// ========== PARSING FUNCTIONS ==========

const parseResultsCSV = async (file) => {
  const text = await file.text();
  
  return new Promise((resolve, reject) => {
    parse(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        const normalized = header.trim().toLowerCase();
        
        // Student info mappings
        if (normalized.includes('admission') || normalized.includes('admno') || normalized.includes('adm')) {
          return 'admissionNumber';
        }
        if (normalized.includes('form') || normalized.includes('class')) {
          return 'form';
        }
        if (normalized.includes('term')) {
          return 'term';
        }
        if (normalized.includes('year') || normalized.includes('academic') || normalized.includes('session')) {
          return 'academicYear';
        }

        // New overall/result fields
        if (normalized.includes('examtype') || normalized.includes('exam type') || normalized.includes('exam_type')) return 'examType';
        if (normalized.includes('totalmarks') || normalized.includes('total marks') || normalized === 'total') return 'totalMarks';
        if (normalized.includes('averagemark') || normalized.includes('average mark') || normalized === 'average') return 'averageMark';
        if (normalized.includes('overallgrade') || normalized.includes('grade overall')) return 'overallGrade';
        if (normalized.includes('totalpoints') || normalized.includes('points total')) return 'totalPoints';
        if (normalized.includes('classposition') || normalized.includes('class position')) return 'classPosition';
        if (normalized.includes('classsize') || normalized.includes('class size')) return 'classSize';
        if (normalized.includes('streamposition') || normalized.includes('stream position')) return 'streamPosition';
        if (normalized.includes('remarks')) return 'remarks';
        if (normalized.includes('teachercomment') || normalized.includes('teacher comment')) return 'teacherComment';
        if (normalized.includes('parentsignature') || normalized.includes('parent signature') || normalized.includes('parentsignaturerequired')) return 'parentSignatureRequired';
        if (normalized.includes('resultdate') || normalized.includes('date')) return 'resultDate';
        if (normalized === 'subjects' || normalized.includes('subject')) return 'subjects';
        
        // Subject mappings (existing)
        if (normalized.includes('english') || normalized === 'eng') return 'English';
        if (normalized.includes('kiswahili') || normalized === 'kis' || normalized === 'swa') return 'Kiswahili';
        if (normalized.includes('math') || normalized.includes('maths' || normalized === 'mat')) return 'Mathematics';
        if (normalized.includes('biology') || normalized === 'bio') return 'Biology';
        if (normalized.includes('physics') || normalized === 'phy') return 'Physics';
        if (normalized.includes('chemistry') || normalized === 'chem') return 'Chemistry';
        if (normalized.includes('history') || normalized === 'his') return 'History';
        if (normalized.includes('geography') || normalized === 'geo') return 'Geography';
        if (normalized === 'cre' || normalized.includes('christian')) return 'CRE';
        if (normalized === 'ire' || normalized.includes('islamic')) return 'IRE';
        if (normalized === 'hre' || normalized.includes('hindu')) return 'HRE';
        if (normalized.includes('business') || normalized === 'bus') return 'Business Studies';
        if (normalized.includes('agriculture') || normalized === 'agr') return 'Agriculture';
        if (normalized.includes('computer') || normalized === 'comp') return 'Computer Studies';
        if (normalized.includes('home science') || normalized === 'hsc') return 'Home Science';
        if (normalized.includes('art') || normalized === 'art') return 'Art and Design';
        if (normalized.includes('music') || normalized === 'mus') return 'Music';
        if (normalized.includes('french') || normalized === 'fre') return 'French';
        if (normalized.includes('german') || normalized === 'ger') return 'German';
        if (normalized.includes('arabic') || normalized === 'ara') return 'Arabic';
        if (normalized.includes('physical') || normalized === 'pe') return 'Physical Education';
        
        return normalized;
      },
      complete: (results) => {
        const data = results.data
          .map((row, index) => {
            try {
              const admissionNumber = String(row.admissionNumber || '').trim();
              const form = String(row.form || row.class || '').trim();
              const term = String(row.term || '').trim();
              const academicYear = String(row.academicYear || row.year || row.session || '').trim();

              // Additional result-level fields
              const examType = row.examType || row.exam || '';
              const totalMarks = row.totalMarks ? parseFloat(String(row.totalMarks).replace(/[^\d.]/g, '')) : null;
              const averageMark = row.averageMark ? parseFloat(String(row.averageMark).replace(/[^\d.]/g, '')) : null;
              const overallGrade = row.overallGrade || row.grade || '';
              const totalPoints = row.totalPoints ? parseFloat(String(row.totalPoints).replace(/[^\d.]/g, '')) : null;
              const classPosition = row.classPosition ? parseInt(String(row.classPosition).replace(/[^\d]/g, '')) : null;
              const classSize = row.classSize ? parseInt(String(row.classSize).replace(/[^\d]/g, '')) : null;
              const streamPosition = row.streamPosition ? parseInt(String(row.streamPosition).replace(/[^\d]/g, '')) : null;
              const remarks = row.remarks || '';
              const teacherComment = row.teacherComment || row.teacher_comments || '';
              const parentSignatureRequired = typeof row.parentSignatureRequired !== 'undefined'
                ? String(row.parentSignatureRequired).trim().toLowerCase() === 'true' || String(row.parentSignatureRequired).trim() === '1'
                : false;
              const rawResultDate = row.resultDate || row.date || '';
              const resultDate = rawResultDate ? (new Date(rawResultDate)).toISOString() : null;
              
              if (!admissionNumber || !form) {
                return null;
              }
              
              // Extract subjects from either a subjects column (stringified array) OR individual subject columns
              let subjects = [];
              if (row.subjects) {
                try {
                  // Handle stringified arrays with single quotes by normalizing to double quotes
                  const subjRaw = typeof row.subjects === 'string' ? row.subjects.trim() : JSON.stringify(row.subjects);
                  const normalized = subjRaw.replace(/=>/g, ':').replace(/'/g, '"');
                  const parsed = JSON.parse(normalized);
                  if (Array.isArray(parsed)) {
                    subjects = parsed.map(item => {
                      const score = parseScore(item.mark ?? item.markValue ?? item.score);
                      return {
                        subject: item.subject || item.name || '',
                        score,
                        grade: item.grade || item.overallGrade || null,
                        points: typeof item.points !== 'undefined' ? Number(item.points) : (score !== null ? calculatePoints(score) : null),
                        code: (item.code || item.code?.toString() || '').toString().substring(0, 10),
                        category: item.category || item.group || null,
                        raw: item
                      };
                    }).filter(s => s.score !== null);
                  }
                } catch (e) {
                  console.error('Failed to parse subjects column for CSV row', index, e);
                }
              }

              // If no subjects column, fall back to column-per-subject parsing
              if (subjects.length === 0) {
                const subjectKeys = Object.keys(row).filter(key => 
                  !['admissionNumber', 'form', 'term', 'academicYear', 'class', 'year', 'session', 'examType', 'totalMarks', 'averageMark', 'overallGrade', 'totalPoints', 'classPosition', 'classSize', 'streamPosition', 'remarks', 'teacherComment', 'parentSignatureRequired', 'resultDate', 'subjects'].includes(key)
                );
                
                for (const subjectKey of subjectKeys) {
                  const score = parseScore(row[subjectKey]);
                  if (score !== null) {
                    const grade = calculateGrade(score);
                    const points = calculatePoints(score);
                    
                    subjects.push({
                      subject: subjectKey,
                      score,
                      grade,
                      points,
                      code: subjectKey.substring(0, 3).toUpperCase()
                    });
                  }
                }
              }
              
              if (subjects.length === 0) {
                return null;
              }
              
              return {
                admissionNumber,
                form: form.startsWith('Form ') ? form : `Form ${form}`,
                term,
                academicYear,
                subjects,
                // additional fields
                examType,
                totalMarks,
                averageMark,
                overallGrade,
                totalPoints,
                classPosition,
                classSize,
                streamPosition,
                remarks,
                teacherComment,
                parentSignatureRequired,
                resultDate
              };
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

const parseResultsExcel = async (file) => {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    
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
          const form = findValue(['form', 'Form', 'FORM', 'class', 'Class', 'CLASS']);
          const term = findValue(['term', 'Term', 'TERM']);
          const academicYear = findValue(['academicYear', 'AcademicYear', 'Academic Year', 'year', 'Year', 'YEAR', 'session', 'Session']);
          
          // other fields
          const examType = findValue(['examType', 'ExamType', 'exam type', 'Exam']);
          const totalMarksRaw = findValue(['totalMarks', 'TotalMarks', 'total marks', 'Total']);
          const averageMarkRaw = findValue(['averageMark', 'AverageMark', 'average mark', 'Average']);
          const overallGrade = findValue(['overallGrade', 'OverallGrade', 'grade']);
          const totalPointsRaw = findValue(['totalPoints', 'TotalPoints', 'points']);
          const classPositionRaw = findValue(['classPosition', 'ClassPosition', 'class position']);
          const classSizeRaw = findValue(['classSize', 'ClassSize', 'class size']);
          const streamPositionRaw = findValue(['streamPosition', 'StreamPosition', 'stream position']);
          const remarks = findValue(['remarks', 'remark']);
          const teacherComment = findValue(['teacherComment', 'teacher_comment', 'teacher comments']);
          const parentSignatureRequiredRaw = findValue(['parentSignatureRequired', 'parentSignature', 'parent_signature_required']);
          const resultDateRaw = findValue(['resultDate', 'date', 'ResultDate']);
          
          const totalMarks = totalMarksRaw ? parseFloat(totalMarksRaw.replace(/[^\d.]/g, '')) : null;
          const averageMark = averageMarkRaw ? parseFloat(averageMarkRaw.replace(/[^\d.]/g, '')) : null;
          const totalPoints = totalPointsRaw ? parseFloat(totalPointsRaw.replace(/[^\d.]/g, '')) : null;
          const classPosition = classPositionRaw ? parseInt(classPositionRaw.replace(/[^\d]/g, '')) : null;
          const classSize = classSizeRaw ? parseInt(classSizeRaw.replace(/[^\d]/g, '')) : null;
          const streamPosition = streamPositionRaw ? parseInt(streamPositionRaw.replace(/[^\d]/g, '')) : null;
          const parentSignatureRequired = parentSignatureRequiredRaw ? String(parentSignatureRequiredRaw).trim().toLowerCase() === 'true' || String(parentSignatureRequiredRaw).trim() === '1' : false;
          const resultDate = resultDateRaw ? (new Date(resultDateRaw)).toISOString() : null;
          
          if (!admissionNumber || !form) {
            return null;
          }
          
          // Extract subjects
          let subjects = [];
          // Prioritize a 'subjects' cell if present
          const subjectsCell = findValue(['subjects', 'Subjects']);
          if (subjectsCell) {
            try {
              const normalized = subjectsCell.replace(/=>/g, ':').replace(/'/g, '"');
              const parsed = JSON.parse(normalized);
              if (Array.isArray(parsed)) {
                subjects = parsed.map(item => {
                  const score = parseScore(item.mark ?? item.score);
                  return {
                    subject: item.subject || item.name || '',
                    score,
                    grade: item.grade || null,
                    points: typeof item.points !== 'undefined' ? Number(item.points) : (score !== null ? calculatePoints(score) : null),
                    code: (item.code || '').toString().substring(0, 10),
                    category: item.category || null,
                    raw: item
                  };
                }).filter(s => s.score !== null);
              }
            } catch (e) {
              console.error('Failed to parse subjects cell for Excel row', index, e);
            }
          }

          if (subjects.length === 0) {
            for (const key in row) {
              if (!['admissionNumber','form','term','academicYear','class','year','session','examType','totalMarks','averageMark','overallGrade','totalPoints','classPosition','classSize','streamPosition','remarks','teacherComment','parentSignatureRequired','resultDate','subjects'].includes(key.toLowerCase())) {
                const score = parseScore(row[key]);
                if (score !== null) {
                  subjects.push({
                    subject: key,
                    score,
                    grade: calculateGrade(score),
                    points: calculatePoints(score),
                    code: key.substring(0,3).toUpperCase()
                  });
                }
              }
            }
          }
          
          if (subjects.length === 0) {
            return null;
          }
          
          return {
            admissionNumber,
            form: form.startsWith('Form ') ? form : `Form ${form}`,
            term,
            academicYear,
            subjects,
            examType,
            totalMarks,
            averageMark,
            overallGrade,
            totalPoints,
            classPosition,
            classSize,
            streamPosition,
            remarks,
            teacherComment,
            parentSignatureRequired,
            resultDate
          };
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

const validateResultRecord = (record, index, defaultTerm, defaultAcademicYear) => {
  const errors = [];
  
  // Required fields
  if (!record.admissionNumber) {
    errors.push(`Row ${index + 2}: Admission number is required`);
  }
  
  if (!record.form) {
    errors.push(`Row ${index + 2}: Form/class is required`);
  }
  
  if (record.subjects.length === 0) {
    errors.push(`Row ${index + 2}: At least one subject score is required`);
  }
  
  // Validate subject scores
  for (const subject of record.subjects) {
    if (subject.score < 0 || subject.score > 100) {
      errors.push(`Row ${index + 2}: Score for ${subject.subject} must be between 0-100 (got: ${subject.score})`);
    }
  }
  
  // Set defaults if not provided
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

const processResultsData = async (rawData, batchId, defaultTerm, defaultAcademicYear) => {
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
    }
    // removed `select` to avoid referencing unknown field `subjectCombination`
  });
  
  // build a map for fast lookup
  const existingStudentsMap = new Map(existingStudents.map(s => [s.admissionNumber, s]));
  
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
    const validation = validateResultRecord(record, index, defaultTerm, defaultAcademicYear);
    
    if (!validation.isValid) {
      stats.errorRows++;
      stats.errors.push(...validation.errors);
      continue;
    }
    
    // Check if student exists
    const student = existingStudentsMap.get(record.admissionNumber);
    if (!student) {
      stats.skippedRows++;
      stats.errors.push(`Row ${index + 2}: Student with admission number ${record.admissionNumber} not found. Student must be uploaded first.`);
      continue;
    }
    
    // For Form 3/4, validate subject combination
    if (record.form === 'Form 3' || record.form === 'Form 4') {
      if (student.subjectCombination) {
        try {
          const combination = typeof student.subjectCombination === 'string' 
            ? JSON.parse(student.subjectCombination)
            : student.subjectCombination;
          
          if (Array.isArray(combination)) {
            const allowedSubjects = new Set(combination);
            const invalidSubjects = record.subjects.filter(s => !allowedSubjects.has(s.subject) && !allowedSubjects.has(s.code));
            
            if (invalidSubjects.length > 0) {
              stats.skippedRows++;
              stats.errors.push(`Row ${index + 2}: Student ${record.admissionNumber} has invalid subjects: ${invalidSubjects.map(s => s.subject).join(', ')}. Allowed: ${combination.join(', ')}`);
              continue;
            }
          }
        } catch (e) {
          console.error('Error parsing subject combination:', e);
        }
      }
    }
    
    // Check for duplicate admissionNumber+form+term+academicYear in this upload
    const uniqueKey = `${record.admissionNumber}-${record.form}-${record.term}-${record.academicYear}`;
    if (seenCombinations.has(uniqueKey)) {
      stats.skippedRows++;
      stats.errors.push(`Row ${index + 2}: Duplicate result entry for ${record.admissionNumber} in ${record.form} ${record.term} ${record.academicYear}`);
      continue;
    }
    seenCombinations.add(uniqueKey);
    
    // Ensure subjects are normalized (score, grade, points)
    record.subjects = record.subjects.map(s => {
      const score = s.score ?? s.mark ?? null;
      const normalizedScore = typeof score === 'number' ? score : parseScore(score);
      const normalizedGrade = s.grade ?? calculateGrade(normalizedScore);
      const normalizedPoints = typeof s.points !== 'undefined' ? Number(s.points) : (normalizedScore !== null ? calculatePoints(normalizedScore) : null);
      return {
        subject: s.subject || s.name || '',
        code: s.code || (s.subject ? s.subject.substring(0,3).toUpperCase() : ''),
        score: normalizedScore,
        grade: normalizedGrade,
        points: normalizedPoints,
        category: s.category || null
      };
    }).filter(s => s.score !== null);
    
    // Calculate total and average (use provided totals if present, otherwise compute)
    const totalScore = record.totalMarks ?? record.subjects.reduce((sum, s) => sum + (s.score || 0), 0);
    const averageScore = record.averageMark ?? (record.subjects.length > 0 ? totalScore / record.subjects.length : 0);
    const totalPoints = record.totalPoints ?? record.subjects.reduce((sum, s) => sum + (s.points || 0), 0);
    
    record.totalScore = parseFloat(Number(totalScore).toFixed(2));
    record.averageScore = parseFloat(Number(averageScore).toFixed(2));
    record.totalPoints = totalPoints;
    
    validRecords.push(record);
    stats.validRows++;
  }
  
  // Process valid records
  if (validRecords.length > 0) {
    const CHUNK_SIZE = 50;
    
    for (let i = 0; i < validRecords.length; i += CHUNK_SIZE) {
      const chunk = validRecords.slice(i, i + CHUNK_SIZE);
      
      try {
        for (const record of chunk) {
          try {
            // Check if result already exists for this student-form-term-year
            const existingResult = await prisma.studentResult.findFirst({
              where: {
                admissionNumber: record.admissionNumber,
                form: record.form,
                term: record.term,
                academicYear: record.academicYear
              }
            });
            
            if (existingResult) {
              // Update existing result
              await prisma.studentResult.update({
                where: { id: existingResult.id },
                data: {
                  subjects: record.subjects,
                  updatedAt: new Date(),
                  uploadBatchId: batchId
                }
              });
            } else {
              // Create new result
              await prisma.studentResult.create({
                data: {
                  admissionNumber: record.admissionNumber,
                  form: record.form,
                  term: record.term,
                  academicYear: record.academicYear,
                  subjects: record.subjects,
                  uploadBatchId: batchId
                }
              });
            }
          } catch (singleError) {
            console.error(`Failed to process record for ${record.admissionNumber}:`, singleError);
            stats.validRows--;
            stats.errorRows++;
            stats.errors.push(`Failed to save results for ${record.admissionNumber}: ${singleError.message}`);
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

const calculateResultsStatistics = async (whereClause = {}) => {
  try {
    // Get all results with students
    const results = await prisma.studentResult.findMany({
      where: whereClause,
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
    
    if (results.length === 0) {
      return {
        summary: {
          totalStudents: 0,
          totalResults: 0,
          averageScore: 0,
          topScore: 0
        },
        distribution: {
          byForm: [],
          byTerm: [],
          byGrade: []
        }
      };
    }
    
    // Calculate statistics
    let totalScore = 0;
    let topScore = 0;
    let resultCount = 0;
    const formMap = new Map();
    const termMap = new Map();
    const gradeMap = new Map();
    
    for (const result of results) {
      const subjects = Array.isArray(result.subjects) ? result.subjects : 
        (typeof result.subjects === 'string' ? JSON.parse(result.subjects) : []);
      
      const studentTotal = subjects.reduce((sum, s) => sum + (s.score || 0), 0);
      const studentAverage = subjects.length > 0 ? studentTotal / subjects.length : 0;
      
      totalScore += studentAverage;
      resultCount++;
      
      if (studentAverage > topScore) {
        topScore = studentAverage;
      }
      
      // Count by form
      formMap.set(result.form, (formMap.get(result.form) || 0) + 1);
      
      // Count by term
      if (result.term) {
        termMap.set(result.term, (termMap.get(result.term) || 0) + 1);
      }
      
      // Count grades
      for (const subject of subjects) {
        if (subject.grade) {
          gradeMap.set(subject.grade, (gradeMap.get(subject.grade) || 0) + 1);
        }
      }
    }
    
    return {
      summary: {
        totalStudents: new Set(results.map(r => r.admissionNumber)).size,
        totalResults: results.length,
        averageScore: parseFloat((totalScore / resultCount).toFixed(2)),
        topScore: parseFloat(topScore.toFixed(2))
      },
      distribution: {
        byForm: Array.from(formMap.entries()).map(([form, count]) => ({ form, count })),
        byTerm: Array.from(termMap.entries()).map(([term, count]) => ({ term, count })),
        byGrade: Array.from(gradeMap.entries()).map(([grade, count]) => ({ grade, count }))
      }
    };
  } catch (error) {
    console.error('Error calculating results statistics:', error);
    throw error;
  }
};

const generateStudentReport = async (admissionNumber) => {
  try {
    const [student, results] = await Promise.all([
      prisma.databaseStudent.findUnique({
        where: { admissionNumber },
        select: {
          firstName: true,
          lastName: true,
          form: true,
          stream: true,
          admissionNumber: true
          // subjectCombination removed (not in schema)
        }
      }),
      prisma.studentResult.findMany({
        where: { admissionNumber },
        orderBy: [{ academicYear: 'desc' }, { term: 'desc' }]
      })
    ]);
    
    if (!student) {
      throw new Error('Student not found');
    }
    
    // Calculate overall performance
    const performanceByYear = {};
    const allSubjects = new Map();
    
    for (const result of results) {
      const yearKey = result.academicYear;
      if (!performanceByYear[yearKey]) {
        performanceByYear[yearKey] = {
          term1: null,
          term2: null,
          term3: null,
          subjects: new Map()
        };
      }
      
      const subjects = Array.isArray(result.subjects) ? result.subjects : 
        (typeof result.subjects === 'string' ? JSON.parse(result.subjects) : []);
      
      // Store term results
      if (result.term === 'Term 1') performanceByYear[yearKey].term1 = result;
      if (result.term === 'Term 2') performanceByYear[yearKey].term2 = result;
      if (result.term === 'Term 3') performanceByYear[yearKey].term3 = result;
      
      // Track subject performance over time
      for (const subject of subjects) {
        const subjectName = subject.subject;
        if (!allSubjects.has(subjectName)) {
          allSubjects.set(subjectName, {
            scores: [],
            grades: [],
            average: 0,
            trend: 'stable'
          });
        }
        
        const subjectData = allSubjects.get(subjectName);
        subjectData.scores.push(subject.score);
        subjectData.grades.push(subject.grade);
      }
    }
    
    // Calculate subject averages and trends
    for (const [subjectName, data] of allSubjects) {
      if (data.scores.length > 0) {
        data.average = parseFloat((data.scores.reduce((a, b) => a + b, 0) / data.scores.length).toFixed(2));
        
        // Determine trend
        if (data.scores.length >= 2) {
          const recent = data.scores[data.scores.length - 1];
          const previous = data.scores[data.scores.length - 2];
          data.trend = recent > previous ? 'improving' : recent < previous ? 'declining' : 'stable';
        }
      }
    }
    
    // Get class ranking if available (you might need to implement ranking logic)
    const classRank = await calculateClassRanking(student.form, student.stream);
    
    return {
      student,
      results: results.map(r => ({
        ...r,
        subjects: Array.isArray(r.subjects) ? r.subjects : 
          (typeof r.subjects === 'string' ? JSON.parse(r.subjects) : [])
      })),
      performance: {
        byYear: performanceByYear,
        subjects: Array.from(allSubjects.entries()).map(([name, data]) => ({
          subject: name,
          averageScore: data.average,
          trend: data.trend,
          grades: data.grades
        })),
        overallAverage: results.length > 0 ? 
          parseFloat((results.flatMap(r => 
            Array.isArray(r.subjects) ? r.subjects : 
            (typeof r.subjects === 'string' ? JSON.parse(r.subjects) : [])
          ).reduce((sum, s) => sum + (s.score || 0), 0) / 
          results.flatMap(r => 
            Array.isArray(r.subjects) ? r.subjects : 
            (typeof r.subjects === 'string' ? JSON.parse(r.subjects) : [])
          ).length).toFixed(2)) : 0,
        classRank
      }
    };
  } catch (error) {
    console.error('Error generating student report:', error);
    throw error;
  }
};

const calculateClassRanking = async (form, stream) => {
  try {
    // Get all students in the same form and stream
    const students = await prisma.databaseStudent.findMany({
      where: {
        form,
        stream,
        status: 'active'
      },
      select: {
        admissionNumber: true,
        firstName: true,
        lastName: true
      }
    });
    
    // Get results for these students
    const results = await prisma.studentResult.findMany({
      where: {
        admissionNumber: {
          in: students.map(s => s.admissionNumber)
        }
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });
    
    // Calculate averages for each student
    const studentAverages = {};
    
    for (const result of results) {
      if (!studentAverages[result.admissionNumber]) {
        studentAverages[result.admissionNumber] = {
          totalScore: 0,
          count: 0,
          name: `${result.student.firstName} ${result.student.lastName}`
        };
      }
      
      const subjects = Array.isArray(result.subjects) ? result.subjects : 
        (typeof result.subjects === 'string' ? JSON.parse(result.subjects) : []);
      
      const termTotal = subjects.reduce((sum, s) => sum + (s.score || 0), 0);
      const termAverage = subjects.length > 0 ? termTotal / subjects.length : 0;
      
      studentAverages[result.admissionNumber].totalScore += termAverage;
      studentAverages[result.admissionNumber].count++;
    }
    
    // Calculate final averages and rank
    const rankedStudents = Object.entries(studentAverages)
      .map(([admissionNumber, data]) => ({
        admissionNumber,
        name: data.name,
        average: data.count > 0 ? parseFloat((data.totalScore / data.count).toFixed(2)) : 0
      }))
      .sort((a, b) => b.average - a.average)
      .map((student, index) => ({
        ...student,
        rank: index + 1
      }));
    
    return rankedStudents;
  } catch (error) {
    console.error('Error calculating class ranking:', error);
    return [];
  }
};

// ========== API ENDPOINTS ==========

// POST - Upload results
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
        rawData = await parseResultsCSV(file);
      } else {
        rawData = await parseResultsExcel(file);
      }
      
      if (rawData.length === 0) {
        throw new Error('No valid result data found in file');
      }
      
      // Process data
      const { stats, validRecords } = await processResultsData(
        rawData, 
        batchId, 
        normalizedTerm, 
        normalizedAcademicYear
      );
      
      // Calculate summary statistics
      const summary = {
        totalStudents: new Set(validRecords.map(r => r.admissionNumber)).size,
        totalResults: validRecords.length,
        averageScore: validRecords.length > 0 
          ? parseFloat((validRecords.reduce((sum, r) => sum + r.averageScore, 0) / validRecords.length).toFixed(2))
          : 0
      };
      
      // Update batch status
      await prisma.resultUpload.update({
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
        message: `Successfully processed ${stats.validRows} result records for ${summary.totalStudents} students`,
        batch: {
          id: batchId,
          fileName: uploadBatch.fileName,
          term: normalizedTerm,
          academicYear: normalizedAcademicYear,
          status: 'completed'
        },
        summary,
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
        error: error.message || 'Results upload failed'
      },
      { status: 500 }
    );
  }
}

// GET - Retrieve results and upload history
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const admissionNumber = url.searchParams.get('admissionNumber');
    const form = url.searchParams.get('form');
    const term = url.searchParams.get('term');
    const academicYear = url.searchParams.get('academicYear');
    const subject = url.searchParams.get('subject');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const includeStudent = url.searchParams.get('includeStudent') === 'true';
    
    // Get upload history
    if (action === 'uploads') {
      const uploads = await prisma.resultUpload.findMany({
        orderBy: { uploadDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: {
            select: { results: true }
          }
        }
      });
      
      const total = await prisma.resultUpload.count();
      
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
          resultCount: upload._count.results
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
      const stats = await calculateResultsStatistics({});
      return NextResponse.json({
        success: true,
        data: stats
      });
    }
    
    // Get student report
    if (action === 'student-report' && admissionNumber) {
      const report = await generateStudentReport(admissionNumber);
      return NextResponse.json({
        success: true,
        data: report
      });
    }
    
    // Get class ranking
    if (action === 'class-ranking' && form) {
      const stream = url.searchParams.get('stream');
      const ranking = await calculateClassRanking(form, stream);
      return NextResponse.json({
        success: true,
        data: ranking
      });
    }
    
    // Get results for a specific student
    if (action === 'student-results' && admissionNumber) {
      const [results, student] = await Promise.all([
        prisma.studentResult.findMany({
          where: { admissionNumber },
          orderBy: [{ academicYear: 'desc' }, { term: 'desc' }]
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
            // subjectCombination removed (not in schema)
          }
        }) : Promise.resolve(null)
      ]);
      
      // Parse subjects and calculate totals
      const parsedResults = results.map(result => {
        const subjects = Array.isArray(result.subjects) ? result.subjects : 
          (typeof result.subjects === 'string' ? JSON.parse(result.subjects) : []);
        
        const totalScore = subjects.reduce((sum, s) => sum + (s.score || 0), 0);
        const averageScore = subjects.length > 0 ? totalScore / subjects.length : 0;
        const totalPoints = subjects.reduce((sum, s) => sum + (s.points || 0), 0);
        
        return {
          ...result,
          subjects,
          totalScore: parseFloat(totalScore.toFixed(2)),
          averageScore: parseFloat(averageScore.toFixed(2)),
          totalPoints
        };
      });
      
      // Calculate overall performance
      const overallStats = parsedResults.reduce((acc, result) => ({
        totalScore: acc.totalScore + result.totalScore,
        totalAverage: acc.totalAverage + result.averageScore,
        resultCount: acc.resultCount + 1
      }), { totalScore: 0, totalAverage: 0, resultCount: 0 });
      
      return NextResponse.json({
        success: true,
        student,
        results: parsedResults,
        overall: {
          averageScore: overallStats.resultCount > 0 
            ? parseFloat((overallStats.totalAverage / overallStats.resultCount).toFixed(2))
            : 0,
          totalResults: overallStats.resultCount
        }
      });
    }
    
    // Get subject performance
    if (action === 'subject-performance' && subject) {
      const results = await prisma.studentResult.findMany({
        where: {
          subjects: {
            path: '$[*].subject',
            array_contains: subject
        }
        },
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
        take: 100 // Limit for performance
      });
      
      // Extract subject scores
      const subjectResults = results.map(result => {
        const subjects = Array.isArray(result.subjects) ? result.subjects : 
          (typeof result.subjects === 'string' ? JSON.parse(result.subjects) : []);
        
        const subjectData = subjects.find(s => s.subject === subject);
        return {
          student: result.student,
          admissionNumber: result.admissionNumber,
          form: result.form,
          term: result.term,
          academicYear: result.academicYear,
          score: subjectData?.score || null,
          grade: subjectData?.grade || null
        };
      }).filter(r => r.score !== null);
      
      return NextResponse.json({
        success: true,
        subject,
        results: subjectResults,
        average: subjectResults.length > 0 
          ? parseFloat((subjectResults.reduce((sum, r) => sum + r.score, 0) / subjectResults.length).toFixed(2))
          : 0
      });
    }
    
    // Default: Get results with filters
    const where = {};
    
    if (admissionNumber) {
      where.admissionNumber = admissionNumber;
    }
    
    if (form) {
      where.form = form;
    }
    
    if (term) {
      where.term = term;
    }
    
    if (academicYear) {
      where.academicYear = academicYear;
    }
    
    // Get results with student info
    const [results, total] = await Promise.all([
      prisma.studentResult.findMany({
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
        orderBy: [{ academicYear: 'desc' }, { term: 'desc' }],
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.studentResult.count({ where })
    ]);
    
    // Parse subjects for each result
    const parsedResults = results.map(result => {
      const subjects = Array.isArray(result.subjects) ? result.subjects : 
        (typeof result.subjects === 'string' ? JSON.parse(result.subjects) : []);
      
      const totalScore = subjects.reduce((sum, s) => sum + (s.score || 0), 0);
      const averageScore = subjects.length > 0 ? totalScore / subjects.length : 0;
      
      return {
        ...result,
        subjects,
        totalScore: parseFloat(totalScore.toFixed(2)),
        averageScore: parseFloat(averageScore.toFixed(2))
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
          pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch results'
      },
      { status: 500 }
    );
  }
}

// PUT - Update a result
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

// DELETE - Delete result or upload batch
export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const batchId = url.searchParams.get('batchId');
    const resultId = url.searchParams.get('resultId');
    const admissionNumber = url.searchParams.get('admissionNumber');
    const form = url.searchParams.get('form');
    const term = url.searchParams.get('term');
    const academicYear = url.searchParams.get('academicYear');
    
    if (batchId) {
      // Delete result upload batch and associated records
      const result = await prisma.$transaction(async (tx) => {
        const batch = await tx.resultUpload.findUnique({
          where: { id: batchId }
        });
        
        if (!batch) {
          throw new Error('Batch not found');
        }
        
        // Get results from this batch
        const batchResults = await tx.studentResult.findMany({
          where: { uploadBatchId: batchId },
          select: { admissionNumber: true, form: true, term: true, academicYear: true }
        });
        
        // Delete results
        await tx.studentResult.deleteMany({
          where: { uploadBatchId: batchId }
        });
        
        // Delete batch
        await tx.resultUpload.delete({
          where: { id: batchId }
        });
        
        return { batch, deletedCount: batchResults.length };
      }, {
        maxWait: 15000,
        timeout: 15000
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
        message: `Deleted result for ${result.admissionNumber} (${result.form} ${result.term} ${result.academicYear})`
      });
    }
    
    if (admissionNumber && form && term && academicYear) {
      // Delete specific student result
      const result = await prisma.studentResult.findFirst({
        where: {
          admissionNumber,
          form,
          term,
          academicYear
        }
      });
      
      if (!result) {
        return NextResponse.json(
          { success: false, error: 'Result not found' },
          { status: 404 }
        );
      }
      
      await prisma.studentResult.delete({
        where: { id: result.id }
      });
      
      return NextResponse.json({
        success: true,
        message: `Deleted result for ${admissionNumber} (${form} ${term} ${academicYear})`
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Provide batchId, resultId, or student details' },
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
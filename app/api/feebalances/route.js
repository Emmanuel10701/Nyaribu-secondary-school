import { NextResponse } from 'next/server';
import { parse } from 'papaparse';
import * as XLSX from 'xlsx';
import { prisma } from '../../../libs/prisma';

// ========== HELPER FUNCTIONS ==========

// Helper to parse dates consistently
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  
  const str = String(dateStr).trim();
  
  // Reject extended year formats
  if (str.match(/^[+-]\d{6}/)) return null;
  
  // Try Excel serial number (dates are stored as numbers in Excel)
  if (!isNaN(str) && Number(str) > 0) {
    const excelDate = Number(str);
    // Check if it's a reasonable Excel date (between 1900 and 2100)
    if (excelDate > 0 && excelDate < 50000) {
      const date = new Date((excelDate - 25569) * 86400 * 1000);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        if (year >= 1900 && year <= 2100) {
          return date;
        }
      }
    }
  }
  
  // Try common date formats
  const dateFormats = [
    // ISO format
    () => {
      const date = new Date(str);
      return !isNaN(date.getTime()) && str.includes('-') ? date : null;
    },
    
    // DD/MM/YYYY or DD-MM-YYYY
    () => {
      const match = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
      if (match) {
        const day = parseInt(match[1]);
        const month = parseInt(match[2]) - 1;
        const year = parseInt(match[3]);
        const date = new Date(year, month, day);
        return !isNaN(date.getTime()) ? date : null;
      }
      return null;
    },
    
    // MM/DD/YYYY or MM-DD-YYYY
    () => {
      const match = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
      if (match) {
        const month = parseInt(match[1]) - 1;
        const day = parseInt(match[2]);
        const year = parseInt(match[3]);
        const date = new Date(year, month, day);
        return !isNaN(date.getTime()) ? date : null;
      }
      return null;
    },
    
    // YYYY/MM/DD or YYYY-MM-DD
    () => {
      const match = str.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
      if (match) {
        const year = parseInt(match[1]);
        const month = parseInt(match[2]) - 1;
        const day = parseInt(match[3]);
        const date = new Date(year, month, day);
        return !isNaN(date.getTime()) ? date : null;
      }
      return null;
    },
    
    // Text dates like "15 Jan 2024"
    () => {
      const date = new Date(str);
      return !isNaN(date.getTime()) ? date : null;
    }
  ];
  
  for (const format of dateFormats) {
    const date = format();
    if (date) {
      const year = date.getFullYear();
      if (year >= 1900 && year <= 2100) {
        return date;
      }
    }
  }
  
  return null;
};

// Normalize form values
const normalizeForm = (formValue) => {
  if (!formValue) return null;
  
  const str = String(formValue).toLowerCase().trim();
  
  // Handle numeric forms
  if (/^\d+$/.test(str)) {
    const num = parseInt(str);
    if (num >= 1 && num <= 4) {
      return `Form ${num}`;
    }
  }
  
  const formMap = {
    'form1': 'Form 1',
    'form 1': 'Form 1',
    '1': 'Form 1',
    'form2': 'Form 2',
    'form 2': 'Form 2',
    '2': 'Form 2',
    'form3': 'Form 3',
    'form 3': 'Form 3',
    '3': 'Form 3',
    'form4': 'Form 4',
    'form 4': 'Form 4',
    '4': 'Form 4',
    'f1': 'Form 1',
    'f2': 'Form 2',
    'f3': 'Form 3',
    'f4': 'Form 4'
  };
  
  return formMap[str] || formValue.charAt(0).toUpperCase() + formValue.slice(1).toLowerCase();
};

// Normalize term values
const normalizeTerm = (termValue) => {
  if (!termValue) return null;
  const str = String(termValue).trim();
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
  return termMap[str.toLowerCase()] || str;
};

// Normalize academic year
const normalizeAcademicYear = (yearValue) => {
  if (!yearValue) return null;
  const str = String(yearValue).trim();
  
  // Check if already in format 2024/2025
  if (/^\d{4}\/\d{4}$/.test(str)) {
    return str;
  }
  
  // Check if single year like 2024
  if (/^\d{4}$/.test(str)) {
    const year = parseInt(str);
    return `${year}/${year + 1}`;
  }
  
  return str;
};

// Parse amount values
const parseAmount = (value) => {
  if (value === undefined || value === null || value === '') {
    return 0;
  }
  
  // If it's already a number
  if (typeof value === 'number') {
    return Math.round(value * 100) / 100;
  }
  
  const str = String(value).trim();
  
  // Handle currency symbols and formatting
  const cleaned = str
    .replace(/[^\d.-]/g, '')  // Remove all non-numeric except dots and minus
    .replace(/(\..*)\./g, '$1'); // Remove multiple dots
  
  const parsed = parseFloat(cleaned);
  
  if (isNaN(parsed)) {
    // Try to extract numbers from strings like "KSH 1,500.00"
    const numberMatch = str.match(/(\d[\d,]*\.?\d*)/);
    if (numberMatch) {
      const numberStr = numberMatch[0].replace(/,/g, '');
      const parsedNumber = parseFloat(numberStr);
      return isNaN(parsedNumber) ? 0 : Math.round(parsedNumber * 100) / 100;
    }
    return 0;
  }
  
  return Math.round(parsed * 100) / 100;
};

// Calculate balance automatically
const calculateBalance = (amount, amountPaid) => {
  const total = parseAmount(amount);
  const paid = parseAmount(amountPaid);
  return Math.max(0, total - paid);
};

// Determine payment status
const determinePaymentStatus = (amount, amountPaid) => {
  const total = parseAmount(amount);
  const paid = parseAmount(amountPaid);
  
  if (paid <= 0) return 'pending';
  if (paid >= total) return 'paid';
  return 'partial';
};

// ========== VALIDATION FUNCTIONS ==========

// Validate and normalize form selection
const validateFormSelection = (forms) => {
  if (!forms || forms.length === 0) {
    throw new Error('Please select at least one form to upload');
  }
  
  const validForms = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];
  const normalizedForms = [];
  
  forms.forEach(form => {
    const normalized = normalizeForm(form);
    if (validForms.includes(normalized)) {
      normalizedForms.push(normalized);
    }
  });
  
  if (normalizedForms.length === 0) {
    throw new Error('Please select valid forms (Form 1, Form 2, Form 3, Form 4)');
  }
  
  return normalizedForms;
};

// Validate fee balance data
const validateFeeBalance = (feeBalance, index) => {
  const errors = [];
  
  // Admission number
  if (!feeBalance.admissionNumber) {
    errors.push(`Row ${index + 2}: Admission number is required`);
  } else if (!/^\d{4,10}$/.test(feeBalance.admissionNumber)) {
    errors.push(`Row ${index + 2}: Admission number must be 4-10 digits (got: ${feeBalance.admissionNumber})`);
  }
  
  // Form validation
  const normalizedForm = normalizeForm(feeBalance.form);
  const validForms = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];
  
  if (!validForms.includes(normalizedForm)) {
    errors.push(`Row ${index + 2}: Form must be one of: ${validForms.join(', ')} (got: ${feeBalance.form})`);
  }
  
  // Update with normalized form
  feeBalance.form = normalizedForm;
  
  // Term validation
  const normalizedTerm = normalizeTerm(feeBalance.term);
  const validTerms = ['Term 1', 'Term 2', 'Term 3'];
  
  if (!validTerms.includes(normalizedTerm)) {
    errors.push(`Row ${index + 2}: Term must be one of: ${validTerms.join(', ')} (got: ${feeBalance.term})`);
  }
  
  feeBalance.term = normalizedTerm;
  
  // Academic year validation
  if (!feeBalance.academicYear) {
    errors.push(`Row ${index + 2}: Academic year is required`);
  } else {
    feeBalance.academicYear = normalizeAcademicYear(feeBalance.academicYear);
  }
  
  // Amount validation
  const amount = parseAmount(feeBalance.amount);
  if (amount < 0) {
    errors.push(`Row ${index + 2}: Amount cannot be negative`);
  }
  
  const amountPaid = parseAmount(feeBalance.amountPaid);
  if (amountPaid < 0) {
    errors.push(`Row ${index + 2}: Amount paid cannot be negative`);
  }
  
  if (amountPaid > amount) {
    errors.push(`Row ${index + 2}: Amount paid (${amountPaid}) cannot be greater than total amount (${amount})`);
  }
  
  // Due date validation
  if (feeBalance.dueDate) {
    const dueDate = new Date(feeBalance.dueDate);
    if (isNaN(dueDate.getTime())) {
      errors.push(`Row ${index + 2}: Invalid due date format`);
    }
  }
  
  // Auto-calculate balance and status
  feeBalance.balance = calculateBalance(amount, amountPaid);
  feeBalance.paymentStatus = determinePaymentStatus(amount, amountPaid);
  
  return { isValid: errors.length === 0, errors };
};

// Check for duplicate fee balances
const checkDuplicateFeeBalances = async (feeBalances, targetForm = null, term = null, academicYear = null) => {
  const admissionNumbers = feeBalances.map(f => f.admissionNumber);
  
  const whereClause = {
    admissionNumber: { in: admissionNumbers }
  };
  
  if (targetForm) whereClause.form = targetForm;
  if (term) whereClause.term = term;
  if (academicYear) whereClause.academicYear = academicYear;
  
  const existingFees = await prisma.feeBalance.findMany({
    where: whereClause,
    select: {
      admissionNumber: true,
      form: true,
      term: true,
      academicYear: true
    }
  });
  
  const duplicates = feeBalances
    .map((fee, index) => {
      const existing = existingFees.find(f => 
        f.admissionNumber === fee.admissionNumber &&
        f.form === (targetForm || fee.form) &&
        f.term === (term || fee.term) &&
        f.academicYear === (academicYear || fee.academicYear)
      );
      if (existing) {
        return {
          row: index + 2,
          admissionNumber: fee.admissionNumber,
          form: existing.form,
          term: existing.term,
          academicYear: existing.academicYear
        };
      }
      return null;
    })
    .filter(dup => dup !== null);
  
  return duplicates;
};

// Check if students exist in database
const checkStudentsExist = async (admissionNumbers, targetForm = null) => {
  const whereClause = {
    admissionNumber: { in: admissionNumbers },
    status: 'active'
  };
  
  if (targetForm) {
    whereClause.form = targetForm;
  }
  
  const existingStudents = await prisma.databaseStudent.findMany({
    where: whereClause,
    select: {
      admissionNumber: true,
      firstName: true,
      lastName: true,
      form: true
    }
  });
  
  const missingStudents = admissionNumbers.filter(num => 
    !existingStudents.find(s => s.admissionNumber === num)
  );
  
  return {
    existingStudents,
    missingStudents,
    existingStudentMap: new Map(existingStudents.map(s => [s.admissionNumber, s]))
  };
};

// ========== FILE PARSING FUNCTIONS ==========

// Parse CSV files - handles files without form column by extracting from filename
const parseFeeCSV = async (file, fileName = '') => {
  try {
    const text = await file.text();
    
    return await new Promise((resolve, reject) => {
      parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log('CSV Parsing - Raw headers:', Object.keys(results.data[0] || {}));
          
          // Try to extract form from filename
          let extractedForm = null;
          if (fileName.toLowerCase().includes('form_1') || fileName.toLowerCase().includes('form1')) {
            extractedForm = 'Form 1';
          } else if (fileName.toLowerCase().includes('form_2') || fileName.toLowerCase().includes('form2')) {
            extractedForm = 'Form 2';
          } else if (fileName.toLowerCase().includes('form_3') || fileName.toLowerCase().includes('form3')) {
            extractedForm = 'Form 3';
          } else if (fileName.toLowerCase().includes('form_4') || fileName.toLowerCase().includes('form4')) {
            extractedForm = 'Form 4';
          }
          
          const data = results.data
            .map((row, index) => {
              try {
                // Function to find value with multiple possible keys
                const findValue = (possibleKeys) => {
                  for (const key of possibleKeys) {
                    const value = row[key];
                    if (value !== undefined && value !== null && value !== '') {
                      return String(value).trim();
                    }
                  }
                  return '';
                };
                
                const admissionNumber = findValue([
                  'admissionNumber', 'AdmissionNumber', 'Admission Number',
                  'admission', 'Admission', 'ADMISSION',
                  'admno', 'AdmNo', 'ADMNO',
                  'StudentID', 'Student ID', 'studentid',
                  'ID', 'Id', 'id'
                ]);
                
                // Try to find form in row, otherwise use extracted form
                let form = findValue([
                  'form', 'Form', 'FORM', 
                  'class', 'Class', 'CLASS', 
                  'grade', 'Grade'
                ]);
                
                // If form not found in row, use extracted form from filename
                if (!form && extractedForm) {
                  form = extractedForm;
                }
                
                const term = findValue([
                  'term', 'Term', 'TERM', 
                  'semester', 'Semester', 
                  'trimester'
                ]);
                
                const academicYear = findValue([
                  'academicYear', 'AcademicYear', 'Academic Year',
                  'year', 'Year', 'YEAR',
                  'session', 'Session',
                  'academic_session', 'Academic Session'
                ]);
                
                // Get amount and amountPaid directly
                let amount = parseAmount(row['amount'] || row['Amount'] || 0);
                let amountPaid = parseAmount(row['amountPaid'] || row['AmountPaid'] || 
                                           row['paid'] || row['Paid'] || 0);
                
                // If not found with standard keys, check all columns
                if (amount === 0) {
                  for (const [key, value] of Object.entries(row)) {
                    const keyLower = key.toLowerCase();
                    if (keyLower.includes('amount') && !keyLower.includes('paid') && 
                        !keyLower.includes('balance')) {
                      amount = parseAmount(value);
                      break;
                    }
                  }
                }
                
                if (amountPaid === 0) {
                  for (const [key, value] of Object.entries(row)) {
                    const keyLower = key.toLowerCase();
                    if (keyLower.includes('paid') || keyLower.includes('amountpaid')) {
                      amountPaid = parseAmount(value);
                      break;
                    }
                  }
                }
                
                const dueDate = findValue([
                  'dueDate', 'DueDate', 'Due Date',
                  'duedate', 'Duedate',
                  'deadline', 'Deadline'
                ]);
                
                // Validate required fields
                if (!admissionNumber) {
                  console.warn(`Row ${index + 2} skipped - missing admission number`);
                  return null;
                }
                
                if (!form) {
                  console.warn(`Row ${index + 2} skipped - missing form`);
                  return null;
                }
                
                if (!term) {
                  console.warn(`Row ${index + 2} skipped - missing term`);
                  return null;
                }
                
                if (!academicYear) {
                  console.warn(`Row ${index + 2} skipped - missing academic year`);
                  return null;
                }
                
                return {
                  admissionNumber,
                  form: normalizeForm(form),
                  term,
                  academicYear: normalizeAcademicYear(academicYear),
                  amount,
                  amountPaid,
                  dueDate: parseDate(dueDate)
                };
              } catch (error) {
                console.error(`Error parsing CSV row ${index}:`, error, row);
                return null;
              }
            })
            .filter(item => item !== null);
          
          console.log(`CSV Parsing - Found ${data.length} valid rows out of ${results.data.length}`);
          
          if (data.length === 0) {
            reject(new Error(`No valid fee balance data found in CSV file. 
Required columns: admission number, term, academic year, amount, amount paid.
Optional: form (can be extracted from filename like form_1_fees.csv).
Your file headers: ${Object.keys(results.data[0] || {}).join(', ')}`));
            return;
          }
          
          resolve(data);
        },
        error: reject
      });
    });
    
  } catch (error) {
    console.error('CSV parsing error:', error);
    throw new Error(`CSV parsing failed: ${error.message}`);
  }
};

// Parse Excel files - handles files without form column by extracting from filename
const parseFeeExcel = async (file, fileName = '') => {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });
    
    console.log('Excel Parsing - Columns:', Object.keys(jsonData[0] || {}));
    
    // Try to extract form from filename
    let extractedForm = null;
    if (fileName.toLowerCase().includes('form_1') || fileName.toLowerCase().includes('form1')) {
      extractedForm = 'Form 1';
    } else if (fileName.toLowerCase().includes('form_2') || fileName.toLowerCase().includes('form2')) {
      extractedForm = 'Form 2';
    } else if (fileName.toLowerCase().includes('form_3') || fileName.toLowerCase().includes('form3')) {
      extractedForm = 'Form 3';
    } else if (fileName.toLowerCase().includes('form_4') || fileName.toLowerCase().includes('form4')) {
      extractedForm = 'Form 4';
    }
    
    const data = jsonData
      .map((row, index) => {
        try {
          // Function to find value with multiple possible keys
          const findValue = (possibleKeys) => {
            for (const key of possibleKeys) {
              // Direct key match
              if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
                return String(row[key]).trim();
              }
              
              // Case-insensitive match
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
          
          // Look for admission number
          const admissionNumber = findValue([
            'admissionNumber', 'AdmissionNumber', 'Admission Number',
            'admission', 'Admission', 'ADMISSION',
            'admno', 'AdmNo', 'ADMNO',
            'StudentID', 'Student ID', 'studentid',
            'ID', 'Id', 'id'
          ]);
          
          // Look for form in row, otherwise use extracted form
          let form = findValue([
            'form', 'Form', 'FORM',
            'class', 'Class', 'CLASS',
            'grade', 'Grade', 'GRADE',
            'level', 'Level', 'LEVEL'
          ]);
          
          // If form not found in row, use extracted form from filename
          if (!form && extractedForm) {
            form = extractedForm;
          }
          
          // Look for term
          const term = findValue([
            'term', 'Term', 'TERM',
            'semester', 'Semester', 'SEMESTER',
            'trimester', 'Trimester'
          ]);
          
          // Look for academic year
          const academicYear = findValue([
            'academicYear', 'AcademicYear', 'Academic Year',
            'year', 'Year', 'YEAR',
            'session', 'Session', 'SESSION',
            'academic_session', 'Academic Session',
            'academic year', 'Academic Year'
          ]);
          
          // Get amount and amountPaid directly
          let amount = parseAmount(row['amount'] || row['Amount'] || 0);
          let amountPaid = parseAmount(row['amountPaid'] || row['AmountPaid'] || 
                                      row['paid'] || row['Paid'] || 0);
          
          // If not found with standard keys, check all columns
          if (amount === 0) {
            for (const [key, value] of Object.entries(row)) {
              const keyLower = key.toLowerCase();
              if (keyLower.includes('amount') && !keyLower.includes('paid') && 
                  !keyLower.includes('balance')) {
                amount = parseAmount(value);
                break;
              }
            }
          }
          
          if (amountPaid === 0) {
            for (const [key, value] of Object.entries(row)) {
              const keyLower = key.toLowerCase();
              if (keyLower.includes('paid') || keyLower.includes('amountpaid')) {
                amountPaid = parseAmount(value);
                break;
              }
            }
          }
          
          // Look for due date
          const dueDate = findValue([
            'dueDate', 'DueDate', 'Due Date',
            'due_date', 'duedate', 'Duedate',
            'deadline', 'Deadline'
          ]);
          
          // Validate required fields
          if (!admissionNumber) {
            console.warn(`Row ${index + 2} skipped - missing admission number`);
            return null;
          }
          
          if (!form) {
            console.warn(`Row ${index + 2} skipped - missing form`);
            return null;
          }
          
          if (!term) {
            console.warn(`Row ${index + 2} skipped - missing term`);
            return null;
          }
          
          if (!academicYear) {
            console.warn(`Row ${index + 2} skipped - missing academic year`);
            return null;
          }
          
          return {
            admissionNumber,
            form: normalizeForm(form),
            term,
            academicYear: normalizeAcademicYear(academicYear),
            amount,
            amountPaid,
            dueDate: parseDate(dueDate)
          };
        } catch (error) {
          console.error(`Error parsing Excel row ${index}:`, error, row);
          return null;
        }
      })
      .filter(item => item !== null);
    
    console.log(`Excel Parsing - Found ${data.length} valid rows out of ${jsonData.length}`);
    
    if (data.length === 0) {
      throw new Error(`No valid fee balance data found in Excel file. 
Required columns: admission number, term, academic year, amount, amount paid.
Optional: form (can be extracted from filename like form_1_fees.xlsx).
Your file headers: ${Object.keys(jsonData[0] || {}).join(', ')}`);
    }
    
    return data;
    
  } catch (error) {
    console.error('Excel parsing error:', error);
    throw new Error(`Excel parsing failed: ${error.message}`);
  }
};

// ========== PROCESSING FUNCTIONS ==========

// Process New Upload
const processNewFeeUpload = async (fees, uploadBatchId, selectedForms, duplicateAction = 'skip') => {
  const stats = {
    totalRows: fees.length,
    validRows: 0,
    skippedRows: 0,
    errorRows: 0,
    errors: [],
    createdFees: [],
    updatedFees: []
  };
  
  // Filter fees to only include selected forms
  const filteredFees = fees.filter(fee => {
    fee.form = normalizeForm(fee.form);
    return selectedForms.includes(fee.form);
  });
  
  if (filteredFees.length === 0) {
    throw new Error(`No fees found for selected forms: ${selectedForms.join(', ')}`);
  }
  
  // Check if students exist
  const admissionNumbers = filteredFees.map(f => f.admissionNumber);
  const studentCheck = await checkStudentsExist(admissionNumbers);
  
  // Check for existing fees
  const existingFees = await prisma.feeBalance.findMany({
    where: {
      admissionNumber: { in: admissionNumbers }
    },
    select: {
      admissionNumber: true,
      form: true,
      term: true,
      academicYear: true,
      id: true
    }
  });
  
  const existingFeeMap = new Map();
  existingFees.forEach(fee => {
    const key = `${fee.admissionNumber}_${fee.form}_${fee.term}_${fee.academicYear}`;
    existingFeeMap.set(key, fee);
  });
  
  const seenFeeKeys = new Set();
  const feesToCreate = [];
  const feesToUpdate = [];
  
  for (const [index, fee] of filteredFees.entries()) {
    const validation = validateFeeBalance(fee, index);
    
    if (!validation.isValid) {
      stats.errorRows++;
      stats.errors.push(...validation.errors);
      continue;
    }
    
    const admissionNumber = fee.admissionNumber;
    
    // Check if student exists
    const student = studentCheck.existingStudentMap.get(admissionNumber);
    if (!student) {
      stats.errorRows++;
      stats.errors.push(`Row ${index + 2}: Student ${admissionNumber} not found in database`);
      continue;
    }
    
    // Check if student form matches fee form
    if (student.form !== fee.form) {
      stats.skippedRows++;
      stats.errors.push(`Row ${index + 2}: Student ${student.firstName} ${student.lastName} (${admissionNumber}) is in ${student.form}, not ${fee.form}. Skipped.`);
      continue;
    }
    
    const feeKey = `${admissionNumber}_${fee.form}_${fee.term}_${fee.academicYear}`;
    
    // Check duplicates within the file
    if (seenFeeKeys.has(feeKey)) {
      stats.skippedRows++;
      stats.errors.push(`Row ${index + 2}: Duplicate fee entry in file: ${admissionNumber} - ${fee.form} ${fee.term} ${fee.academicYear}`);
      continue;
    }
    seenFeeKeys.add(feeKey);
    
    // Check if fee already exists
    const existingFee = existingFeeMap.get(feeKey);
    
    if (existingFee) {
      if (duplicateAction === 'skip') {
        stats.skippedRows++;
        stats.errors.push(`Row ${index + 2}: Skipped - fee already exists for ${admissionNumber} - ${fee.form} ${fee.term} ${fee.academicYear}`);
        continue;
      } else if (duplicateAction === 'replace') {
        feesToUpdate.push({
          id: existingFee.id,
          data: {
            amount: fee.amount,
            amountPaid: fee.amountPaid,
            balance: fee.balance,
            paymentStatus: fee.paymentStatus,
            dueDate: fee.dueDate,
            updatedAt: new Date(),
            uploadBatchId: uploadBatchId
          }
        });
        stats.updatedFees.push(fee);
      }
    } else {
      feesToCreate.push({
        admissionNumber: fee.admissionNumber,
        form: fee.form,
        term: fee.term,
        academicYear: fee.academicYear,
        amount: fee.amount,
        amountPaid: fee.amountPaid,
        balance: fee.balance,
        paymentStatus: fee.paymentStatus,
        dueDate: fee.dueDate,
        uploadBatchId: uploadBatchId
      });
      stats.createdFees.push(fee);
    }
    
    stats.validRows++;
  }
  
  // Execute database operations
  if (feesToCreate.length > 0) {
    try {
      await prisma.feeBalance.createMany({
        data: feesToCreate
      });
    } catch (error) {
      console.error('Error creating fees:', error);
      stats.errorRows += feesToCreate.length;
      stats.errors.push(`Failed to create ${feesToCreate.length} fees: ${error.message}`);
    }
  }
  
  if (feesToUpdate.length > 0) {
    for (const update of feesToUpdate) {
      try {
        await prisma.feeBalance.update({
          where: { id: update.id },
          data: update.data
        });
      } catch (error) {
        console.error('Error updating fee:', error);
        stats.errorRows++;
        stats.errors.push(`Failed to update fee: ${error.message}`);
      }
    }
  }
  
  return stats;
};

// Process Update Upload
const processUpdateFeeUpload = async (fees, uploadBatchId, targetForm, term, academicYear) => {
  const stats = {
    totalRows: fees.length,
    validRows: 0,
    skippedRows: 0,
    errorRows: 0,
    errors: [],
    createdFees: [],
    updatedFees: [],
    deactivatedFees: 0
  };
  
  // Normalize target parameters
  const normalizedTargetForm = normalizeForm(targetForm);
  const normalizedTerm = normalizeTerm(term);
  const normalizedYear = normalizeAcademicYear(academicYear);
  
  // Filter fees for target form
  const filteredFees = fees.filter(fee => {
    fee.form = normalizeForm(fee.form);
    fee.term = normalizeTerm(fee.term);
    fee.academicYear = normalizeAcademicYear(fee.academicYear);
    return fee.form === normalizedTargetForm;
  });
  
  if (filteredFees.length === 0) {
    throw new Error(`No fees found for form ${normalizedTargetForm}. Make sure the form column matches the selected form.`);
  }
  
  // Check if students exist in the target form
  const admissionNumbers = filteredFees.map(f => f.admissionNumber);
  const studentCheck = await checkStudentsExist(admissionNumbers, normalizedTargetForm);
  
  // Get existing fees for this form/term/year
  const existingFees = await prisma.feeBalance.findMany({
    where: {
      form: normalizedTargetForm,
      term: normalizedTerm,
      academicYear: normalizedYear
    },
    select: {
      admissionNumber: true,
      id: true
    }
  });
  
  const existingFeeMap = new Map();
  existingFees.forEach(fee => {
    existingFeeMap.set(fee.admissionNumber, fee);
  });
  
  const seenAdmissionNumbers = new Set();
  const admissionNumbersInNewUpload = new Set();
  const feesToCreate = [];
  const feesToUpdate = [];
  
  for (const [index, fee] of filteredFees.entries()) {
    const validation = validateFeeBalance(fee, index);
    
    if (!validation.isValid) {
      stats.errorRows++;
      stats.errors.push(...validation.errors);
      continue;
    }
    
    const admissionNumber = fee.admissionNumber;
    
    // Check duplicates within the file
    if (seenAdmissionNumbers.has(admissionNumber)) {
      stats.errorRows++;
      stats.errors.push(`Row ${index + 2}: Duplicate admission number in file: ${admissionNumber}`);
      continue;
    }
    seenAdmissionNumbers.add(admissionNumber);
    admissionNumbersInNewUpload.add(admissionNumber);
    
    // Check if student exists in target form
    const student = studentCheck.existingStudentMap.get(admissionNumber);
    if (!student) {
      stats.skippedRows++;
      stats.errors.push(`Row ${index + 2}: Student ${admissionNumber} not found in ${normalizedTargetForm}`);
      continue;
    }
    
    // Check if fee already exists
    const existingFee = existingFeeMap.get(admissionNumber);
    
    if (existingFee) {
      // Update existing fee
      feesToUpdate.push({
        id: existingFee.id,
        data: {
          amount: fee.amount,
          amountPaid: fee.amountPaid,
          balance: fee.balance,
          paymentStatus: fee.paymentStatus,
          dueDate: fee.dueDate,
          updatedAt: new Date(),
          uploadBatchId: uploadBatchId
        }
      });
      stats.updatedFees.push(fee);
    } else {
      // Create new fee
      feesToCreate.push({
        admissionNumber: fee.admissionNumber,
        form: normalizedTargetForm,
        term: normalizedTerm,
        academicYear: normalizedYear,
        amount: fee.amount,
        amountPaid: fee.amountPaid,
        balance: fee.balance,
        paymentStatus: fee.paymentStatus,
        dueDate: fee.dueDate,
        uploadBatchId: uploadBatchId
      });
      stats.createdFees.push(fee);
    }
    
    stats.validRows++;
  }
  
  // Execute database operations
  if (feesToCreate.length > 0) {
    try {
      await prisma.feeBalance.createMany({
        data: feesToCreate
      });
    } catch (error) {
      console.error('Error creating fees:', error);
      stats.errorRows += feesToCreate.length;
      stats.errors.push(`Failed to create ${feesToCreate.length} fees: ${error.message}`);
    }
  }
  
  if (feesToUpdate.length > 0) {
    for (const update of feesToUpdate) {
      try {
        await prisma.feeBalance.update({
          where: { id: update.id },
          data: update.data
        });
      } catch (error) {
        console.error('Error updating fee:', error);
        stats.errorRows++;
        stats.errors.push(`Failed to update fee: ${error.message}`);
      }
    }
  }
  
  // Deactivate fees not in the new upload (soft delete)
  const feesToDeactivate = existingFees.filter(fee => 
    !admissionNumbersInNewUpload.has(fee.admissionNumber)
  );
  
  if (feesToDeactivate.length > 0) {
    await prisma.feeBalance.deleteMany({
      where: {
        id: { in: feesToDeactivate.map(f => f.id) }
      }
    });
    
    stats.deactivatedFees = feesToDeactivate.length;
  }
  
  return stats;
};

// ========== STATISTICS FUNCTIONS ==========

// Calculate fee statistics
const calculateFeeStatistics = async (whereClause = {}) => {
  try {
    // Get all fees for calculations
    const allFees = await prisma.feeBalance.findMany({
      where: whereClause,
      select: {
        amount: true,
        amountPaid: true,
        balance: true,
        form: true,
        term: true,
        academicYear: true,
        paymentStatus: true
      }
    });
    
    if (allFees.length === 0) {
      return {
        stats: {
          totalAmount: 0,
          totalPaid: 0,
          totalBalance: 0,
          totalRecords: 0,
          formDistribution: {},
          termDistribution: {},
          yearDistribution: {},
          statusDistribution: {},
          updatedAt: new Date()
        },
        validation: {
          isValid: true,
          totalRecords: 0,
          calculatedTotals: { amount: 0, paid: 0, balance: 0 }
        }
      };
    }
    
    let totalAmount = 0;
    let totalPaid = 0;
    let totalBalance = 0;
    
    const formDistribution = {};
    const termDistribution = {};
    const yearDistribution = {};
    const statusDistribution = {};
    
    // Process each fee
    allFees.forEach(fee => {
      totalAmount += fee.amount;
      totalPaid += fee.amountPaid;
      totalBalance += fee.balance;
      
      // Form distribution
      formDistribution[fee.form] = (formDistribution[fee.form] || 0) + 1;
      
      // Term distribution
      termDistribution[fee.term] = (termDistribution[fee.term] || 0) + 1;
      
      // Year distribution
      yearDistribution[fee.academicYear] = (yearDistribution[fee.academicYear] || 0) + 1;
      
      // Status distribution
      statusDistribution[fee.paymentStatus] = (statusDistribution[fee.paymentStatus] || 0) + 1;
    });
    
    const stats = {
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      totalPaid: parseFloat(totalPaid.toFixed(2)),
      totalBalance: parseFloat(totalBalance.toFixed(2)),
      totalRecords: allFees.length,
      formDistribution,
      termDistribution,
      yearDistribution,
      statusDistribution,
      updatedAt: new Date()
    };
    
    return {
      stats,
      validation: {
        isValid: true,
        totalRecords: allFees.length,
        calculatedTotals: {
          amount: stats.totalAmount,
          paid: stats.totalPaid,
          balance: stats.totalBalance
        }
      }
    };
    
  } catch (error) {
    console.error('Error calculating fee statistics:', error);
    return {
      stats: {
        totalAmount: 0,
        totalPaid: 0,
        totalBalance: 0,
        totalRecords: 0,
        formDistribution: {},
        termDistribution: {},
        yearDistribution: {},
        statusDistribution: {},
        updatedAt: new Date()
      },
      validation: {
        isValid: false,
        error: error.message
      }
    };
  }
};

// ========== API ENDPOINTS ==========
// POST - ULTRA SIMPLE fee balances upload
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const uploadType = formData.get('uploadType'); // 'new' or 'update'
    const selectedForm = formData.get('selectedForm'); // Accept this for both
    const targetForm = formData.get('targetForm'); // Also accept this
    const checkDuplicates = formData.get('checkDuplicates') === 'true';
    const termParam = formData.get('term'); // Get term from form data (OPTIONAL)
    const academicYearParam = formData.get('academicYear'); // Get academic year from form data (OPTIONAL)
    
    console.log('🔍 Upload Parameters:', {
      uploadType,
      selectedForm,
      targetForm,
      checkDuplicates,
      termParam: termParam || 'NOT PROVIDED',
      academicYearParam: academicYearParam || 'NOT PROVIDED'
    });
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }
    
    if (!uploadType) {
      return NextResponse.json({ success: false, error: 'Upload type is required' }, { status: 400 });
    }
    
    // Get the form to use
    const formToUse = targetForm || selectedForm;
    if (!formToUse) {
      return NextResponse.json({ success: false, error: 'Form is required' }, { status: 400 });
    }
    
    // Validate file type
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.split('.').pop();
    if (!['csv', 'xlsx', 'xls'].includes(fileExtension)) {
      return NextResponse.json({ success: false, error: 'Invalid file type' }, { status: 400 });
    }
    
    // Parse file
    let rawData = [];
    if (fileExtension === 'csv') {
      rawData = await parseFeeCSV(file, file.name);
    } else {
      rawData = await parseFeeExcel(file, file.name);
    }
    
    if (rawData.length === 0) {
      throw new Error('No valid fee data found in file.');
    }
    
    console.log(`📊 Parsed ${rawData.length} rows from file`);
    
    // Extract term and academic year from FIRST ROW of file
    let extractedTerm = '';
    let extractedAcademicYear = '';
    
    if (rawData.length > 0) {
      const firstRow = rawData[0];
      extractedTerm = firstRow.term || '';
      extractedAcademicYear = firstRow.academicYear || '';
      
      console.log('📋 EXTRACTED from first row of file:', {
        term: extractedTerm || 'NOT FOUND IN FILE',
        academicYear: extractedAcademicYear || 'NOT FOUND IN FILE'
      });
    }
    
    // Determine final term and academic year
    let finalTerm = '';
    let finalAcademicYear = '';
    
    // Strategy for BOTH new and update uploads:
    // 1. First try to get from the file (most reliable)
    // 2. Then try from parameters (optional)
    // 3. Use reasonable defaults if not found
    
    // For NEW uploads: Use file values, fallback to params, then defaults
    if (uploadType === 'new') {
      finalTerm = extractedTerm || termParam || 'Term 1';
      finalAcademicYear = extractedAcademicYear || academicYearParam || '2024/2025';
      console.log('✅ NEW upload - Using term/year:', { finalTerm, finalAcademicYear });
    }
    // For UPDATE uploads: Same logic - file > params > defaults
    else if (uploadType === 'update') {
      finalTerm = extractedTerm || termParam || 'Term 1';
      finalAcademicYear = extractedAcademicYear || academicYearParam || '2024/2025';
      console.log('✅ UPDATE upload - Using term/year:', { finalTerm, finalAcademicYear });
      
      // Just log what we're using, but don't require them
      console.log('ℹ️ Update upload using:', {
        source: extractedTerm ? 'file' : (termParam ? 'params' : 'default'),
        term: finalTerm,
        academicYear: finalAcademicYear
      });
    }
    
    // Normalize the values
    finalTerm = normalizeTerm(finalTerm);
    finalAcademicYear = normalizeAcademicYear(finalAcademicYear);
    
    console.log('✅ FINAL values to use:', {
      form: formToUse,
      term: finalTerm,
      academicYear: finalAcademicYear,
      uploadType,
      source: extractedTerm ? 'file' : (termParam ? 'params' : 'default')
    });
    
    // If just checking duplicates
    if (checkDuplicates) {
      // For duplicate check, use the term/year we determined
      const duplicates = await checkDuplicateFeeBalances(
        rawData, 
        formToUse, 
        finalTerm, // Use final term
        finalAcademicYear  // Use final academic year
      );
      
      return NextResponse.json({
        success: true,
        hasDuplicates: duplicates.length > 0,
        duplicates: duplicates,
        totalRows: rawData.length,
        form: formToUse,
        term: finalTerm,
        academicYear: finalAcademicYear,
        message: `Checking duplicates for ${formToUse} - ${finalTerm} ${finalAcademicYear}`
      });
    }
    
    // Create batch record
    const batchId = `FEE_BATCH_${Date.now()}`;
    
    try {
      await prisma.feeBalanceUpload.create({
        data: {
          id: batchId,
          fileName: file.name,
          fileType: fileExtension,
          uploadedBy: 'System Upload',
          status: 'processing',
          targetForm: formToUse,
          term: finalTerm,
          academicYear: finalAcademicYear,
          totalRows: rawData.length,
          validRows: 0,
          skippedRows: 0,
          errorRows: 0,
          uploadType: uploadType
        }
      });
    } catch (prismaError) {
      console.error('Prisma create error:', prismaError);
      // Try without optional fields
      await prisma.feeBalanceUpload.create({
        data: {
          id: batchId,
          fileName: file.name,
          fileType: fileExtension,
          uploadedBy: 'System Upload',
          status: 'processing',
          targetForm: formToUse,
          uploadType: uploadType
        }
      });
    }
    
    // Process the upload
    let processingStats;
    if (uploadType === 'new') {
      processingStats = await processNewFeeUpload(rawData, batchId, [formToUse], 'skip');
    } else {
      // For update, always use replace strategy with the term/year we determined
      processingStats = await processUpdateFeeUpload(rawData, batchId, formToUse, finalTerm, finalAcademicYear);
    }
    
    // Update batch
    await prisma.feeBalanceUpload.update({
      where: { id: batchId },
      data: {
        status: 'completed',
        processedDate: new Date(),
        validRows: processingStats.validRows,
        skippedRows: processingStats.skippedRows,
        errorRows: processingStats.errorRows
      }
    });
    
    return NextResponse.json({
      success: true,
      message: `Successfully ${uploadType === 'new' ? 'added' : 'updated'} ${processingStats.validRows} fees for ${formToUse}`,
      details: {
        form: formToUse,
        term: finalTerm,
        academicYear: finalAcademicYear,
        created: processingStats.createdFees?.length || 0,
        updated: processingStats.updatedFees?.length || 0,
        deactivated: processingStats.deactivatedFees || 0
      }
    });
    
  } catch (error) {
    console.error('❌ Upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Upload failed',
        suggestion: 'Make sure your file has: admissionNumber, amount, amountPaid columns. Term and academic year will be extracted from file or use defaults.'
      },
      { status: 500 }
    );
  }
}

// GET - Fetch fee balances, uploads, or statistics
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const admissionNumber = url.searchParams.get('admissionNumber');
    const form = url.searchParams.get('form') || '';
    const term = url.searchParams.get('term') || '';
    const academicYear = url.searchParams.get('academicYear') || '';
    const paymentStatus = url.searchParams.get('paymentStatus') || '';
    const search = url.searchParams.get('search') || '';
    const sortBy = url.searchParams.get('sortBy') || 'updatedAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';
    const includeStudent = url.searchParams.get('includeStudent') === 'true';
    const includeStats = url.searchParams.get('includeStats') !== 'false';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    
    // Build WHERE clause
    const where = {};
    
    if (admissionNumber) where.admissionNumber = admissionNumber;
    if (form) where.form = form;
    if (term) where.term = term;
    if (academicYear) where.academicYear = academicYear;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    
    if (search && search.trim()) {
      const searchTerm = search.toLowerCase();
      where.OR = [
        { admissionNumber: { contains: searchTerm } }
      ];
    }
    
    if (action === 'uploads') {
      // Fetch upload history
      const uploads = await prisma.feeBalanceUpload.findMany({
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
          targetForm: true,
          totalRows: true,
          validRows: true,
          skippedRows: true,
          errorRows: true,
          errorLog: true,
          uploadType: true
        }
      });
      
      const total = await prisma.feeBalanceUpload.count();
      
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
      // Calculate fresh statistics
      const statsResult = await calculateFeeStatistics(where);
      
      return NextResponse.json({
        success: true,
        data: {
          stats: statsResult.stats,
          filters: { form, term, academicYear, paymentStatus, search },
          validation: statsResult.validation,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // Get fee balances with pagination
    const orderBy = {};
    orderBy[sortBy] = sortOrder;
    
    const [fees, total] = await Promise.all([
      prisma.feeBalance.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: includeStudent ? {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              admissionNumber: true,
              form: true,
              stream: true,
              email: true
            }
          }
        } : undefined
      }),
      prisma.feeBalance.count({ where })
    ]);
    
    // Calculate statistics if requested
    let statsResult = null;
    if (includeStats) {
      statsResult = await calculateFeeStatistics(where);
    }
    
    return NextResponse.json({
      success: true,
      data: {
        feeBalances: fees,
        stats: statsResult?.stats || null,
        validation: statsResult?.validation || null,
        filters: { form, term, academicYear, paymentStatus, search },
        pagination: { 
          page, 
          limit, 
          total, 
          pages: Math.ceil(total / limit) 
        },
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch fee balances',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// PUT - Update single fee balance
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Fee ID is required' },
        { status: 400 }
      );
    }
    
    // Auto-calculate balance if amount or amountPaid is updated
    if (updateData.amount !== undefined || updateData.amountPaid !== undefined) {
      const currentFee = await prisma.feeBalance.findUnique({
        where: { id },
        select: { amount: true, amountPaid: true }
      });
      
      const amount = updateData.amount !== undefined ? updateData.amount : currentFee.amount;
      const amountPaid = updateData.amountPaid !== undefined ? updateData.amountPaid : currentFee.amountPaid;
      
      updateData.balance = calculateBalance(amount, amountPaid);
      updateData.paymentStatus = determinePaymentStatus(amount, amountPaid);
    }
    
    // Normalize data
    if (updateData.form) updateData.form = normalizeForm(updateData.form);
    if (updateData.term) updateData.term = normalizeTerm(updateData.term);
    if (updateData.academicYear) updateData.academicYear = normalizeAcademicYear(updateData.academicYear);
    
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
      data: {
        feeBalance: updatedFee
      }
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

// DELETE - Delete fee balance or batch
export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const batchId = url.searchParams.get('batchId');
    const feeId = url.searchParams.get('feeId');
    
    if (batchId) {
      // Delete batch and associated fees
      const result = await prisma.$transaction(async (tx) => {
        const batch = await tx.feeBalanceUpload.findUnique({
          where: { id: batchId }
        });
        
        if (!batch) {
          throw new Error('Batch not found');
        }
        
        // Delete all fees from this batch
        const deleteResult = await tx.feeBalance.deleteMany({
          where: { uploadBatchId: batchId }
        });
        
        // Delete batch record
        await tx.feeBalanceUpload.delete({
          where: { id: batchId }
        });
        
        return { 
          batch, 
          deletedCount: deleteResult.count
        };
      });
      
      return NextResponse.json({
        success: true,
        message: `Deleted batch ${result.batch.fileName} and ${result.deletedCount} fee balances`
      });
    }
    
    if (feeId) {
      // Delete single fee balance
      const fee = await prisma.feeBalance.delete({
        where: { id: feeId }
      });
      
      return NextResponse.json({
        success: true,
        message: `Deleted fee balance for ${fee.admissionNumber} - ${fee.term} ${fee.academicYear}`
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Provide batchId or feeId' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Delete failed' },
      { status: 500 }
    );
  }
}
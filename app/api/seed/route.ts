import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import {
  User, School, Course, Student, Teacher, Assignment, Submission,
  Exam, TimetableEntry, Book, Vehicle, Notification, Attendance,
  FeeStructure, Payment
} from '@/lib/models';

const SEED_SECRET = process.env.SEED_SECRET || 'eduverse-seed-2026';
const UNIVERSAL_PASSWORD = 'Edu@2026';

// ══════════════════════════════════════════════════════════════════════════════
// Realistic Indian College Data
// ══════════════════════════════════════════════════════════════════════════════

const SCHOOL_NAME = 'Sunderdeep Group of Institutions';
const SCHOOL_SHORT = 'sunderdeep';

const COURSES = [
  { name: 'B.Tech Computer Science', durationYears: 4, short: 'btech-cs' },
  { name: 'B.Tech Mechanical Engineering', durationYears: 4, short: 'btech-me' },
  { name: 'B.Tech Electronics & Communication', durationYears: 4, short: 'btech-ece' },
  { name: 'B.Tech Civil Engineering', durationYears: 4, short: 'btech-ce' },
  { name: 'BBA', durationYears: 3, short: 'bba' },
  { name: 'B.Pharma', durationYears: 4, short: 'bpharma' },
  { name: 'MBA', durationYears: 2, short: 'mba' },
  { name: 'B.Ed', durationYears: 2, short: 'bed' },
  { name: 'BCA', durationYears: 3, short: 'bca' },
];

const TEACHERS_DATA = [
  { firstName: 'Rajesh', lastName: 'Sharma', department: 'Computer Science' },
  { firstName: 'Priya', lastName: 'Verma', department: 'Computer Science' },
  { firstName: 'Ankit', lastName: 'Gupta', department: 'Mechanical Engineering' },
  { firstName: 'Sunita', lastName: 'Yadav', department: 'Electronics & Communication' },
  { firstName: 'Deepak', lastName: 'Singh', department: 'Civil Engineering' },
  { firstName: 'Neha', lastName: 'Agarwal', department: 'Business Administration' },
  { firstName: 'Vikram', lastName: 'Tiwari', department: 'Pharmacy' },
  { firstName: 'Kavita', lastName: 'Mishra', department: 'Management Studies' },
  { firstName: 'Amit', lastName: 'Pandey', department: 'Mathematics' },
  { firstName: 'Pooja', lastName: 'Chauhan', department: 'Education' },
  { firstName: 'Manoj', lastName: 'Joshi', department: 'Physics' },
  { firstName: 'Rekha', lastName: 'Saxena', department: 'Chemistry' },
];

// Students — grouped by course (index maps to COURSES array)
const STUDENTS_DATA: { firstName: string; lastName: string; courseIdx: number; year: number }[] = [
  // B.Tech CS (index 0)
  { firstName: 'Arjun', lastName: 'Mehra', courseIdx: 0, year: 1 },
  { firstName: 'Sneha', lastName: 'Kapoor', courseIdx: 0, year: 1 },
  { firstName: 'Rohan', lastName: 'Jain', courseIdx: 0, year: 2 },
  { firstName: 'Ishita', lastName: 'Bansal', courseIdx: 0, year: 2 },
  { firstName: 'Sumit', lastName: 'Thakur', courseIdx: 0, year: 3 },
  { firstName: 'Karan', lastName: 'Malhotra', courseIdx: 0, year: 3 },
  { firstName: 'Nisha', lastName: 'Rawat', courseIdx: 0, year: 3 },
  { firstName: 'Vivek', lastName: 'Dubey', courseIdx: 0, year: 4 },
  { firstName: 'Tanvi', lastName: 'Srivastava', courseIdx: 0, year: 4 },
  // B.Tech ME (index 1)
  { firstName: 'Aditya', lastName: 'Thakur', courseIdx: 1, year: 1 },
  { firstName: 'Megha', lastName: 'Pandey', courseIdx: 1, year: 2 },
  { firstName: 'Sahil', lastName: 'Rana', courseIdx: 1, year: 2 },
  { firstName: 'Ritika', lastName: 'Aggarwal', courseIdx: 1, year: 3 },
  { firstName: 'Harsh', lastName: 'Tomar', courseIdx: 1, year: 4 },
  // B.Tech ECE (index 2)
  { firstName: 'Ankita', lastName: 'Bhatt', courseIdx: 2, year: 1 },
  { firstName: 'Mohit', lastName: 'Chaudhary', courseIdx: 2, year: 1 },
  { firstName: 'Divya', lastName: 'Negi', courseIdx: 2, year: 2 },
  { firstName: 'Rahul', lastName: 'Khatri', courseIdx: 2, year: 3 },
  { firstName: 'Simran', lastName: 'Gill', courseIdx: 2, year: 4 },
  // B.Tech CE (index 3)
  { firstName: 'Pankaj', lastName: 'Bhardwaj', courseIdx: 3, year: 1 },
  { firstName: 'Shalini', lastName: 'Rathore', courseIdx: 3, year: 2 },
  { firstName: 'Gaurav', lastName: 'Saini', courseIdx: 3, year: 3 },
  { firstName: 'Prachi', lastName: 'Awasthi', courseIdx: 3, year: 4 },
  // BBA (index 4)
  { firstName: 'Ayush', lastName: 'Rastogi', courseIdx: 4, year: 1 },
  { firstName: 'Kriti', lastName: 'Bhatia', courseIdx: 4, year: 2 },
  { firstName: 'Nikhil', lastName: 'Saxena', courseIdx: 4, year: 2 },
  { firstName: 'Pallavi', lastName: 'Dixit', courseIdx: 4, year: 3 },
  // B.Pharma (index 5)
  { firstName: 'Aman', lastName: 'Tripathi', courseIdx: 5, year: 1 },
  { firstName: 'Sakshi', lastName: 'Goel', courseIdx: 5, year: 1 },
  { firstName: 'Tushar', lastName: 'Kulkarni', courseIdx: 5, year: 2 },
  { firstName: 'Riya', lastName: 'Choudhury', courseIdx: 5, year: 3 },
  { firstName: 'Varun', lastName: 'Sethi', courseIdx: 5, year: 4 },
  // MBA (index 6)
  { firstName: 'Shreya', lastName: 'Kapil', courseIdx: 6, year: 1 },
  { firstName: 'Abhishek', lastName: 'Mathur', courseIdx: 6, year: 1 },
  { firstName: 'Neelam', lastName: 'Joshi', courseIdx: 6, year: 2 },
  { firstName: 'Siddharth', lastName: 'Oberoi', courseIdx: 6, year: 2 },
  // B.Ed (index 7)
  { firstName: 'Mansi', lastName: 'Chahar', courseIdx: 7, year: 1 },
  { firstName: 'Rajat', lastName: 'Bisht', courseIdx: 7, year: 2 },
  // BCA (index 8)
  { firstName: 'Radhika', lastName: 'Sharma', courseIdx: 8, year: 3 },
  { firstName: 'Deepika', lastName: 'Verma', courseIdx: 8, year: 1 },
  { firstName: 'Ananya', lastName: 'Kumari', courseIdx: 8, year: 1 },
  { firstName: 'Vikas', lastName: 'Pal', courseIdx: 8, year: 2 },
  { firstName: 'Shivam', lastName: 'Kumar', courseIdx: 8, year: 2 },
  { firstName: 'Priyanka', lastName: 'Tiwari', courseIdx: 8, year: 3 },
];

const BOOKS_DATA = [
  { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', category: 'Computer Science', copies: 5 },
  { title: 'Engineering Mechanics', author: 'R.S. Khurmi', isbn: '978-8121925242', category: 'Mechanical', copies: 4 },
  { title: 'Electronic Devices & Circuits', author: 'Boylestad & Nashelsky', isbn: '978-0132622264', category: 'Electronics', copies: 3 },
  { title: 'Strength of Materials', author: 'R.K. Rajput', isbn: '978-8121935180', category: 'Civil', copies: 4 },
  { title: 'Business Communication', author: 'Meenakshi Raman', isbn: '978-0198077565', category: 'Management', copies: 6 },
  { title: 'Pharmacology', author: 'K.D. Tripathi', isbn: '978-9351529248', category: 'Pharmacy', copies: 3 },
  { title: 'Data Structures using C', author: 'Reema Thareja', isbn: '978-0198099307', category: 'Computer Science', copies: 5 },
  { title: 'Financial Management', author: 'I.M. Pandey', isbn: '978-9325994713', category: 'Management', copies: 4 },
  { title: 'Fundamentals of Physics', author: 'Halliday, Resnick & Walker', isbn: '978-8126551187', category: 'Physics', copies: 6 },
  { title: 'Organic Chemistry', author: 'Morrison & Boyd', isbn: '978-9332519039', category: 'Chemistry', copies: 3 },
  { title: 'Discrete Mathematics', author: 'Kenneth H. Rosen', isbn: '978-0073383095', category: 'Mathematics', copies: 4 },
  { title: 'Operating System Concepts', author: 'Silberschatz, Galvin & Gagne', isbn: '978-8126554270', category: 'Computer Science', copies: 5 },
  { title: 'Principles of Marketing', author: 'Philip Kotler', isbn: '978-0133795028', category: 'Management', copies: 3 },
  { title: 'Theory of Machines', author: 'S.S. Rattan', isbn: '978-9352533077', category: 'Mechanical', copies: 3 },
  { title: 'Educational Psychology', author: 'Anita Woolfolk', isbn: '978-0134774329', category: 'Education', copies: 4 },
];

const VEHICLES_DATA = [
  { vehicleNumber: 'UP-14-AB-1234', type: 'Bus', capacity: 50, driverName: 'Ram Prasad', driverPhone: '9876543210', routeName: 'Route A — Ghaziabad to Campus', stops: ['Raj Nagar Extension', 'Kaushambi', 'Vaishali', 'Indirapuram', 'Campus'] },
  { vehicleNumber: 'UP-14-CD-5678', type: 'Bus', capacity: 45, driverName: 'Suresh Kumar', driverPhone: '9876543211', routeName: 'Route B — Noida to Campus', stops: ['Sector 62', 'Sector 63', 'Botanical Garden', 'Pari Chowk', 'Campus'] },
  { vehicleNumber: 'UP-14-EF-9012', type: 'Mini Bus', capacity: 25, driverName: 'Dinesh Yadav', driverPhone: '9876543212', routeName: 'Route C — Greater Noida to Campus', stops: ['Alpha 1', 'Beta 2', 'Gamma', 'Knowledge Park', 'Campus'] },
  { vehicleNumber: 'UP-14-GH-3456', type: 'Van', capacity: 15, driverName: 'Mohan Lal', driverPhone: '9876543213', routeName: 'Route D — Meerut to Campus', stops: ['Meerut City', 'Modipuram', 'Muradnagar', 'Campus'] },
];

// ══════════════════════════════════════════════════════════════════════════════

export const maxDuration = 60; // Allow up to 60 seconds for seeding

export async function GET(req: NextRequest) {
  try {
    const key = req.nextUrl.searchParams.get('key');
    if (key !== 'eduverse2026') {
      return NextResponse.json({ error: 'Invalid key. Use ?key=eduverse2026' }, { status: 403 });
    }

    await connectDB();
    const hash = await bcrypt.hash(UNIVERSAL_PASSWORD, 10);

    // ── 1. Clear ALL existing data ──
    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}), School.deleteMany({}), Course.deleteMany({}),
      Student.deleteMany({}), Teacher.deleteMany({}), Assignment.deleteMany({}),
      Submission.deleteMany({}), Exam.deleteMany({}), TimetableEntry.deleteMany({}),
      Book.deleteMany({}), Vehicle.deleteMany({}), Notification.deleteMany({}),
      Attendance.deleteMany({}), FeeStructure.deleteMany({}), Payment.deleteMany({})
    ]);

    // ── 2. Create School ──
    console.log('Creating school...');
    const school = await School.create({
      name: SCHOOL_NAME,
      address: 'Dasna, Ghaziabad, Uttar Pradesh - 201015',
      adminEmail: `admin@${SCHOOL_SHORT}.edu`
    });

    // ── 3. Create Admin User ──
    console.log('Creating admin...');
    const adminUser = await User.create({
      name: 'Dr. Radhika Sunderdeep',
      email: `admin@${SCHOOL_SHORT}.edu`,
      passwordHash: hash,
      role: 'school_admin',
      schoolId: school._id
    });

    // ── 4. Create Courses ──
    console.log('Creating courses...');
    const courseDocs = await Course.insertMany(
      COURSES.map(c => ({ schoolId: school._id, name: c.name, durationYears: c.durationYears }))
    );

    // ── 5. Create Teachers + Teacher Users ──
    console.log('Creating teachers...');
    const teacherUsers: any[] = [];
    const teacherDocs: any[] = [];
    for (const t of TEACHERS_DATA) {
      const email = `${t.firstName.toLowerCase()}.${t.lastName.toLowerCase()}@${SCHOOL_SHORT}.edu`;
      const user = await User.create({
        name: `${t.firstName} ${t.lastName}`,
        email,
        passwordHash: hash,
        role: 'teacher',
        schoolId: school._id
      });
      teacherUsers.push(user);
      const teacher = await Teacher.create({
        schoolId: school._id,
        userId: user._id,
        firstName: t.firstName,
        lastName: t.lastName,
        department: t.department
      });
      teacherDocs.push(teacher);
    }

    // ── 6. Create Students + Student Users ──
    console.log('Creating students...');
    const studentUsers: any[] = [];
    const studentDocs: any[] = [];
    let enrollCount = 1001;
    for (const s of STUDENTS_DATA) {
      const courseShort = COURSES[s.courseIdx].short;
      const email = `${s.firstName.toLowerCase()}.${s.lastName.toLowerCase()}@${SCHOOL_SHORT}-${courseShort}.edu`;
      const user = await User.create({
        name: `${s.firstName} ${s.lastName}`,
        email,
        passwordHash: hash,
        role: 'student',
        schoolId: school._id
      });
      studentUsers.push(user);
      const student = await Student.create({
        schoolId: school._id,
        userId: user._id,
        firstName: s.firstName,
        lastName: s.lastName,
        enrollmentNumber: `SGI-${new Date().getFullYear()}-${enrollCount++}`,
        courseId: courseDocs[s.courseIdx]._id,
        currentYear: s.year,
        overallAttendance: Math.floor(Math.random() * 20) + 75 // 75-95%
      });
      studentDocs.push(student);
    }

    // ── 7. Create Fee Structures ──
    console.log('Creating fee structures...');
    for (let ci = 0; ci < courseDocs.length; ci++) {
      const c = courseDocs[ci];
      const baseFee = [85000, 75000, 80000, 70000, 55000, 90000, 120000, 45000, 50000][ci] || 60000;
      for (let y = 1; y <= COURSES[ci].durationYears; y++) {
        await FeeStructure.create({
          schoolId: school._id, courseId: c._id, year: y, totalAmount: baseFee,
          breakdown: [
            { label: 'Tuition Fee', amount: Math.round(baseFee * 0.6) },
            { label: 'Lab & Library', amount: Math.round(baseFee * 0.15) },
            { label: 'Exam Fee', amount: Math.round(baseFee * 0.1) },
            { label: 'Development Fee', amount: Math.round(baseFee * 0.15) },
          ]
        });
      }
    }

    // ── 8. Create Payments (some paid, some pending) ──
    console.log('Creating payments...');
    for (const student of studentDocs) {
      const paid = Math.random() > 0.3;
      await Payment.create({
        schoolId: school._id, studentId: student._id,
        amount: paid ? Math.floor(Math.random() * 30000) + 50000 : Math.floor(Math.random() * 20000) + 30000,
        status: paid ? 'paid' : 'pending',
        date: new Date(2026, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1)
      });
    }

    // ── 9. Create Attendance Records (last 5 days) ──
    console.log('Creating attendance records...');
    const csTeacher = teacherUsers[0]; // Rajesh Sharma
    const today = new Date();
    const attendanceBatch: any[] = [];
    for (let d = 1; d <= 5; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() - d);
      const dateStr = date.toISOString().split('T')[0];
      for (const student of studentDocs) {
        const statuses: ('present' | 'absent' | 'late')[] = ['present', 'present', 'present', 'present', 'absent', 'late'];
        attendanceBatch.push({
          schoolId: school._id, studentId: student._id,
          date: dateStr,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          markedBy: csTeacher._id
        });
      }
    }
    await Attendance.insertMany(attendanceBatch);

    // ── 10. Create Assignments ──
    console.log('Creating assignments...');
    const assignmentData = [
      { title: 'Data Structures Lab — Linked List Implementation', description: 'Implement a singly linked list with insert, delete, and search operations in C/C++. Submit the source code and a brief report explaining your approach.', courseIdx: 0, maxMarks: 50, dueDays: 7 },
      { title: 'Database Management System — ER Diagram', description: 'Design an ER diagram for an online shopping portal. Include entities, attributes, relationships, and cardinality.', courseIdx: 0, maxMarks: 30, dueDays: 5 },
      { title: 'Thermodynamics — Carnot Cycle Analysis', description: 'Solve problems 4.1 through 4.15 from the textbook. Show all working steps.', courseIdx: 1, maxMarks: 40, dueDays: 10 },
      { title: 'Digital Signal Processing — MATLAB Assignment', description: 'Implement DFT and FFT algorithms in MATLAB. Compare computational complexity and plot the results.', courseIdx: 2, maxMarks: 50, dueDays: 8 },
      { title: 'Structural Analysis — Truss Problem Set', description: 'Analyze the given truss structures using method of joints and method of sections.', courseIdx: 3, maxMarks: 40, dueDays: 6 },
      { title: 'Business Case Study — Flipkart', description: 'Analyze Flipkart\'s business model, competitive advantages, and growth strategy. Present in 2000 words.', courseIdx: 4, maxMarks: 50, dueDays: 12 },
      { title: 'Pharmacognosy — Herbal Drug Identification', description: 'Prepare microscopic slides of 5 medicinal plant drugs. Submit photos and identification notes.', courseIdx: 5, maxMarks: 30, dueDays: 7 },
      { title: 'Strategic Management — SWOT Analysis', description: 'Perform a comprehensive SWOT analysis of Tata Group. Include recommendations.', courseIdx: 6, maxMarks: 50, dueDays: 14 },
      { title: 'Web Development — Portfolio Website', description: 'Build a personal portfolio website using HTML, CSS, and JavaScript. Must include responsive design, a contact form, and at least 3 project showcases.', courseIdx: 8, maxMarks: 50, dueDays: 10 },
      { title: 'Python Programming — OOP Concepts', description: 'Implement a Library Management System in Python using classes, inheritance, and file handling. Submit source code with documentation.', courseIdx: 8, maxMarks: 40, dueDays: 7 },
    ];

    const assignmentDocs: any[] = [];
    for (const a of assignmentData) {
      const due = new Date(today);
      due.setDate(today.getDate() + a.dueDays);
      const teacher = teacherUsers[Math.floor(Math.random() * teacherUsers.length)];
      const doc = await Assignment.create({
        schoolId: school._id, courseId: courseDocs[a.courseIdx]._id,
        title: a.title, description: a.description,
        dueDate: due, maxMarks: a.maxMarks,
        createdBy: teacher._id, status: 'active'
      });
      assignmentDocs.push(doc);
    }

    // ── 11. Create some Submissions ──
    console.log('Creating submissions...');
    for (const assignment of assignmentDocs) {
      const courseStudents = studentDocs.filter(s => s.courseId.toString() === assignment.courseId.toString());
      const submitCount = Math.min(Math.floor(courseStudents.length * 0.6), courseStudents.length);
      for (let i = 0; i < submitCount; i++) {
        const student = courseStudents[i];
        const graded = Math.random() > 0.5;
        await Submission.create({
          assignmentId: assignment._id, studentId: student._id, schoolId: school._id,
          submissionText: `Solution submitted by ${student.firstName} ${student.lastName} for "${assignment.title}".`,
          submittedAt: new Date(), isLate: false,
          grade: graded ? Math.floor(Math.random() * 15) + (assignment.maxMarks * 0.6) : null,
          feedback: graded ? 'Good effort. Review section 3 for improvement.' : '',
          status: graded ? 'graded' : 'submitted'
        });
      }
    }

    // ── 12. Create Exams ──
    console.log('Creating exams...');
    const examData = [
      { title: 'Mid-Semester Examination — Data Structures', courseIdx: 0, daysAhead: 15, start: '09:00', end: '12:00', room: 'Hall A', marks: 100 },
      { title: 'End-Semester — Engineering Mechanics', courseIdx: 1, daysAhead: 30, start: '10:00', end: '13:00', room: 'Hall B', marks: 100 },
      { title: 'Mid-Semester — Digital Electronics', courseIdx: 2, daysAhead: 12, start: '09:00', end: '11:00', room: 'Hall C', marks: 75 },
      { title: 'Practical Exam — Surveying', courseIdx: 3, daysAhead: 20, start: '14:00', end: '17:00', room: 'Lab 3', marks: 50 },
      { title: 'Internal Assessment — Business Communication', courseIdx: 4, daysAhead: 8, start: '11:00', end: '12:30', room: 'Room 201', marks: 50 },
      { title: 'End-Semester — Pharmacology', courseIdx: 5, daysAhead: 25, start: '09:00', end: '12:00', room: 'Hall D', marks: 100 },
      { title: 'Case Study Presentation — Strategic Management', courseIdx: 6, daysAhead: 10, start: '10:00', end: '13:00', room: 'Seminar Hall', marks: 50 },
      { title: 'Teaching Practice Evaluation', courseIdx: 7, daysAhead: 18, start: '09:00', end: '15:00', room: 'School Campus', marks: 100 },
      { title: 'Mid-Semester — Web Technologies', courseIdx: 8, daysAhead: 14, start: '09:00', end: '11:30', room: 'Lab 5', marks: 75 },
    ];

    for (const e of examData) {
      const examDate = new Date(today);
      examDate.setDate(today.getDate() + e.daysAhead);
      await Exam.create({
        schoolId: school._id, courseId: courseDocs[e.courseIdx]._id,
        title: e.title, examDate, startTime: e.start, endTime: e.end,
        maxMarks: e.marks, room: e.room, createdBy: adminUser._id
      });
    }

    // ── 13. Create Timetable (Monday-Friday for B.Tech CS) ──
    console.log('Creating timetable...');
    const csSlots = [
      { day: 0, start: '09:00', end: '10:00', subject: 'Data Structures', teacher: 0 },
      { day: 0, start: '10:00', end: '11:00', subject: 'Database Management', teacher: 1 },
      { day: 0, start: '11:30', end: '12:30', subject: 'Mathematics III', teacher: 8 },
      { day: 1, start: '09:00', end: '10:00', subject: 'Computer Networks', teacher: 0 },
      { day: 1, start: '10:00', end: '11:00', subject: 'Operating Systems', teacher: 1 },
      { day: 1, start: '14:00', end: '16:00', subject: 'DS Lab', teacher: 0 },
      { day: 2, start: '09:00', end: '10:00', subject: 'Data Structures', teacher: 0 },
      { day: 2, start: '10:00', end: '11:00', subject: 'Physics', teacher: 10 },
      { day: 2, start: '11:30', end: '12:30', subject: 'Chemistry', teacher: 11 },
      { day: 3, start: '09:00', end: '10:00', subject: 'Database Management', teacher: 1 },
      { day: 3, start: '10:00', end: '11:00', subject: 'Mathematics III', teacher: 8 },
      { day: 3, start: '14:00', end: '16:00', subject: 'CN Lab', teacher: 0 },
      { day: 4, start: '09:00', end: '10:00', subject: 'Operating Systems', teacher: 1 },
      { day: 4, start: '10:00', end: '11:00', subject: 'Computer Networks', teacher: 0 },
      { day: 4, start: '11:30', end: '12:30', subject: 'Physics', teacher: 10 },
    ];

    for (const s of csSlots) {
      await TimetableEntry.create({
        schoolId: school._id, courseId: courseDocs[0]._id,
        dayOfWeek: s.day, startTime: s.start, endTime: s.end,
        subject: s.subject,
        teacherId: teacherDocs[s.teacher]?._id,
        room: `Room ${100 + s.day * 10 + Math.floor(Math.random() * 5)}`
      });
    }

    // ── 14. Create Books ──
    console.log('Creating library books...');
    await Book.insertMany(
      BOOKS_DATA.map(b => ({
        schoolId: school._id, title: b.title, author: b.author,
        isbn: b.isbn, category: b.category,
        totalCopies: b.copies, availableCopies: b.copies - Math.floor(Math.random() * 2)
      }))
    );

    // ── 15. Create Vehicles ──
    console.log('Creating transport vehicles...');
    await Vehicle.insertMany(
      VEHICLES_DATA.map(v => ({ schoolId: school._id, ...v, status: 'active' }))
    );

    // ── 16. Create Notifications ──
    console.log('Creating notifications...');
    const notifications = [
      { title: 'Mid-Semester Exam Schedule Released', message: 'The mid-semester examination schedule for all courses has been published. Check the Exams section for dates, times, and hall allotments. Students must carry their ID cards.', type: 'announcement', targetRole: 'all' },
      { title: 'Library: New Books Arrived', message: 'New textbooks for B.Tech CS, Mechanical, and Pharmacy have been added to the library. Visit the Library section to browse the updated catalog.', type: 'announcement', targetRole: 'student' },
      { title: 'Fee Payment Deadline — 30th April', message: 'The last date for fee payment for the current semester is April 30, 2026. Late payments will incur a penalty of ₹500. Visit the Finance office or pay online.', type: 'alert', targetRole: 'all' },
      { title: 'Faculty Meeting — 10th April', message: 'All faculty members are requested to attend the monthly staff meeting on April 10, 2026 at 3:00 PM in the Conference Hall.', type: 'reminder', targetRole: 'teacher' },
      { title: 'Bus Route B Diverted', message: 'Due to road construction near Sector 63, Bus Route B will take an alternate route via Sector 58. Pickup times may be delayed by 10-15 minutes.', type: 'alert', targetRole: 'all' },
      { title: 'Assignment Submission Reminder', message: 'Students who have not yet submitted their pending assignments are reminded to do so before the deadline. Late submissions will be marked accordingly.', type: 'reminder', targetRole: 'student' },
    ];

    for (const n of notifications) {
      await Notification.create({
        schoolId: school._id, ...n, createdBy: adminUser._id, readBy: []
      });
    }

    // ── Build credentials summary ──
    const credentials = [
      { role: 'Admin', email: `admin@${SCHOOL_SHORT}.edu`, name: 'Dr. Radhika Sunderdeep' },
      ...TEACHERS_DATA.map(t => ({
        role: 'Teacher',
        email: `${t.firstName.toLowerCase()}.${t.lastName.toLowerCase()}@${SCHOOL_SHORT}.edu`,
        name: `${t.firstName} ${t.lastName}`,
        dept: t.department
      })),
      ...STUDENTS_DATA.map(s => ({
        role: 'Student',
        email: `${s.firstName.toLowerCase()}.${s.lastName.toLowerCase()}@${SCHOOL_SHORT}-${COURSES[s.courseIdx].short}.edu`,
        name: `${s.firstName} ${s.lastName}`,
        course: COURSES[s.courseIdx].name, year: s.year
      }))
    ];

    console.log('Seed complete!');

    return NextResponse.json({
      success: true,
      password: UNIVERSAL_PASSWORD,
      summary: {
        school: 1,
        courses: courseDocs.length,
        admin: 1,
        teachers: teacherDocs.length,
        students: studentDocs.length,
        assignments: assignmentDocs.length,
        exams: examData.length,
        timetableSlots: csSlots.length,
        books: BOOKS_DATA.length,
        vehicles: VEHICLES_DATA.length,
        notifications: notifications.length,
        attendanceRecords: studentDocs.length * 5,
        feeStructures: COURSES.reduce((s, c) => s + c.durationYears, 0),
        payments: studentDocs.length
      },
      credentials
    }, { status: 200 });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Seed failed', details: String(error) }, { status: 500 });
  }
}

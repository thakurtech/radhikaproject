import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, School, Course, Student, Teacher, FeeStructure, Payment } from '../lib/models';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGO_URI missing');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing
  await User.deleteMany({});
  await School.deleteMany({});
  await Course.deleteMany({});
  await Student.deleteMany({});
  await Teacher.deleteMany({});
  await FeeStructure.deleteMany({});
  await Payment.deleteMany({});

  console.log('Cleared existing data');

  // 0. Create Super Admin (EduVerse Owner)
  const superAdminPassword = await bcrypt.hash('SuperAdmin@123', 10);
  await User.create({
    name: 'EduVerse Super Admin',
    email: 'superadmin@eduverse.com',
    passwordHash: superAdminPassword,
    role: 'super_admin'
    // Notice: no schoolId, because Super Admin owns the platform!
  });

  // 1. Create School
  const school = await School.create({
    name: 'Sunderdeep Group of Institutions',
    address: 'NH-24, Delhi-Hapur Road, Dasna, Ghaziabad, UP',
    adminEmail: 'admin@sunderdeep.edu'
  });

  // 2. Create Admin User
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  await User.create({
    name: 'Sunderdeep Admin',
    email: 'admin@sunderdeep.edu',
    passwordHash: adminPassword,
    role: 'school_admin',
    schoolId: school._id
  });

  // 3. Create Courses
  const courses = [
    { name: 'B.Tech (Computer Science)', durationYears: 4 },
    { name: 'B.Tech (Electronics)', durationYears: 4 },
    { name: 'B.Tech (Mechanical)', durationYears: 4 },
    { name: 'BCA', durationYears: 3 },
    { name: 'BBA', durationYears: 3 },
    { name: 'MBA', durationYears: 2 },
    { name: 'MCA', durationYears: 2 },
    { name: 'B.Pharma', durationYears: 4 }
  ];

  const createdCourses = await Course.insertMany(
    courses.map(c => ({ ...c, schoolId: school._id }))
  );

  // 4. Create Teachers
  const teacherPassword = await bcrypt.hash('Teacher@123', 10);
  const teacher = await Teacher.create({
    schoolId: school._id,
    firstName: 'Rahul',
    lastName: 'Sharma',
    department: 'Computer Science'
  });

  await User.create({
    name: 'Rahul Sharma',
    email: 'rahul.sharma@sunderdeep.edu',
    passwordHash: teacherPassword,
    role: 'teacher',
    schoolId: school._id
  });

  // Add 9 more dummy teachers
  for(let i=0; i<9; i++) {
    await Teacher.create({
      schoolId: school._id,
      firstName: `Teacher${i+2}`,
      lastName: 'Dummy',
      department: ['Management', 'Pharmacy', 'Mechanical'][i%3]
    });
  }

  // 5. Create Students & Fees
  const studentPassword = await bcrypt.hash('Student@123', 10);
  
  // We'll map course counts:
  // CS/ECE/ME (3x4 = 12), BCA (6), BBA (5), MBA (4), MCA (4), B.Pharma (4) => 35
  const distribution = [
    { name: 'B.Tech (Computer Science)', count: 4 },
    { name: 'B.Tech (Electronics)', count: 4 },
    { name: 'B.Tech (Mechanical)', count: 4 },
    { name: 'BCA', count: 6 },
    { name: 'BBA', count: 5 },
    { name: 'MBA', count: 4 },
    { name: 'MCA', count: 4 },
    { name: 'B.Pharma', count: 4 },
  ];

  let studentIdCounter = 1000;
  let firstStudentCreated = false;

  for (const dist of distribution) {
    const course = createdCourses.find(c => c.name === dist.name);
    if (!course) continue;

    // Create fee structure for course
    const feeInfo = await FeeStructure.create({
      schoolId: school._id,
      courseId: course._id,
      year: 1,
      totalAmount: 120000,
      breakdown: [
        { label: 'Tuition Fee', amount: 80000 },
        { label: 'Development Fee', amount: 20000 },
        { label: 'Exam Fee', amount: 10000 },
        { label: 'Other Activities', amount: 10000 }
      ]
    });

    for (let i = 0; i < dist.count; i++) {
      studentIdCounter++;
      
      let email = `student${studentIdCounter}@sunderdeep.edu`;
      let firstName = `Student${studentIdCounter}`;
      
      // Make the very first B.Tech CS student the designated one
      if (dist.name === 'B.Tech (Computer Science)' && !firstStudentCreated) {
        email = 'arjun.btech@sunderdeep.edu';
        firstName = 'Arjun';
        firstStudentCreated = true;
        
        // Give him a login
        await User.create({
          name: 'Arjun BTech',
          email: 'arjun.btech@sunderdeep.edu',
          passwordHash: studentPassword,
          role: 'student',
          schoolId: school._id
        });
      }

      const student = await Student.create({
        schoolId: school._id,
        firstName: firstName,
        lastName: 'Dummy',
        enrollmentNumber: `SDGI${studentIdCounter}`,
        courseId: course._id,
        currentYear: 1,
        overallAttendance: Math.floor(Math.random() * 30) + 70, // 70-100%
        overallGrade: ['A+', 'A', 'B', 'B+', 'C'][Math.floor(Math.random() * 5)]
      });

      // Give 50% of students a payment
      if (Math.random() > 0.5) {
        await Payment.create({
          schoolId: school._id,
          studentId: student._id,
          amount: 60000,
          status: 'paid',
          date: new Date()
        });
      }
    }
  }

  console.log('Seed completed successfully!');
  console.log('--- CREDENTIALS ---');
  console.log('Admin: admin@sunderdeep.edu / Admin@123');
  console.log('Teacher: rahul.sharma@sunderdeep.edu / Teacher@123');
  console.log('Student: arjun.btech@sunderdeep.edu / Student@123');

  process.exit(0);
}

seed().catch(console.error);

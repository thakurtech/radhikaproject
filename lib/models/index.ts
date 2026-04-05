import mongoose, { Schema, Document } from 'mongoose';

// ── Models Interface ────────────────────────────────────────────────────────
// User
export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'super_admin' | 'school_admin' | 'teacher' | 'student' | 'parent';
  schoolId?: mongoose.Types.ObjectId;
}

// School
export interface ISchool extends Document {
  name: string;
  address?: string;
  adminEmail: string;
}

// Course
export interface ICourse extends Document {
  schoolId: mongoose.Types.ObjectId;
  name: string;
  durationYears: number;
}

// Student
export interface IStudent extends Document {
  schoolId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  enrollmentNumber: string;
  courseId: mongoose.Types.ObjectId;
  currentYear: number;
  overallAttendance?: number;
  overallGrade?: string;
}

// Teacher
export interface ITeacher extends Document {
  schoolId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  department: string;
}

// Fee Structure
export interface IFeeStructure extends Document {
  schoolId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  year: number;
  totalAmount: number;
  breakdown: { label: string; amount: number }[];
}

// Payment
export interface IPayment extends Document {
  schoolId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  date: Date;
}

// Attendance
export interface IAttendance extends Document {
  schoolId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD format
  status: 'present' | 'absent' | 'late' | 'excused';
  markedBy: mongoose.Types.ObjectId; // Teacher user ID
}

// ── Schemas ─────────────────────────────────────────────────────────────────

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['super_admin', 'school_admin', 'teacher', 'student', 'parent'], required: true },
  schoolId: { type: Schema.Types.ObjectId, ref: 'School' }
}, { timestamps: true });

const SchoolSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String },
  adminEmail: { type: String, required: true }
}, { timestamps: true });

const CourseSchema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
  name: { type: String, required: true },
  durationYears: { type: Number, required: true }
}, { timestamps: true });

const StudentSchema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  enrollmentNumber: { type: String, required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  currentYear: { type: Number, required: true },
  overallAttendance: { type: Number, default: 0 },
  overallGrade: { type: String }
}, { timestamps: true });

const TeacherSchema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  department: { type: String, required: true }
}, { timestamps: true });

const FeeStructureSchema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  year: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  breakdown: [{ label: String, amount: Number }]
}, { timestamps: true });

const PaymentSchema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['paid', 'pending', 'overdue'], required: true },
  date: { type: Date, required: true }
}, { timestamps: true });

const AttendanceSchema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  status: { type: String, enum: ['present', 'absent', 'late', 'excused'], required: true },
  markedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
// Compound index to prevent duplicate marks for the same student on the same day
AttendanceSchema.index({ schoolId: 1, studentId: 1, date: 1 }, { unique: true });

// ── Compiling Models ────────────────────────────────────────────────────────

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const School = mongoose.models.School || mongoose.model<ISchool>('School', SchoolSchema);
export const Course = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
export const Student = mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
export const Teacher = mongoose.models.Teacher || mongoose.model<ITeacher>('Teacher', TeacherSchema);
export const FeeStructure = mongoose.models.FeeStructure || mongoose.model<IFeeStructure>('FeeStructure', FeeStructureSchema);
export const Payment = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
export const Attendance = mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema);

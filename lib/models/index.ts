import mongoose, { Schema, Document } from 'mongoose';

// ── Interfaces ──────────────────────────────────────────────────────────────

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'super_admin' | 'school_admin' | 'teacher' | 'student' | 'parent';
  schoolId?: mongoose.Types.ObjectId;
}

export interface ISchool extends Document {
  name: string;
  address?: string;
  adminEmail: string;
}

export interface ICourse extends Document {
  schoolId: mongoose.Types.ObjectId;
  name: string;
  durationYears: number;
}

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

export interface ITeacher extends Document {
  schoolId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  department: string;
}

export interface IFeeStructure extends Document {
  schoolId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  year: number;
  totalAmount: number;
  breakdown: { label: string; amount: number }[];
}

export interface IPayment extends Document {
  schoolId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  date: Date;
}

export interface IAttendance extends Document {
  schoolId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  markedBy: mongoose.Types.ObjectId;
}

// ── NEW: Assignment & Submission ──
export interface IAssignment extends Document {
  schoolId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  dueDate: Date;
  maxMarks: number;
  createdBy: mongoose.Types.ObjectId;
  status: 'active' | 'closed';
}

export interface ISubmission extends Document {
  assignmentId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  schoolId: mongoose.Types.ObjectId;
  submissionText?: string;
  attachmentUrl?: string;
  submittedAt: Date;
  isLate: boolean;
  grade?: number;
  feedback?: string;
  status: 'submitted' | 'graded' | 'returned';
}

// ── NEW: Exam ──
export interface IExam extends Document {
  schoolId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  examDate: Date;
  startTime: string;
  endTime: string;
  maxMarks: number;
  room?: string;
  createdBy: mongoose.Types.ObjectId;
}

// ── NEW: Timetable ──
export interface ITimetableEntry extends Document {
  schoolId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  dayOfWeek: number; // 0=Mon, 1=Tue, ..., 6=Sun
  startTime: string; // "09:00"
  endTime: string;   // "10:00"
  subject: string;
  teacherId?: mongoose.Types.ObjectId;
  room?: string;
}

// ── NEW: Library ──
export interface IBook extends Document {
  schoolId: mongoose.Types.ObjectId;
  title: string;
  author: string;
  isbn?: string;
  category?: string;
  totalCopies: number;
  availableCopies: number;
}

export interface IBorrowing extends Document {
  schoolId: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'borrowed' | 'returned' | 'overdue';
}

// ── NEW: Transport ──
export interface IVehicle extends Document {
  schoolId: mongoose.Types.ObjectId;
  vehicleNumber: string;
  type: string;
  capacity: number;
  driverName: string;
  driverPhone: string;
  routeName: string;
  stops: string[];
  status: 'active' | 'maintenance' | 'inactive';
}

// ── NEW: Notification ──
export interface INotification extends Document {
  schoolId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'announcement' | 'alert' | 'reminder' | 'message';
  targetRole?: string; // 'all' | 'student' | 'teacher' | 'parent'
  createdBy: mongoose.Types.ObjectId;
  readBy: mongoose.Types.ObjectId[];
}

// ══════════════════════════════════════════════════════════════════════════════
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
  date: { type: String, required: true },
  status: { type: String, enum: ['present', 'absent', 'late', 'excused'], required: true },
  markedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
AttendanceSchema.index({ schoolId: 1, studentId: 1, date: 1 }, { unique: true });

// ── Assignment Schema ──
const AssignmentSchema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  dueDate: { type: Date, required: true },
  maxMarks: { type: Number, required: true, default: 100 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'closed'], default: 'active' }
}, { timestamps: true });

// ── Submission Schema ──
const SubmissionSchema = new Schema({
  assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
  submissionText: { type: String, default: '' },
  attachmentUrl: { type: String, default: '' },
  submittedAt: { type: Date, default: Date.now },
  isLate: { type: Boolean, default: false },
  grade: { type: Number, default: null },
  feedback: { type: String, default: '' },
  status: { type: String, enum: ['submitted', 'graded', 'returned'], default: 'submitted' }
}, { timestamps: true });
SubmissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });

// ── Exam Schema ──
const ExamSchema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  examDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  maxMarks: { type: Number, required: true, default: 100 },
  room: { type: String, default: '' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// ── Timetable Schema ──
const TimetableEntrySchema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  subject: { type: String, required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher' },
  room: { type: String, default: '' }
}, { timestamps: true });
TimetableEntrySchema.index({ schoolId: 1, courseId: 1, dayOfWeek: 1, startTime: 1 }, { unique: true });

// ── Book Schema ──
const BookSchema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, default: '' },
  category: { type: String, default: 'General' },
  totalCopies: { type: Number, required: true, default: 1 },
  availableCopies: { type: Number, required: true, default: 1 }
}, { timestamps: true });

// ── Borrowing Schema ──
const BorrowingSchema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
  bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  borrowDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date, default: null },
  status: { type: String, enum: ['borrowed', 'returned', 'overdue'], default: 'borrowed' }
}, { timestamps: true });

// ── Vehicle Schema ──
const VehicleSchema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
  vehicleNumber: { type: String, required: true },
  type: { type: String, required: true, default: 'Bus' },
  capacity: { type: Number, required: true },
  driverName: { type: String, required: true },
  driverPhone: { type: String, required: true },
  routeName: { type: String, required: true },
  stops: [{ type: String }],
  status: { type: String, enum: ['active', 'maintenance', 'inactive'], default: 'active' }
}, { timestamps: true });

// ── Notification Schema ──
const NotificationSchema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['announcement', 'alert', 'reminder', 'message'], default: 'announcement' },
  targetRole: { type: String, default: 'all' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

// ══════════════════════════════════════════════════════════════════════════════
// ── Compile Models ──────────────────────────────────────────────────────────

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const School = mongoose.models.School || mongoose.model<ISchool>('School', SchoolSchema);
export const Course = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
export const Student = mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
export const Teacher = mongoose.models.Teacher || mongoose.model<ITeacher>('Teacher', TeacherSchema);
export const FeeStructure = mongoose.models.FeeStructure || mongoose.model<IFeeStructure>('FeeStructure', FeeStructureSchema);
export const Payment = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
export const Attendance = mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema);
export const Assignment = mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentSchema);
export const Submission = mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);
export const Exam = mongoose.models.Exam || mongoose.model<IExam>('Exam', ExamSchema);
export const TimetableEntry = mongoose.models.TimetableEntry || mongoose.model<ITimetableEntry>('TimetableEntry', TimetableEntrySchema);
export const Book = mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);
export const Borrowing = mongoose.models.Borrowing || mongoose.model<IBorrowing>('Borrowing', BorrowingSchema);
export const Vehicle = mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', VehicleSchema);
export const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

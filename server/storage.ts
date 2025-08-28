import {
  users,
  societies,
  members,
  loans,
  vouchers,
  voucherLines,
  monthlyDemandHeaders,
  monthlyDemandRows,
  loanTypes,
  banks,
  voucherTypes,
  type User,
  type InsertUser,
  type Society,
  type InsertSociety,
  type Member,
  type InsertMember,
  type Loan,
  type InsertLoan,
  type Voucher,
  type InsertVoucher,
  type VoucherLine,
  type InsertVoucherLine,
  type MonthlyDemandHeader,
  type InsertMonthlyDemandHeader,
  type MonthlyDemandRow,
  type InsertMonthlyDemandRow,
  type LoanType,
  type Bank,
  type VoucherType,
} from "@shared/schema";
import { db } from "./db";
import { eq, like, and, desc, asc, count, sum, sql } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User>;
  deleteUser(id: string): Promise<void>;
  getUsers(filters?: { societyId?: string; role?: string }): Promise<User[]>;

  // Society operations
  getSociety(id: string): Promise<Society | undefined>;
  createSociety(society: InsertSociety): Promise<Society>;
  updateSociety(id: string, society: Partial<InsertSociety>): Promise<Society>;
  deleteSociety(id: string): Promise<void>;
  getSocieties(filters?: { city?: string; isActive?: boolean }): Promise<Society[]>;

  // Member operations
  getMember(id: string): Promise<Member | undefined>;
  createMember(member: InsertMember): Promise<Member>;
  updateMember(id: string, member: Partial<InsertMember>): Promise<Member>;
  deleteMember(id: string): Promise<void>;
  getMembers(filters?: { societyId?: string; status?: string }): Promise<Member[]>;
  generateMemberNo(societyId: string): Promise<string>;

  // Loan operations
  getLoan(id: string): Promise<Loan | undefined>;
  createLoan(loan: InsertLoan): Promise<Loan>;
  updateLoan(id: string, loan: Partial<InsertLoan>): Promise<Loan>;
  deleteLoan(id: string): Promise<void>;
  getLoans(filters?: { societyId?: string; loanTypeId?: string }): Promise<Loan[]>;
  generateLoanNo(): Promise<string>;

  // Voucher operations
  getVoucher(id: string): Promise<Voucher | undefined>;
  createVoucher(voucher: InsertVoucher): Promise<Voucher>;
  updateVoucher(id: string, voucher: Partial<InsertVoucher>): Promise<Voucher>;
  deleteVoucher(id: string): Promise<void>;
  getVouchers(filters?: { societyId?: string; voucherTypeId?: string }): Promise<Voucher[]>;
  generateVoucherNo(): Promise<string>;

  // Voucher line operations
  getVoucherLines(voucherId: string): Promise<VoucherLine[]>;
  createVoucherLine(line: InsertVoucherLine): Promise<VoucherLine>;
  deleteVoucherLines(voucherId: string): Promise<void>;

  // Monthly demand operations
  getMonthlyDemandHeader(id: string): Promise<MonthlyDemandHeader | undefined>;
  createMonthlyDemandHeader(header: InsertMonthlyDemandHeader): Promise<MonthlyDemandHeader>;
  getMonthlyDemandHeaders(societyId: string): Promise<MonthlyDemandHeader[]>;
  getMonthlyDemandRows(headerId: string): Promise<MonthlyDemandRow[]>;
  createMonthlyDemandRow(row: InsertMonthlyDemandRow): Promise<MonthlyDemandRow>;

  // Lookup operations
  getLoanTypes(): Promise<LoanType[]>;
  getBanks(): Promise<Bank[]>;
  getVoucherTypes(): Promise<VoucherType[]>;

  // Authentication
  validatePassword(password: string, hash: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;

  // Dashboard statistics
  getDashboardStats(societyId?: string): Promise<{
    totalSocieties: number;
    activeMembers: number;
    totalLoans: string;
    outstanding: string;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const hashedPassword = await this.hashPassword(userData.passwordHash);
    const [user] = await db
      .insert(users)
      .values({ ...userData, passwordHash: hashedPassword })
      .returning();
    return user;
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User> {
    const updateData = { ...userData };
    if (updateData.passwordHash) {
      updateData.passwordHash = await this.hashPassword(updateData.passwordHash);
    }

    const [user] = await db
      .update(users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async getUsers(filters?: { societyId?: string; role?: string }): Promise<User[]> {
    if (filters?.societyId && filters?.role) {
      return await db.select().from(users)
        .where(and(eq(users.societyId, filters.societyId), eq(users.role, filters.role)))
        .orderBy(asc(users.name));
    } else if (filters?.societyId) {
      return await db.select().from(users)
        .where(eq(users.societyId, filters.societyId))
        .orderBy(asc(users.name));
    } else if (filters?.role) {
      return await db.select().from(users)
        .where(eq(users.role, filters.role))
        .orderBy(asc(users.name));
    }
    return await db.select().from(users).orderBy(asc(users.name));
  }

  // Society operations
  async getSociety(id: string): Promise<Society | undefined> {
    const [society] = await db.select().from(societies).where(eq(societies.id, id));
    return society;
  }

  async createSociety(societyData: InsertSociety): Promise<Society> {
    const [society] = await db.insert(societies).values(societyData).returning();
    return society;
  }

  async updateSociety(id: string, societyData: Partial<InsertSociety>): Promise<Society> {
    const [society] = await db
      .update(societies)
      .set({ ...societyData, updatedAt: new Date() })
      .where(eq(societies.id, id))
      .returning();
    return society;
  }

  async deleteSociety(id: string): Promise<void> {
    await db.delete(societies).where(eq(societies.id, id));
  }

  async getSocieties(filters?: { city?: string; isActive?: boolean }): Promise<Society[]> {
    if (filters?.city && filters?.isActive !== undefined) {
      return await db.select().from(societies)
        .where(and(eq(societies.city, filters.city), eq(societies.isActive, filters.isActive)))
        .orderBy(asc(societies.name));
    } else if (filters?.city) {
      return await db.select().from(societies)
        .where(eq(societies.city, filters.city))
        .orderBy(asc(societies.name));
    } else if (filters?.isActive !== undefined) {
      return await db.select().from(societies)
        .where(eq(societies.isActive, filters.isActive))
        .orderBy(asc(societies.name));
    }
    return await db.select().from(societies).orderBy(asc(societies.name));
  }

  // Member operations
  async getMember(id: string): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.id, id));
    return member;
  }

  async createMember(memberData: InsertMember): Promise<Member> {
    if (!memberData.memNo) {
      memberData.memNo = await this.generateMemberNo(memberData.societyId);
    }
    const [member] = await db.insert(members).values(memberData).returning();
    return member;
  }

  async updateMember(id: string, memberData: Partial<InsertMember>): Promise<Member> {
    const [member] = await db
      .update(members)
      .set({ ...memberData, updatedAt: new Date() })
      .where(eq(members.id, id))
      .returning();
    return member;
  }

  async deleteMember(id: string): Promise<void> {
    await db.delete(members).where(eq(members.id, id));
  }

  async getMembers(filters?: { societyId?: string; status?: string }): Promise<Member[]> {
    if (filters?.societyId && filters?.status) {
      return await db.select().from(members)
        .where(and(eq(members.societyId, filters.societyId), eq(members.status, filters.status)))
        .orderBy(asc(members.memNo));
    } else if (filters?.societyId) {
      return await db.select().from(members)
        .where(eq(members.societyId, filters.societyId))
        .orderBy(asc(members.memNo));
    } else if (filters?.status) {
      return await db.select().from(members)
        .where(eq(members.status, filters.status))
        .orderBy(asc(members.memNo));
    }
    return await db.select().from(members).orderBy(asc(members.memNo));
  }

  async generateMemberNo(societyId: string): Promise<string> {
    const result = await db
      .select({ count: count() })
      .from(members)
      .where(eq(members.societyId, societyId));

    const memberCount = result[0]?.count || 0;
    return `MEM_${String(memberCount + 1).padStart(3, '0')}`;
  }

  // Loan operations
  async getLoan(id: string): Promise<Loan | undefined> {
    const [loan] = await db.select().from(loans).where(eq(loans.id, id));
    return loan;
  }

  async createLoan(loanData: InsertLoan): Promise<Loan> {
    if (!loanData.loanNo) {
      loanData.loanNo = await this.generateLoanNo();
    }

    // Calculate net loan
    const loanAmount = Number(loanData.loanAmount);
    const previousLoan = Number(loanData.previousLoan || 0);
    loanData.netLoan = String(loanAmount - previousLoan);

    const [loan] = await db.insert(loans).values(loanData).returning();
    return loan;
  }

  async updateLoan(id: string, loanData: Partial<InsertLoan>): Promise<Loan> {
    // Recalculate net loan if amounts change
    if (loanData.loanAmount !== undefined || loanData.previousLoan !== undefined) {
      const existingLoan = await this.getLoan(id);
      if (existingLoan) {
        const loanAmount = Number(loanData.loanAmount ?? existingLoan.loanAmount);
        const previousLoan = Number(loanData.previousLoan ?? existingLoan.previousLoan);
        loanData.netLoan = String(loanAmount - previousLoan);
      }
    }

    const [loan] = await db
      .update(loans)
      .set({ ...loanData, updatedAt: new Date() })
      .where(eq(loans.id, id))
      .returning();
    return loan;
  }

  async deleteLoan(id: string): Promise<void> {
    await db.delete(loans).where(eq(loans.id, id));
  }

  async getLoans(filters?: { societyId?: string; loanTypeId?: string }): Promise<Loan[]> {
    if (filters?.societyId && filters?.loanTypeId) {
      return await db.select().from(loans)
        .where(and(eq(loans.societyId, filters.societyId), eq(loans.loanTypeId, filters.loanTypeId)))
        .orderBy(desc(loans.createdAt));
    } else if (filters?.societyId) {
      return await db.select().from(loans)
        .where(eq(loans.societyId, filters.societyId))
        .orderBy(desc(loans.createdAt));
    } else if (filters?.loanTypeId) {
      return await db.select().from(loans)
        .where(eq(loans.loanTypeId, filters.loanTypeId))
        .orderBy(desc(loans.createdAt));
    }
    return await db.select().from(loans).orderBy(desc(loans.createdAt));
  }

  async generateLoanNo(): Promise<string> {
    const result = await db.select({ count: count() }).from(loans);
    const loanCount = result[0]?.count || 0;
    return `LOAN_${String(loanCount + 1).padStart(6, '0')}`;
  }

  // Voucher operations
  async getVoucher(id: string): Promise<Voucher | undefined> {
    const [voucher] = await db.select().from(vouchers).where(eq(vouchers.id, id));
    return voucher;
  }

  async createVoucher(voucherData: InsertVoucher): Promise<Voucher> {
    if (!voucherData.voucherNo) {
      voucherData.voucherNo = await this.generateVoucherNo();
    }
    const [voucher] = await db.insert(vouchers).values(voucherData).returning();
    return voucher;
  }

  async updateVoucher(id: string, voucherData: Partial<InsertVoucher>): Promise<Voucher> {
    const [voucher] = await db
      .update(vouchers)
      .set({ ...voucherData, updatedAt: new Date() })
      .where(eq(vouchers.id, id))
      .returning();
    return voucher;
  }

  async deleteVoucher(id: string): Promise<void> {
    await db.delete(voucherLines).where(eq(voucherLines.voucherId, id));
    await db.delete(vouchers).where(eq(vouchers.id, id));
  }

  async getVouchers(filters?: { societyId?: string; voucherTypeId?: string }): Promise<Voucher[]> {
    if (filters?.societyId && filters?.voucherTypeId) {
      return await db.select().from(vouchers)
        .where(and(eq(vouchers.societyId, filters.societyId), eq(vouchers.voucherTypeId, filters.voucherTypeId)))
        .orderBy(desc(vouchers.createdAt));
    } else if (filters?.societyId) {
      return await db.select().from(vouchers)
        .where(eq(vouchers.societyId, filters.societyId))
        .orderBy(desc(vouchers.createdAt));
    } else if (filters?.voucherTypeId) {
      return await db.select().from(vouchers)
        .where(eq(vouchers.voucherTypeId, filters.voucherTypeId))
        .orderBy(desc(vouchers.createdAt));
    }
    return await db.select().from(vouchers).orderBy(desc(vouchers.createdAt));
  }

  async generateVoucherNo(): Promise<string> {
    const result = await db.select({ count: count() }).from(vouchers);
    const voucherCount = result[0]?.count || 0;
    return `VCH_${String(voucherCount + 1).padStart(6, '0')}`;
  }

  // Voucher line operations
  async getVoucherLines(voucherId: string): Promise<VoucherLine[]> {
    return await db
      .select()
      .from(voucherLines)
      .where(eq(voucherLines.voucherId, voucherId))
      .orderBy(asc(voucherLines.lineOrder));
  }

  async createVoucherLine(lineData: InsertVoucherLine): Promise<VoucherLine> {
    const [line] = await db.insert(voucherLines).values(lineData).returning();
    return line;
  }

  async deleteVoucherLines(voucherId: string): Promise<void> {
    await db.delete(voucherLines).where(eq(voucherLines.voucherId, voucherId));
  }

  // Monthly demand operations
  async getMonthlyDemandHeader(id: string): Promise<MonthlyDemandHeader | undefined> {
    const [header] = await db.select().from(monthlyDemandHeaders).where(eq(monthlyDemandHeaders.id, id));
    return header;
  }

  async createMonthlyDemandHeader(headerData: InsertMonthlyDemandHeader): Promise<MonthlyDemandHeader> {
    const [header] = await db.insert(monthlyDemandHeaders).values(headerData).returning();
    return header;
  }

  async getMonthlyDemandHeaders(societyId: string): Promise<MonthlyDemandHeader[]> {
    return await db
      .select()
      .from(monthlyDemandHeaders)
      .where(eq(monthlyDemandHeaders.societyId, societyId))
      .orderBy(desc(monthlyDemandHeaders.year), desc(monthlyDemandHeaders.month));
  }

  async getMonthlyDemandRows(headerId: string): Promise<MonthlyDemandRow[]> {
    return await db
      .select()
      .from(monthlyDemandRows)
      .where(eq(monthlyDemandRows.headerId, headerId));
  }

  async createMonthlyDemandRow(rowData: InsertMonthlyDemandRow): Promise<MonthlyDemandRow> {
    const [row] = await db.insert(monthlyDemandRows).values(rowData).returning();
    return row;
  }

  // Lookup operations
  async getLoanTypes(): Promise<LoanType[]> {
    return await db.select().from(loanTypes).where(eq(loanTypes.isActive, true));
  }

  async getBanks(): Promise<Bank[]> {
    return await db.select().from(banks).where(eq(banks.isActive, true));
  }

  async getVoucherTypes(): Promise<VoucherType[]> {
    return await db.select().from(voucherTypes).where(eq(voucherTypes.isActive, true));
  }

  // Authentication
  async validatePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  // Dashboard statistics
  async getDashboardStats(societyId?: string): Promise<{
    totalSocieties: number;
    activeMembers: number;
    totalLoans: string;
    outstanding: string;
  }> {
    const societyFilter = societyId ? eq(societies.id, societyId) : undefined;
    const memberFilter = societyId ? eq(members.societyId, societyId) : undefined;
    const loanFilter = societyId ? eq(loans.societyId, societyId) : undefined;

    const [
      totalSocietiesCount,
      activeMembersCount,
      totalLoansCount,
      loanAmountSum
    ] = await Promise.all([
      societyId ? db.select().from(societies).where(societyFilter).then(rows => rows.length) : db.select().from(societies).then(rows => rows.length),
      db.select().from(members).where(memberFilter).then(rows => rows.filter(m => m.status === 'Active').length),
      db.select().from(loans).where(loanFilter).then(rows => rows.length),
      db.select({ sum: sql<number>`sum(${loans.loanAmount})` }).from(loans).where(loanFilter).then(rows => rows[0]?.sum || 0)
    ]);

    return {
      totalSocieties: totalSocietiesCount,
      activeMembers: activeMembersCount,
      totalLoans: `₹${Math.round(loanAmountSum / 100000)}L`,
      outstanding: `₹${Math.round(loanAmountSum * 0.7 / 100000)}L` // Estimated outstanding
    };
  }
}

export const storage = new DatabaseStorage();
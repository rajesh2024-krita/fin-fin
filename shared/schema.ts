import { sql } from "drizzle-orm";
import { 
  pgTable, 
  varchar, 
  text, 
  timestamp, 
  integer, 
  decimal, 
  boolean, 
  jsonb,
  index
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table with role-based access
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 100 }),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 20 }).notNull(), // SuperAdmin, SocietyAdmin, User, Member
  edpNo: varchar("edp_no", { length: 20 }),
  name: varchar("name", { length: 100 }).notNull(),
  addressOffice: text("address_office"),
  addressResidence: text("address_residence"),
  designation: varchar("designation", { length: 100 }),
  phoneOffice: varchar("phone_office", { length: 20 }),
  phoneResidence: varchar("phone_residence", { length: 20 }),
  mobile: varchar("mobile", { length: 20 }),
  societyId: varchar("society_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Societies table
export const societies = pgTable("societies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 200 }).notNull(),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  fax: varchar("fax", { length: 20 }),
  email: varchar("email", { length: 100 }),
  website: varchar("website", { length: 200 }),
  registrationNo: varchar("registration_no", { length: 100 }),
  
  // Interest rates
  interestDividend: decimal("interest_dividend", { precision: 5, scale: 2 }),
  interestOD: decimal("interest_od", { precision: 5, scale: 2 }),
  interestCD: decimal("interest_cd", { precision: 5, scale: 2 }),
  interestLoan: decimal("interest_loan", { precision: 5, scale: 2 }),
  interestEmergencyLoan: decimal("interest_emergency_loan", { precision: 5, scale: 2 }),
  interestLAS: decimal("interest_las", { precision: 5, scale: 2 }),
  
  // Limits
  limitShare: decimal("limit_share", { precision: 12, scale: 2 }),
  limitLoan: decimal("limit_loan", { precision: 12, scale: 2 }),
  limitEmergencyLoan: decimal("limit_emergency_loan", { precision: 12, scale: 2 }),
  
  // Bounce charge
  chBounceChargeAmount: decimal("ch_bounce_charge_amount", { precision: 10, scale: 2 }),
  chBounceChargeMode: varchar("ch_bounce_charge_mode", { length: 50 }),
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Members table
export const members = pgTable("members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memNo: varchar("mem_no", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  fatherHusbandName: varchar("father_husband_name", { length: 100 }),
  officeAddress: text("office_address"),
  city: varchar("city", { length: 100 }),
  phoneOffice: varchar("phone_office", { length: 20 }),
  branch: varchar("branch", { length: 100 }),
  phoneResidence: varchar("phone_residence", { length: 20 }),
  mobile: varchar("mobile", { length: 20 }),
  designation: varchar("designation", { length: 100 }),
  residenceAddress: text("residence_address"),
  dob: timestamp("dob"),
  dojSociety: timestamp("doj_society"),
  email: varchar("email", { length: 100 }),
  dojOrg: timestamp("doj_org"),
  dor: timestamp("dor"),
  nominee: varchar("nominee", { length: 100 }),
  nomineeRelation: varchar("nominee_relation", { length: 50 }),
  openingBalanceShare: decimal("opening_balance_share", { precision: 12, scale: 2 }),
  value: decimal("value", { precision: 12, scale: 2 }),
  crDrCd: varchar("cr_dr_cd", { length: 10 }),
  bankName: varchar("bank_name", { length: 100 }),
  payableAt: varchar("payable_at", { length: 100 }),
  accountNo: varchar("account_no", { length: 50 }),
  status: varchar("status", { length: 20 }).default("Active"),
  statusDate: timestamp("status_date"),
  deductions: jsonb("deductions"), // Array of deduction types
  photoUrl: varchar("photo_url", { length: 500 }),
  signatureUrl: varchar("signature_url", { length: 500 }),
  societyId: varchar("society_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Loan Types lookup
export const loanTypes = pgTable("loan_types", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull(),
  isActive: boolean("is_active").default(true),
});

// Banks lookup
export const banks = pgTable("banks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull(),
  isActive: boolean("is_active").default(true),
});

// Loans table
export const loans = pgTable("loans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  loanNo: varchar("loan_no", { length: 20 }).notNull().unique(),
  loanTypeId: varchar("loan_type_id").notNull(),
  loanDate: timestamp("loan_date").defaultNow(),
  edpNo: varchar("edp_no", { length: 20 }),
  name: varchar("name", { length: 100 }),
  loanAmount: decimal("loan_amount", { precision: 12, scale: 2 }).notNull(),
  previousLoan: decimal("previous_loan", { precision: 12, scale: 2 }).default("0"),
  netLoan: decimal("net_loan", { precision: 12, scale: 2 }),
  installments: integer("installments"),
  installmentAmount: decimal("installment_amount", { precision: 10, scale: 2 }),
  purpose: text("purpose"),
  authorizedBy: varchar("authorized_by", { length: 100 }),
  paymentMode: varchar("payment_mode", { length: 20 }),
  bankId: varchar("bank_id"),
  chequeNo: varchar("cheque_no", { length: 50 }),
  chequeDate: timestamp("cheque_date"),
  share: decimal("share", { precision: 10, scale: 2 }),
  cd: decimal("cd", { precision: 10, scale: 2 }),
  lastSalary: decimal("last_salary", { precision: 10, scale: 2 }),
  mwf: decimal("mwf", { precision: 10, scale: 2 }),
  payAmount: decimal("pay_amount", { precision: 10, scale: 2 }),
  givenTable: jsonb("given_table"), // Array of {memNo, name}
  takenTable: jsonb("taken_table"), // Array of {memNo, name}
  societyId: varchar("society_id").notNull(),
  isValidated: boolean("is_validated").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Voucher Types lookup
export const voucherTypes = pgTable("voucher_types", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull(),
  isActive: boolean("is_active").default(true),
});

// Vouchers table
export const vouchers = pgTable("vouchers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  voucherNo: varchar("voucher_no", { length: 20 }).notNull().unique(),
  voucherTypeId: varchar("voucher_type_id").notNull(),
  date: timestamp("date").defaultNow(),
  chequeNo: varchar("cheque_no", { length: 50 }),
  chequeDate: timestamp("cheque_date"),
  narration: text("narration"),
  remarks: text("remarks"),
  passDate: timestamp("pass_date"),
  totalDebit: decimal("total_debit", { precision: 12, scale: 2 }).default("0"),
  totalCredit: decimal("total_credit", { precision: 12, scale: 2 }).default("0"),
  isBalanced: boolean("is_balanced").default(false),
  societyId: varchar("society_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Voucher Lines table
export const voucherLines = pgTable("voucher_lines", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  voucherId: varchar("voucher_id").notNull(),
  particulars: varchar("particulars", { length: 200 }),
  debit: decimal("debit", { precision: 12, scale: 2 }).default("0"),
  credit: decimal("credit", { precision: 12, scale: 2 }).default("0"),
  dbCr: varchar("db_cr", { length: 10 }),
  ibldbc: decimal("ibldbc", { precision: 10, scale: 2 }).default("0"),
  lineOrder: integer("line_order").default(0),
});

// Monthly Demand Header
export const monthlyDemandHeaders = pgTable("monthly_demand_headers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  month: varchar("month", { length: 20 }).notNull(),
  year: integer("year").notNull(),
  societyId: varchar("society_id").notNull(),
  totalMembers: integer("total_members").default(0),
  totalAmount: decimal("total_amount", { precision: 15, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Monthly Demand Rows
export const monthlyDemandRows = pgTable("monthly_demand_rows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  headerId: varchar("header_id").notNull(),
  edpNo: varchar("edp_no", { length: 20 }),
  memberName: varchar("member_name", { length: 100 }),
  loanAmt: decimal("loan_amt", { precision: 12, scale: 2 }).default("0"),
  cd: decimal("cd", { precision: 10, scale: 2 }).default("0"),
  loan: decimal("loan", { precision: 10, scale: 2 }).default("0"),
  interest: decimal("interest", { precision: 10, scale: 2 }).default("0"),
  eLoan: decimal("e_loan", { precision: 10, scale: 2 }).default("0"),
  interestExtra: decimal("interest_extra", { precision: 10, scale: 2 }).default("0"),
  net: decimal("net", { precision: 10, scale: 2 }).default("0"),
  intDue: decimal("int_due", { precision: 10, scale: 2 }).default("0"),
  pInt: decimal("p_int", { precision: 10, scale: 2 }).default("0"),
  pDed: decimal("p_ded", { precision: 10, scale: 2 }).default("0"),
  las: decimal("las", { precision: 10, scale: 2 }).default("0"),
  int: decimal("int", { precision: 10, scale: 2 }).default("0"),
  lasIntDue: decimal("las_int_due", { precision: 10, scale: 2 }).default("0"),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).default("0"),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  society: one(societies, {
    fields: [users.societyId],
    references: [societies.id],
  }),
}));

export const societiesRelations = relations(societies, ({ many }) => ({
  users: many(users),
  members: many(members),
  loans: many(loans),
  vouchers: many(vouchers),
  monthlyDemandHeaders: many(monthlyDemandHeaders),
}));

export const membersRelations = relations(members, ({ one }) => ({
  society: one(societies, {
    fields: [members.societyId],
    references: [societies.id],
  }),
}));

export const loansRelations = relations(loans, ({ one }) => ({
  society: one(societies, {
    fields: [loans.societyId],
    references: [societies.id],
  }),
  loanType: one(loanTypes, {
    fields: [loans.loanTypeId],
    references: [loanTypes.id],
  }),
  bank: one(banks, {
    fields: [loans.bankId],
    references: [banks.id],
  }),
}));

export const vouchersRelations = relations(vouchers, ({ one, many }) => ({
  society: one(societies, {
    fields: [vouchers.societyId],
    references: [societies.id],
  }),
  voucherType: one(voucherTypes, {
    fields: [vouchers.voucherTypeId],
    references: [voucherTypes.id],
  }),
  lines: many(voucherLines),
}));

export const voucherLinesRelations = relations(voucherLines, ({ one }) => ({
  voucher: one(vouchers, {
    fields: [voucherLines.voucherId],
    references: [vouchers.id],
  }),
}));

export const monthlyDemandHeadersRelations = relations(monthlyDemandHeaders, ({ one, many }) => ({
  society: one(societies, {
    fields: [monthlyDemandHeaders.societyId],
    references: [societies.id],
  }),
  rows: many(monthlyDemandRows),
}));

export const monthlyDemandRowsRelations = relations(monthlyDemandRows, ({ one }) => ({
  header: one(monthlyDemandHeaders, {
    fields: [monthlyDemandRows.headerId],
    references: [monthlyDemandHeaders.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSocietySchema = createInsertSchema(societies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMemberSchema = createInsertSchema(members).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLoanSchema = createInsertSchema(loans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVoucherSchema = createInsertSchema(vouchers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVoucherLineSchema = createInsertSchema(voucherLines).omit({
  id: true,
});

export const insertMonthlyDemandHeaderSchema = createInsertSchema(monthlyDemandHeaders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMonthlyDemandRowSchema = createInsertSchema(monthlyDemandRows).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Society = typeof societies.$inferSelect;
export type InsertSociety = z.infer<typeof insertSocietySchema>;
export type Member = typeof members.$inferSelect;
export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Loan = typeof loans.$inferSelect;
export type InsertLoan = z.infer<typeof insertLoanSchema>;
export type Voucher = typeof vouchers.$inferSelect;
export type InsertVoucher = z.infer<typeof insertVoucherSchema>;
export type VoucherLine = typeof voucherLines.$inferSelect;
export type InsertVoucherLine = z.infer<typeof insertVoucherLineSchema>;
export type MonthlyDemandHeader = typeof monthlyDemandHeaders.$inferSelect;
export type InsertMonthlyDemandHeader = z.infer<typeof insertMonthlyDemandHeaderSchema>;
export type MonthlyDemandRow = typeof monthlyDemandRows.$inferSelect;
export type InsertMonthlyDemandRow = z.infer<typeof insertMonthlyDemandRowSchema>;
export type LoanType = typeof loanTypes.$inferSelect;
export type Bank = typeof banks.$inferSelect;
export type VoucherType = typeof voucherTypes.$inferSelect;

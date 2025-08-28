
using Microsoft.EntityFrameworkCore;
using Fintcs.Api.Models;

namespace Fintcs.Api.Data
{
    public class FintcsDbContext : DbContext
    {
        public FintcsDbContext(DbContextOptions<FintcsDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Society> Societies { get; set; }
        public DbSet<Member> Members { get; set; }
        public DbSet<Loan> Loans { get; set; }
        public DbSet<LoanType> LoanTypes { get; set; }
        public DbSet<Voucher> Vouchers { get; set; }
        public DbSet<VoucherType> VoucherTypes { get; set; }
        public DbSet<VoucherLine> VoucherLines { get; set; }
        public DbSet<Bank> Banks { get; set; }
        public DbSet<MonthlyDemandHeader> MonthlyDemandHeaders { get; set; }
        public DbSet<MonthlyDemandRow> MonthlyDemandRows { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Role).IsRequired().HasMaxLength(20);
                entity.HasIndex(e => e.Username).IsUnique();
            });

            // Society configuration
            modelBuilder.Entity<Society>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.InterestDividend).HasColumnType("decimal(5,2)");
                entity.Property(e => e.InterestOD).HasColumnType("decimal(5,2)");
                entity.Property(e => e.InterestCD).HasColumnType("decimal(5,2)");
                entity.Property(e => e.InterestLoan).HasColumnType("decimal(5,2)");
                entity.Property(e => e.InterestEmergencyLoan).HasColumnType("decimal(5,2)");
                entity.Property(e => e.InterestLAS).HasColumnType("decimal(5,2)");
                entity.Property(e => e.LimitShare).HasColumnType("decimal(12,2)");
                entity.Property(e => e.LimitLoan).HasColumnType("decimal(12,2)");
                entity.Property(e => e.LimitEmergencyLoan).HasColumnType("decimal(12,2)");
            });

            // Member configuration
            modelBuilder.Entity<Member>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.MemNo).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.OpeningBalanceShare).HasColumnType("decimal(12,2)");
                entity.Property(e => e.Value).HasColumnType("decimal(12,2)");
                entity.HasIndex(e => e.MemNo).IsUnique();
                entity.HasOne<Society>().WithMany().HasForeignKey(e => e.SocietyId);
            });

            // Loan configuration
            modelBuilder.Entity<Loan>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.LoanNo).IsRequired().HasMaxLength(20);
                entity.Property(e => e.LoanAmount).HasColumnType("decimal(12,2)");
                entity.Property(e => e.PreviousLoan).HasColumnType("decimal(12,2)");
                entity.Property(e => e.NetLoan).HasColumnType("decimal(12,2)");
                entity.Property(e => e.InstallmentAmount).HasColumnType("decimal(10,2)");
                entity.HasIndex(e => e.LoanNo).IsUnique();
                entity.HasOne<Society>().WithMany().HasForeignKey(e => e.SocietyId);
                entity.HasOne<LoanType>().WithMany().HasForeignKey(e => e.LoanTypeId);
            });

            // Voucher configuration
            modelBuilder.Entity<Voucher>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.VoucherNo).IsRequired().HasMaxLength(20);
                entity.Property(e => e.TotalDebit).HasColumnType("decimal(12,2)");
                entity.Property(e => e.TotalCredit).HasColumnType("decimal(12,2)");
                entity.HasIndex(e => e.VoucherNo).IsUnique();
                entity.HasOne<Society>().WithMany().HasForeignKey(e => e.SocietyId);
                entity.HasOne<VoucherType>().WithMany().HasForeignKey(e => e.VoucherTypeId);
            });

            // VoucherLine configuration
            modelBuilder.Entity<VoucherLine>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Debit).HasColumnType("decimal(12,2)");
                entity.Property(e => e.Credit).HasColumnType("decimal(12,2)");
                entity.HasOne<Voucher>().WithMany(v => v.Lines).HasForeignKey(e => e.VoucherId);
            });

            // Monthly Demand configuration
            modelBuilder.Entity<MonthlyDemandHeader>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.TotalAmount).HasColumnType("decimal(15,2)");
                entity.HasOne<Society>().WithMany().HasForeignKey(e => e.SocietyId);
            });

            modelBuilder.Entity<MonthlyDemandRow>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.LoanAmt).HasColumnType("decimal(12,2)");
                entity.Property(e => e.TotalAmount).HasColumnType("decimal(12,2)");
                entity.HasOne<MonthlyDemandHeader>().WithMany(h => h.Rows).HasForeignKey(e => e.HeaderId);
            });
        }
    }
}

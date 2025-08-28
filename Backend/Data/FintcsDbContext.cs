
using Microsoft.EntityFrameworkCore;
using Fintcs.Api.Models;

namespace Fintcs.Api.Data
{
    public class FintcsDbContext : DbContext
    {
        public FintcsDbContext(DbContextOptions<FintcsDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Society> Societies { get; set; }
        public DbSet<Member> Members { get; set; }
        public DbSet<Loan> Loans { get; set; }
        public DbSet<LoanType> LoanTypes { get; set; }
        public DbSet<Voucher> Vouchers { get; set; }
        public DbSet<VoucherLine> VoucherLines { get; set; }
        public DbSet<VoucherType> VoucherTypes { get; set; }
        public DbSet<MonthlyDemandHeader> MonthlyDemandHeaders { get; set; }
        public DbSet<MonthlyDemandRow> MonthlyDemandRows { get; set; }
        public DbSet<Bank> Banks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Username).IsUnique();
                entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Role).IsRequired().HasMaxLength(20);
                entity.Property(e => e.PasswordHash).IsRequired();
            });

            // Configure Society entity
            modelBuilder.Entity<Society>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Code).IsRequired().HasMaxLength(20);
                entity.HasIndex(e => e.Code).IsUnique();
            });

            // Configure Member entity
            modelBuilder.Entity<Member>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.EdpNo).HasMaxLength(20);
                entity.HasOne<Society>()
                    .WithMany()
                    .HasForeignKey(e => e.SocietyId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure Loan entity
            modelBuilder.Entity<Loan>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.InterestRate).HasColumnType("decimal(5,2)");
                entity.Property(e => e.OutstandingAmount).HasColumnType("decimal(18,2)");
                entity.HasOne<Member>()
                    .WithMany()
                    .HasForeignKey(e => e.MemberId)
                    .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne<LoanType>()
                    .WithMany()
                    .HasForeignKey(e => e.LoanTypeId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure Voucher entity
            modelBuilder.Entity<Voucher>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.TotalAmount).HasColumnType("decimal(18,2)");
                entity.HasOne<Society>()
                    .WithMany()
                    .HasForeignKey(e => e.SocietyId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure VoucherLine entity
            modelBuilder.Entity<VoucherLine>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
                entity.HasOne<Voucher>()
                    .WithMany()
                    .HasForeignKey(e => e.VoucherId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Seed initial data
            modelBuilder.Entity<LoanType>().HasData(
                new LoanType { Id = Guid.NewGuid(), Name = "Personal Loan", Description = "Personal loans for members", InterestRate = 12.0m },
                new LoanType { Id = Guid.NewGuid(), Name = "Emergency Loan", Description = "Emergency loans for urgent needs", InterestRate = 10.0m },
                new LoanType { Id = Guid.NewGuid(), Name = "Festival Loan", Description = "Festival advance loans", InterestRate = 8.0m }
            );

            modelBuilder.Entity<VoucherType>().HasData(
                new VoucherType { Id = Guid.NewGuid(), Name = "Payment", Description = "Payment vouchers" },
                new VoucherType { Id = Guid.NewGuid(), Name = "Receipt", Description = "Receipt vouchers" },
                new VoucherType { Id = Guid.NewGuid(), Name = "Journal", Description = "Journal vouchers" }
            );
        }
    }
}

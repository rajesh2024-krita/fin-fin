import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import jwt from "jsonwebtoken";
import { insertUserSchema, insertSocietySchema, insertMemberSchema, insertLoanSchema, insertVoucherSchema } from "@shared/schema";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "fintcs-secret-key";

// Auth middleware
interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
    societyId?: string;
  };
}

const authenticateToken = async (req: AuthRequest, res: Response, next: Function) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: Function) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Seed initial data
  async function seedData() {
    try {
      // Check if super admin exists
      const existingAdmin = await storage.getUserByUsername('admin');
      if (!existingAdmin) {
        // Create super admin
        await storage.createUser({
          username: 'admin',
          passwordHash: 'admin', // Will be hashed in storage
          role: 'SuperAdmin',
          name: 'Super Administrator',
          email: 'admin@fintcs.com',
          isActive: true,
        });
        console.log('Super admin created');
      }

      // Seed lookup data
      const loanTypes = await storage.getLoanTypes();
      if (loanTypes.length === 0) {
        // This would normally be done via direct DB insert or migrations
        console.log('Lookup data needs to be seeded manually');
      }
    } catch (error) {
      console.error('Error seeding data:', error);
    }
  }

  await seedData();

  // Authentication routes
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required' });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await storage.validatePassword(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username, 
          role: user.role,
          societyId: user.societyId 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
          societyId: user.societyId,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/auth/me', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        societyId: user.societyId,
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Dashboard routes
  app.get('/api/dashboard/stats', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const societyId = req.user!.role === 'SuperAdmin' ? undefined : req.user!.societyId;
      const stats = await storage.getDashboardStats(societyId);
      res.json(stats);
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Society routes
  app.get('/api/societies', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const { city, isActive } = req.query;
      const filters: any = {};
      
      if (city) filters.city = city as string;
      if (isActive !== undefined) filters.isActive = isActive === 'true';
      
      const societies = await storage.getSocieties(filters);
      res.json(societies);
    } catch (error) {
      console.error('Get societies error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/societies', authenticateToken, requireRole(['SuperAdmin']), async (req: AuthRequest, res: Response) => {
    try {
      const validatedData = insertSocietySchema.parse(req.body);
      const society = await storage.createSociety(validatedData);
      res.status(201).json(society);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      console.error('Create society error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/societies/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const society = await storage.getSociety(req.params.id);
      if (!society) {
        return res.status(404).json({ message: 'Society not found' });
      }
      res.json(society);
    } catch (error) {
      console.error('Get society error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.put('/api/societies/:id', authenticateToken, requireRole(['SuperAdmin', 'SocietyAdmin']), async (req: AuthRequest, res: Response) => {
    try {
      const validatedData = insertSocietySchema.partial().parse(req.body);
      const society = await storage.updateSociety(req.params.id, validatedData);
      res.json(society);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      console.error('Update society error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // User routes
  app.get('/api/users', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const { societyId, role } = req.query;
      const filters: any = {};
      
      if (societyId) filters.societyId = societyId as string;
      if (role) filters.role = role as string;
      
      // Society admins can only see users in their society
      if (req.user!.role === 'SocietyAdmin') {
        filters.societyId = req.user!.societyId;
      }
      
      const users = await storage.getUsers(filters);
      res.json(users);
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/users', authenticateToken, requireRole(['SuperAdmin', 'SocietyAdmin']), async (req: AuthRequest, res: Response) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Society admins can only create users in their society
      if (req.user!.role === 'SocietyAdmin') {
        validatedData.societyId = req.user!.societyId;
      }
      
      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      console.error('Create user error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Member routes
  app.get('/api/members', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const { societyId, status } = req.query;
      const filters: any = {};
      
      if (societyId) filters.societyId = societyId as string;
      if (status) filters.status = status as string;
      
      // Society admins can only see members in their society
      if (req.user!.role === 'SocietyAdmin') {
        filters.societyId = req.user!.societyId;
      }
      
      const members = await storage.getMembers(filters);
      res.json(members);
    } catch (error) {
      console.error('Get members error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/members', authenticateToken, requireRole(['SuperAdmin', 'SocietyAdmin']), async (req: AuthRequest, res: Response) => {
    try {
      const validatedData = insertMemberSchema.parse(req.body);
      
      // Society admins can only create members in their society
      if (req.user!.role === 'SocietyAdmin') {
        validatedData.societyId = req.user!.societyId!;
      }
      
      const member = await storage.createMember(validatedData);
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      console.error('Create member error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Loan routes
  app.get('/api/loans', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const { societyId, loanTypeId } = req.query;
      const filters: any = {};
      
      if (societyId) filters.societyId = societyId as string;
      if (loanTypeId) filters.loanTypeId = loanTypeId as string;
      
      // Society admins can only see loans in their society
      if (req.user!.role === 'SocietyAdmin') {
        filters.societyId = req.user!.societyId;
      }
      
      const loans = await storage.getLoans(filters);
      res.json(loans);
    } catch (error) {
      console.error('Get loans error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/loans', authenticateToken, requireRole(['SuperAdmin', 'SocietyAdmin']), async (req: AuthRequest, res: Response) => {
    try {
      const validatedData = insertLoanSchema.parse(req.body);
      
      // Society admins can only create loans in their society
      if (req.user!.role === 'SocietyAdmin') {
        validatedData.societyId = req.user!.societyId!;
      }
      
      const loan = await storage.createLoan(validatedData);
      res.status(201).json(loan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      console.error('Create loan error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Voucher routes
  app.get('/api/vouchers', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const { societyId, voucherTypeId } = req.query;
      const filters: any = {};
      
      if (societyId) filters.societyId = societyId as string;
      if (voucherTypeId) filters.voucherTypeId = voucherTypeId as string;
      
      // Society admins can only see vouchers in their society
      if (req.user!.role === 'SocietyAdmin') {
        filters.societyId = req.user!.societyId;
      }
      
      const vouchers = await storage.getVouchers(filters);
      res.json(vouchers);
    } catch (error) {
      console.error('Get vouchers error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/vouchers', authenticateToken, requireRole(['SuperAdmin', 'SocietyAdmin']), async (req: AuthRequest, res: Response) => {
    try {
      const validatedData = insertVoucherSchema.parse(req.body);
      
      // Society admins can only create vouchers in their society
      if (req.user!.role === 'SocietyAdmin') {
        validatedData.societyId = req.user!.societyId!;
      }
      
      const voucher = await storage.createVoucher(validatedData);
      res.status(201).json(voucher);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      console.error('Create voucher error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Lookup routes
  app.get('/api/lookup/loan-types', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const loanTypes = await storage.getLoanTypes();
      res.json(loanTypes);
    } catch (error) {
      console.error('Get loan types error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/lookup/banks', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const banks = await storage.getBanks();
      res.json(banks);
    } catch (error) {
      console.error('Get banks error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/lookup/voucher-types', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const voucherTypes = await storage.getVoucherTypes();
      res.json(voucherTypes);
    } catch (error) {
      console.error('Get voucher types error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

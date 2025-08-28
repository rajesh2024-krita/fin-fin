
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ChartLine, Lock, User, Eye, EyeOff, Shield, Building2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (!success) {
        setError("Invalid username or password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = [
    { role: "Super Admin", username: "admin", password: "admin", icon: Shield, color: "text-red-600" },
    { role: "Society Admin", username: "society1", password: "password", icon: Building2, color: "text-blue-600" },
    { role: "User", username: "user1", password: "password", icon: User, color: "text-green-600" },
    { role: "Member", username: "member1", password: "password", icon: User, color: "text-purple-600" }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center p-12 text-primary-foreground">
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <ChartLine className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Fintcs</h1>
                <p className="text-lg opacity-90">Finance Management System</p>
              </div>
            </div>
            
            <h2 className="text-3xl font-semibold mb-4">
              Streamline Your Financial Operations
            </h2>
            <p className="text-lg opacity-90 leading-relaxed">
              Comprehensive solution for managing societies, members, loans, and financial reporting. 
              Built for efficiency, security, and professional financial management.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Multi-role access control</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Real-time financial analytics</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Automated loan processing</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Comprehensive reporting suite</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <ChartLine className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Fintcs</h1>
                <p className="text-sm text-muted-foreground">Finance Management</p>
              </div>
            </div>
          </div>

          <Card className="shadow-lg border-0 lg:shadow-xl">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="hidden lg:flex justify-center">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                  <Lock className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                <CardDescription className="text-base">
                  Sign in to your finance management system
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10"
                      data-testid="input-username"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      data-testid="input-password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11"
                  disabled={isLoading || !username || !password}
                  data-testid="button-login"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <Separator />

              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Demo Credentials</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {demoCredentials.map((cred, index) => {
                    const Icon = cred.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="justify-start h-auto p-3"
                        onClick={() => {
                          setUsername(cred.username);
                          setPassword(cred.password);
                        }}
                      >
                        <Icon className={`h-4 w-4 mr-2 ${cred.color}`} />
                        <div className="text-left">
                          <div className="text-xs font-medium">{cred.role}</div>
                          <div className="text-xs text-muted-foreground">{cred.username}</div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 Fintcs. Professional Finance Management System.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

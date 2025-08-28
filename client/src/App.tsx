import { Route, Router, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Societies from "@/pages/Societies";
import Users from "@/pages/Users";
import Members from "@/pages/Members";
import Loans from "@/pages/Loans";
import MonthlyDemand from "@/pages/MonthlyDemand";
import Vouchers from "@/pages/Vouchers";
import Reports from "@/pages/Reports";
import NotFound from "@/pages/not-found";

import { queryClient } from "@/lib/queryClient";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/" component={Dashboard} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/societies" component={Societies} />
            <Route path="/users" component={Users} />
            <Route path="/members" component={Members} />
            <Route path="/loans" component={Loans} />
            <Route path="/monthly-demand" component={MonthlyDemand} />
            <Route path="/vouchers" component={Vouchers} />
            <Route path="/reports" component={Reports} />
            <Route component={NotFound} />
          </Switch>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
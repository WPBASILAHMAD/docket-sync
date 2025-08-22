import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import AddConnote from "./pages/connotes/AddConnote";
import ConnotesList from "./pages/connotes/ConnotesList";
import ConnoteInvoice from "./pages/connotes/ConnoteInvoice";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthGuard>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/connotes/add" element={<AddConnote />} />
              <Route path="/connotes/list" element={<ConnotesList />} />
              <Route path="/connotes/:id/invoice" element={<ConnoteInvoice />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </AuthGuard>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

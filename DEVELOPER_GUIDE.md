# Developer Guide - Service Provider Search Frontend

> Comprehensive technical documentation for developers and AI agents

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Project Setup](#project-setup)
- [Code Structure](#code-structure)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [Authentication Flow](#authentication-flow)
- [Component Patterns](#component-patterns)
- [Styling Guide](#styling-guide)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Overview

### Technology Stack

```
┌─────────────────────────────────────────┐
│         React 19 + TypeScript           │
├─────────────────────────────────────────┤
│  Routing: Wouter                        │
│  State: TanStack Query (React Query)    │
│  Forms: React Hook Form                 │
│  HTTP: Axios                            │
├─────────────────────────────────────────┤
│  UI: shadcn/ui (Radix UI)               │
│  Styling: Tailwind CSS 4                │
│  Icons: Lucide React                    │
├─────────────────────────────────────────┤
│  Build: Vite 7                          │
│  Package Manager: pnpm                  │
└─────────────────────────────────────────┘
```

### Application Flow

```
User Request
    ↓
Router (Wouter)
    ↓
Page Component
    ↓
Custom Hook (useProviders, useAuth)
    ↓
TanStack Query
    ↓
API Client (Axios)
    ↓
Backend API
    ↓
Response → Cache → UI Update
```

### Directory Structure

```
client/
├── public/                 # Static assets (served at root)
├── src/
│   ├── components/
│   │   ├── admin/          # Admin-specific components
│   │   │   ├── ProvidersListTab.tsx
│   │   │   ├── CreateProviderTab.tsx
│   │   │   ├── EditProviderDialog.tsx
│   │   │   ├── UploadTab.tsx
│   │   │   └── StatisticsTab.tsx
│   │   ├── ui/             # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ... (30+ components)
│   │   └── ErrorBoundary.tsx
│   ├── contexts/
│   │   └── ThemeContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts      # Authentication logic
│   │   └── useProviders.ts # Provider CRUD operations
│   ├── lib/
│   │   ├── api.ts          # API client + types
│   │   └── utils.ts        # Utility functions
│   ├── pages/
│   │   ├── Home.tsx        # Public search page
│   │   ├── ProviderDetail.tsx
│   │   ├── Login.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── NotFound.tsx
│   ├── App.tsx             # Root component + routes
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles + Tailwind
└── package.json
```

---

## 🚀 Project Setup

### Prerequisites

```bash
# Required
Node.js >= 18.0.0
pnpm >= 8.0.0

# Optional but recommended
Git
VS Code with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript Vue Plugin (Volar)
```

### Installation Steps

```bash
# 1. Clone repository
git clone https://github.com/yourusername/service-provider-frontend.git
cd service-provider-frontend

# 2. Install dependencies
pnpm install

# 3. Configure environment
# Set VITE_API_URL through platform settings or create .env.local:
echo "VITE_API_URL=http://localhost:3000/api/v1" > .env.local

# 4. Start development server
pnpm dev

# 5. Open browser
# http://localhost:3001
```

### Development Commands

```bash
# Start dev server with HMR
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Type checking
pnpm type-check

# Linting (if configured)
pnpm lint

# Add shadcn/ui component
pnpm dlx shadcn@latest add [component-name]
```

---

## 📂 Code Structure

### Component Organization

```typescript
// ✅ Good: Organized by feature
components/
  admin/
    ProvidersListTab.tsx    # List view
    CreateProviderTab.tsx   # Create form
    EditProviderDialog.tsx  # Edit dialog
    UploadTab.tsx           # Excel upload
    StatisticsTab.tsx       # Analytics

// ❌ Bad: Flat structure
components/
  Component1.tsx
  Component2.tsx
  Component3.tsx
```

### File Naming Conventions

```bash
# Components: PascalCase
Home.tsx
ProviderDetail.tsx
AdminDashboard.tsx

# Hooks: camelCase with 'use' prefix
useAuth.ts
useProviders.ts
useDebounce.ts

# Utilities: camelCase
api.ts
utils.ts
constants.ts

# Types: PascalCase with .types.ts suffix
provider.types.ts
auth.types.ts
```

### Import Order

```typescript
// 1. External dependencies
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Internal components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 3. Hooks
import { useAuth } from '@/hooks/useAuth';
import { useProviders } from '@/hooks/useProviders';

// 4. Utils and types
import { api, type ServiceProvider } from '@/lib/api';

// 5. Styles (if any)
import './styles.css';
```

---

## 📡 API Integration

### API Client (`lib/api.ts`)

```typescript
// Base configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (adds auth token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (handles 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Type Definitions

```typescript
// All API types are defined in lib/api.ts
export interface ServiceProvider {
  id: string;
  providerName: string;
  providerType: string;
  servicesProvided: string;
  specialization: string;
  address: string;
  city: string;
  province: string;
  phoneNumber?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SearchParams {
  q?: string;
  province?: string;
  city?: string;
  specialization?: string;
  providerType?: string;
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  data: ServiceProvider[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

### API Functions

```typescript
// Public endpoints (no auth)
export const providerApi = {
  search: (params: SearchParams) =>
    api.get<SearchResponse>('/providers/search', { params }),
  
  getById: (id: string) =>
    api.get<ServiceProvider>(`/providers/${id}`),
  
  getFilters: () =>
    api.get<FilterOptions>('/providers/filters'),
  
  getStatistics: () =>
    api.get<Statistics>('/providers/statistics'),
};

// Admin endpoints (auth required)
export const adminApi = {
  create: (data: Omit<ServiceProvider, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<{ message: string; data: ServiceProvider }>('/admin/providers', data),
  
  update: (id: string, data: Partial<ServiceProvider>) =>
    api.put<{ message: string; data: ServiceProvider }>(`/admin/providers/${id}`, data),
  
  delete: (id: string) =>
    api.delete<{ message: string }>(`/admin/providers/${id}`),
  
  uploadExcel: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/providers/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
```

---

## 🔄 State Management

### TanStack Query (React Query)

All server state is managed by React Query in `hooks/useProviders.ts`:

```typescript
// Query hook (read data)
export function useProviderSearch(params: SearchParams) {
  return useQuery({
    queryKey: ['providers', 'search', params],
    queryFn: async () => {
      const response = await providerApi.search(params);
      return response.data;
    },
  });
}

// Mutation hook (write data)
export function useCreateProvider() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateProviderDto) => providerApi.create(data),
    onSuccess: () => {
      // Invalidate cache to refetch
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      toast.success('Provider created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create provider');
    },
  });
}
```

### Query Keys Convention

```typescript
// Format: ['resource', 'operation', ...params]

['providers', 'search', { q: 'جراحة', page: 1 }]  // Search results
['providers', 'id123']                             // Single provider
['providers', 'filters']                           // Filter options
['providers', 'statistics']                        // Statistics
```

### Cache Invalidation

```typescript
// Invalidate all provider queries
queryClient.invalidateQueries({ queryKey: ['providers'] });

// Invalidate specific query
queryClient.invalidateQueries({ queryKey: ['providers', 'search'] });

// Invalidate exact query
queryClient.invalidateQueries({ 
  queryKey: ['providers', 'search', { q: 'test' }],
  exact: true 
});
```

### Local State

Use React's `useState` for UI-only state:

```typescript
// ✅ Good: UI state
const [isDialogOpen, setIsDialogOpen] = useState(false);
const [selectedTab, setSelectedTab] = useState('list');

// ❌ Bad: Server data in useState
const [providers, setProviders] = useState([]); // Use React Query instead
```

---

## 🔐 Authentication Flow

### Authentication Hook (`hooks/useAuth.ts`)

```typescript
export function useAuth() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState(() => authApi.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => authApi.isAuthenticated());

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      // Store token and user
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Update state
      setUser(response.data.user);
      setIsAuthenticated(true);
      
      // Redirect to admin
      setLocation('/admin');
      toast.success('Login successful');
    },
  });

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setLocation('/login');
  };

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout,
  };
}
```

### Protected Routes

```typescript
function AdminDashboard() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) {
    return null; // or loading spinner
  }

  return <div>Admin content</div>;
}
```

### Token Management

```typescript
// Token is automatically added to requests via interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 🧩 Component Patterns

### Page Component Pattern

```typescript
// pages/Home.tsx
export default function Home() {
  // 1. State
  const [searchParams, setSearchParams] = useState<SearchParams>({
    page: 1,
    limit: 20,
  });

  // 2. Data fetching
  const { data, isLoading } = useProviderSearch(searchParams);
  const { data: filters } = useFilterOptions();

  // 3. Event handlers
  const handleSearch = (value: string) => {
    setSearchParams((prev) => ({ ...prev, q: value, page: 1 }));
  };

  // 4. Render
  return (
    <div>
      {/* UI */}
    </div>
  );
}
```

### Form Component Pattern

```typescript
// components/admin/CreateProviderTab.tsx
export default function CreateProviderTab() {
  // 1. Form setup
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProviderForm>();
  
  // 2. Mutation
  const createMutation = useCreateProvider();

  // 3. Submit handler
  const onSubmit = (data: ProviderForm) => {
    createMutation.mutate(data, {
      onSuccess: () => reset(),
    });
  };

  // 4. Render
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

### Dialog Component Pattern

```typescript
// components/admin/EditProviderDialog.tsx
interface EditProviderDialogProps {
  provider: ServiceProvider;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProviderDialog({
  provider,
  open,
  onOpenChange,
}: EditProviderDialogProps) {
  const updateMutation = useUpdateProvider();
  const { register, handleSubmit } = useForm({
    defaultValues: provider,
  });

  const onSubmit = (data: ProviderForm) => {
    updateMutation.mutate(
      { id: provider.id, data },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Form fields */}
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 🎨 Styling Guide

### Tailwind CSS Configuration

```typescript
// tailwind.config.ts
export default {
  content: ['./client/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // CSS variables from index.css
        background: 'oklch(var(--background))',
        foreground: 'oklch(var(--foreground))',
        // ...
      },
    },
  },
};
```

### CSS Variables

```css
/* client/src/index.css */
@layer base {
  :root {
    --background: oklch(1 0 0);
    --foreground: oklch(0.145 0 0);
    --primary: oklch(0.492 0.186 264.376);
    --primary-foreground: oklch(1 0 0);
    /* ... */
  }
}
```

### Component Styling

```tsx
// ✅ Good: Use Tailwind utilities
<div className="flex items-center gap-4 p-4 rounded-lg border bg-white">
  <Button className="w-full">Click me</Button>
</div>

// ❌ Bad: Inline styles
<div style={{ display: 'flex', padding: '16px' }}>
  <button style={{ width: '100%' }}>Click me</button>
</div>
```

### Responsive Design

```tsx
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Responsive grid */}
</div>

// Breakpoints:
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
// 2xl: 1536px
```

### RTL Support

```tsx
// Arabic text automatically gets RTL
<p className="text-right" dir="rtl">
  {provider.providerName}
</p>

// Phone numbers should be LTR
<p dir="ltr">{provider.phoneNumber}</p>
```

---

## ✅ Best Practices

### 1. TypeScript

```typescript
// ✅ Good: Use types from API
import type { ServiceProvider } from '@/lib/api';

function ProviderCard({ provider }: { provider: ServiceProvider }) {
  // TypeScript knows all properties
}

// ❌ Bad: Using 'any'
function ProviderCard({ provider }: { provider: any }) {
  // No type safety
}
```

### 2. Error Handling

```typescript
// ✅ Good: Handle errors in mutations
const deleteMutation = useDeleteProvider();

deleteMutation.mutate(id, {
  onError: (error: any) => {
    toast.error(error.response?.data?.message || 'Failed to delete');
  },
});

// ✅ Good: Show loading states
if (isLoading) return <Skeleton />;
if (error) return <ErrorMessage />;
```

### 3. Performance

```typescript
// ✅ Good: Memoize expensive computations
const filteredData = useMemo(() => {
  return data?.filter(item => item.active);
}, [data]);

// ✅ Good: Debounce search input
const debouncedSearch = useMemo(
  () => debounce((value: string) => setSearch(value), 300),
  []
);
```

### 4. Accessibility

```tsx
// ✅ Good: Semantic HTML + ARIA
<button
  aria-label="Delete provider"
  onClick={handleDelete}
>
  <Trash2 className="h-4 w-4" />
</button>

// ✅ Good: Keyboard navigation
<Dialog onOpenChange={setOpen}>
  {/* ESC to close, Tab to navigate */}
</Dialog>
```

### 5. Code Organization

```typescript
// ✅ Good: Small, focused components
function ProviderCard({ provider }) {
  return <Card>{/* Simple UI */}</Card>;
}

function ProviderList({ providers }) {
  return providers.map(p => <ProviderCard key={p.id} provider={p} />);
}

// ❌ Bad: Large, monolithic components
function ProviderPage() {
  // 500 lines of code...
}
```

---

## 🧪 Testing

### Manual Testing Checklist

**Public Features:**
- [ ] Search works with Arabic text
- [ ] Filters update results correctly
- [ ] Pagination works smoothly
- [ ] Provider detail page loads
- [ ] Responsive on mobile/tablet
- [ ] RTL layout for Arabic content

**Admin Features:**
- [ ] Login with valid credentials
- [ ] Logout redirects to login
- [ ] Create new provider
- [ ] Update existing provider
- [ ] Delete provider with confirmation
- [ ] Upload Excel file
- [ ] View statistics
- [ ] Protected routes redirect to login

**Performance:**
- [ ] Initial load < 3s
- [ ] Search response < 1s
- [ ] No console errors
- [ ] No memory leaks

---

## 🚀 Deployment

### Build Process

```bash
# 1. Install dependencies
pnpm install

# 2. Set environment variables
export VITE_API_URL=https://api.yourdomain.com/api/v1

# 3. Build
pnpm build

# 4. Output: dist/ folder
```

### Deployment Platforms

#### **Netlify**

```bash
# netlify.toml
[build]
  command = "cd client && pnpm install && pnpm build"
  publish = "client/dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### **Render.com**

```yaml
# render.yaml
services:
  - type: web
    name: service-provider-frontend
    env: static
    buildCommand: cd client && pnpm install && pnpm build
    staticPublishPath: client/dist
    envVars:
      - key: VITE_API_URL
        value: https://your-api.onrender.com/api/v1
```

#### **Cloudflare Pages**

```bash
# Build settings
Build command: cd client && pnpm install && pnpm build
Build output directory: client/dist
```

### Environment Variables

```bash
# Production
VITE_API_URL=https://api.yourdomain.com/api/v1

# Staging
VITE_API_URL=https://staging-api.yourdomain.com/api/v1

# Development
VITE_API_URL=http://localhost:3000/api/v1
```

---

## 🔧 Troubleshooting

### Common Issues

**Issue 1: "Network Error"**

```
Cause: Frontend can't reach backend
Solutions:
1. Check VITE_API_URL is correct
2. Verify backend is running
3. Check CORS is enabled on backend
4. Inspect network tab in browser DevTools
```

**Issue 2: "Unauthorized" errors**

```
Cause: Invalid or expired JWT token
Solutions:
1. Check token in localStorage
2. Verify token format (should start with "Bearer ")
3. Check token expiration
4. Try logging out and logging in again
```

**Issue 3: Build fails**

```
Cause: TypeScript errors or missing dependencies
Solutions:
1. Run: rm -rf node_modules && pnpm install
2. Check for TypeScript errors: pnpm type-check
3. Clear Vite cache: rm -rf node_modules/.vite
4. Update dependencies: pnpm update
```

**Issue 4: Slow performance**

```
Cause: Large bundle size or inefficient rendering
Solutions:
1. Check bundle size: pnpm build && ls -lh dist/
2. Use React DevTools Profiler
3. Implement code splitting
4. Optimize images
```

### Debug Mode

```typescript
// Enable React Query DevTools (development only)
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <>
      {/* Your app */}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
```

### Logging

```typescript
// API request/response logging
api.interceptors.request.use((config) => {
  console.log('Request:', config.method?.toUpperCase(), config.url);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Error:', error.message, error.config?.url);
    return Promise.reject(error);
  }
);
```

---

## 📚 Resources

### Official Documentation
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

### Backend Repository
- [service-provider-search-api](https://github.com/aihassan1/service-provider-search-api)

---

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Test thoroughly
6. Commit with clear messages
7. Push and create PR

### Code Review Checklist

- [ ] TypeScript types are correct
- [ ] Components are properly typed
- [ ] Error handling is implemented
- [ ] Loading states are shown
- [ ] Responsive design works
- [ ] Accessibility is maintained
- [ ] No console errors
- [ ] Code follows existing patterns

---

**Last Updated**: October 2025  
**Maintained by**: Development Team


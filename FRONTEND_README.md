# Service Provider Search - Frontend

A modern React application for searching and managing healthcare service providers across Egypt.

## 🎯 Features

### Public Features
- **Advanced Search**: Fuzzy search across provider names, specializations, services, addresses, and cities
- **Smart Filtering**: Filter by province (29), city (326), specialization (99), and provider type (12)
- **Pagination**: Browse through 4,346+ providers with smooth pagination
- **Provider Details**: View detailed information for each provider
- **Arabic Support**: Full RTL support for Arabic content
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### Admin Features (Authentication Required)
- **Dashboard**: Overview with statistics and recent providers
- **CRUD Operations**: Create, read, update, and delete providers
- **Excel Import**: Bulk upload providers from Excel files
- **Statistics**: Visual analytics of providers by province and specialization
- **Secure Access**: JWT-based authentication with role-based access control

## 🏗️ Tech Stack

- **Framework**: React 19 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form with validation
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Axios
- **Date Handling**: date-fns

## 📁 Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── admin/              # Admin panel components
│   │   │   ├── ProvidersListTab.tsx
│   │   │   ├── CreateProviderTab.tsx
│   │   │   ├── EditProviderDialog.tsx
│   │   │   ├── UploadTab.tsx
│   │   │   └── StatisticsTab.tsx
│   │   └── ui/                 # shadcn/ui components
│   ├── hooks/
│   │   ├── useAuth.ts          # Authentication hook
│   │   └── useProviders.ts     # Provider data hooks
│   ├── lib/
│   │   └── api.ts              # API client and types
│   ├── pages/
│   │   ├── Home.tsx            # Public search page
│   │   ├── ProviderDetail.tsx  # Provider detail page
│   │   ├── Login.tsx           # Admin login
│   │   └── AdminDashboard.tsx  # Admin dashboard
│   ├── App.tsx                 # Routes and providers
│   └── main.tsx                # Entry point
└── public/                     # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 22+
- pnpm (recommended) or npm
- Backend API running on http://localhost:3000

### Installation

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Configure environment**:
   The `VITE_API_URL` is already configured via the platform. For local changes, contact your admin.

3. **Start development server**:
   ```bash
   pnpm dev
   ```

4. **Open in browser**:
   ```
   http://localhost:3001
   ```

## 🔐 Authentication

### Default Admin Credentials

- **Email**: `admin@example.com`
- **Password**: `secret`

### How Authentication Works

1. User logs in via `/login` page
2. Backend returns JWT token
3. Token is stored in `localStorage`
4. Token is automatically added to all admin API requests
5. On 401 error, user is redirected to login

## 📡 API Integration

### API Client Configuration

The API client is configured in `client/src/lib/api.ts`:

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
```

### Available API Functions

```typescript
// Public endpoints (no auth required)
providerApi.search(params)           // Search providers
providerApi.getById(id)              // Get provider by ID
providerApi.getFilters()             // Get filter options
providerApi.getStatistics()          // Get statistics

// Admin endpoints (auth required)
providerApi.create(data)             // Create provider
providerApi.update(id, data)         // Update provider
providerApi.delete(id)               // Delete provider
providerApi.uploadExcel(file)        // Upload Excel file
providerApi.clearAll()               // Clear all providers

// Authentication
authApi.login(credentials)           // Login
authApi.logout()                     // Logout
authApi.getCurrentUser()             // Get current user
authApi.isAuthenticated()            // Check auth status
```

## 🎨 UI Components

### shadcn/ui Components Used

- **Layout**: Card, Tabs, Dialog, Alert
- **Forms**: Input, Label, Textarea, Select, Button
- **Data Display**: Table, Badge, Skeleton
- **Feedback**: Toast (Sonner), Alert

### Adding New Components

```bash
# Example: Add a new shadcn/ui component
pnpm dlx shadcn@latest add [component-name]
```

## 🔍 Search Functionality

### Search Parameters

```typescript
interface SearchParams {
  q?: string;              // Search query
  province?: string;       // Filter by province
  city?: string;           // Filter by city
  specialization?: string; // Filter by specialization
  providerType?: string;   // Filter by provider type
  page?: number;           // Page number (default: 1)
  limit?: number;          // Results per page (default: 20)
}
```

### Example Usage

```typescript
const { data, isLoading } = useProviderSearch({
  q: "جراحة",
  province: "القاهرة",
  page: 1,
  limit: 20
});
```

## 📊 State Management

### React Query Hooks

All data fetching is handled by React Query hooks in `hooks/useProviders.ts`:

```typescript
// Queries (read data)
useProviderSearch(params)    // Search with filters
useProvider(id)              // Get single provider
useFilterOptions()           // Get filter options
useStatistics()              // Get statistics

// Mutations (write data)
useCreateProvider()          // Create provider
useUpdateProvider()          // Update provider
useDeleteProvider()          // Delete provider
useUploadExcel()             // Upload Excel
useClearAllProviders()       // Clear all
```

### Benefits

- Automatic caching
- Background refetching
- Optimistic updates
- Error handling
- Loading states

## 🎯 Key Features Implementation

### 1. Fuzzy Search

The search uses backend fuzzy matching with PostgreSQL `pg_trgm`:

```typescript
// Frontend sends search query
const { data } = useProviderSearch({ q: "جراحة" });

// Backend performs fuzzy search across multiple fields
// Returns ranked results by relevance
```

### 2. Advanced Filtering

Multiple filters can be combined:

```typescript
const { data } = useProviderSearch({
  q: "طبيب",
  province: "القاهرة",
  city: "مدينة نصر",
  specialization: "أطفال"
});
```

### 3. Pagination

Automatic pagination with page state:

```typescript
const [page, setPage] = useState(1);
const { data } = useProviderSearch({ page, limit: 20 });

// Navigate pages
<Button onClick={() => setPage(page + 1)}>Next</Button>
```

### 4. Excel Upload

Admin can upload Excel files:

```typescript
const uploadMutation = useUploadExcel();

const handleUpload = (file: File) => {
  uploadMutation.mutate(file);
};
```

## 🔒 Protected Routes

Admin routes are protected using the `useAuth` hook:

```typescript
function AdminDashboard() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated]);

  // Render admin content
}
```

## 🎨 Styling Guide

### Tailwind CSS

The project uses Tailwind CSS 4 with custom configuration:

```css
/* Global styles in client/src/index.css */
@layer base {
  :root {
    --background: oklch(1 0 0);
    --foreground: oklch(0.145 0 0);
    /* ... more CSS variables */
  }
}
```

### Color Palette

- **Primary**: Blue (for main actions and links)
- **Secondary**: Gray (for secondary content)
- **Success**: Green (for success states)
- **Danger**: Red (for destructive actions)
- **Warning**: Yellow (for warnings)

### Responsive Design

All components are mobile-first:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Responsive grid */}
</div>
```

## 🧪 Testing

### Manual Testing Checklist

#### Public Features
- [ ] Search works with Arabic text
- [ ] Filters update results correctly
- [ ] Pagination works smoothly
- [ ] Provider details page loads
- [ ] Responsive on mobile/tablet
- [ ] RTL layout for Arabic content

#### Admin Features
- [ ] Login with valid credentials
- [ ] Logout redirects to login
- [ ] Create new provider
- [ ] Update existing provider
- [ ] Delete provider with confirmation
- [ ] Upload Excel file
- [ ] View statistics

## 🚀 Deployment

### Build for Production

```bash
pnpm build
```

This creates an optimized production build in the `dist/` folder.

### Environment Variables

For production, update the API URL:

```bash
VITE_API_URL=https://api.yourdomain.com/api/v1
```

### Deployment Options

1. **Vercel** (Recommended)
   ```bash
   vercel --prod
   ```

2. **Netlify**
   ```bash
   netlify deploy --prod
   ```

3. **Static Hosting**
   - Upload `dist/` folder to any static host
   - Configure redirects for SPA routing

## 🔧 Development Tips

### Hot Module Replacement

Vite provides instant HMR. Changes appear immediately without full page reload.

### TypeScript

All components are fully typed. Use TypeScript for better DX:

```typescript
import type { ServiceProvider } from '@/lib/api';

function ProviderCard({ provider }: { provider: ServiceProvider }) {
  // TypeScript knows all provider properties
}
```

### Code Organization

- **Components**: Reusable UI components
- **Pages**: Route-level components
- **Hooks**: Custom React hooks
- **Lib**: Utilities and API client

## 📝 Common Tasks

### Add a New Page

1. Create page component in `src/pages/`
2. Add route in `App.tsx`
3. Link to it using `<Link href="/path">`

### Add a New API Endpoint

1. Add function to `lib/api.ts`
2. Create hook in `hooks/useProviders.ts`
3. Use hook in component

### Add a New Form

1. Use React Hook Form
2. Add validation with `register()`
3. Handle submit with `handleSubmit()`

## 🐛 Troubleshooting

### API Connection Issues

**Problem**: "Network Error" or "Failed to fetch"

**Solution**:
1. Check backend is running on `http://localhost:3000`
2. Verify CORS is enabled on backend
3. Check `VITE_API_URL` environment variable

### Authentication Issues

**Problem**: "Unauthorized" or constant redirects

**Solution**:
1. Check token in localStorage
2. Verify token hasn't expired
3. Try logging out and logging in again

### Build Errors

**Problem**: TypeScript errors during build

**Solution**:
1. Run `pnpm install` to ensure all deps are installed
2. Check for missing imports
3. Verify all types are correct

## 📚 Resources

- **React Query**: https://tanstack.com/query/latest
- **shadcn/ui**: https://ui.shadcn.com/
- **Tailwind CSS**: https://tailwindcss.com/
- **Wouter**: https://github.com/molefrog/wouter
- **React Hook Form**: https://react-hook-form.com/

## 🤝 Contributing

### Code Style

- Use TypeScript for all new code
- Follow existing component patterns
- Use shadcn/ui components when possible
- Keep components small and focused

### Git Workflow

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Commit with clear message
5. Push and create PR

## 📄 License

This project is part of the Service Provider Search system.

---

**Built with ❤️ using React, TypeScript, and shadcn/ui**


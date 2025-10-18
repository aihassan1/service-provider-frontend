# Service Provider Search - Frontend

> Modern React application for searching and managing healthcare service providers across Egypt

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 🌟 Features

### Public Features
- **🔍 Advanced Search**: Fuzzy search across provider names, specializations, services, addresses, and cities
- **🎯 Smart Filtering**: Filter by province (29), city (326), specialization (99), and provider type (12)
- **📄 Pagination**: Browse through 4,346+ providers with smooth pagination
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **🌐 Arabic Support**: Full RTL support for Arabic content
- **⚡ Fast Performance**: Optimized with React Query caching and lazy loading

### Admin Features
- **🔐 Secure Authentication**: JWT-based login with role-based access control
- **📊 Dashboard**: Overview with statistics and recent providers
- **✏️ CRUD Operations**: Create, read, update, and delete providers
- **📤 Excel Import**: Bulk upload providers from Excel files
- **📈 Statistics**: Visual analytics of providers by province and specialization

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or 22+
- pnpm (recommended) or npm
- Backend API running (see [backend repo](https://github.com/aihassan1/service-provider-search-api))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/service-provider-frontend.git
cd service-provider-frontend

# Install dependencies
pnpm install

# Configure environment (see Configuration section)

# Start development server
pnpm dev

# Open in browser
# http://localhost:3001
```

## ⚙️ Configuration

### Environment Variables

The application requires the backend API URL to be configured:

**For Development:**
```bash
VITE_API_URL=http://localhost:3000/api/v1
```

**For Production:**
```bash
VITE_API_URL=https://your-api-domain.com/api/v1
```

> **Note**: Environment variables are managed through the platform settings. Contact your administrator to update them.

## 🏗️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Framework | 19 |
| **TypeScript** | Type Safety | 5 |
| **Vite** | Build Tool | 7 |
| **TanStack Query** | Data Fetching & Caching | 5 |
| **Wouter** | Routing | Latest |
| **React Hook Form** | Form Management | 7 |
| **Axios** | HTTP Client | Latest |
| **Tailwind CSS** | Styling | 4 |
| **shadcn/ui** | UI Components | Latest |
| **date-fns** | Date Utilities | 4 |

## 📁 Project Structure

```
service-provider-frontend/
├── client/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/       # Admin panel components
│   │   │   │   ├── ProvidersListTab.tsx
│   │   │   │   ├── CreateProviderTab.tsx
│   │   │   │   ├── EditProviderDialog.tsx
│   │   │   │   ├── UploadTab.tsx
│   │   │   │   └── StatisticsTab.tsx
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── hooks/
│   │   │   ├── useAuth.ts   # Authentication hook
│   │   │   └── useProviders.ts # Provider data hooks
│   │   ├── lib/
│   │   │   └── api.ts       # API client and types
│   │   ├── pages/
│   │   │   ├── Home.tsx     # Public search page
│   │   │   ├── ProviderDetail.tsx
│   │   │   ├── Login.tsx    # Admin login
│   │   │   └── AdminDashboard.tsx
│   │   ├── App.tsx          # Routes and providers
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Global styles
│   └── package.json
├── README.md                # This file
├── DEVELOPER_GUIDE.md       # Technical documentation
└── package.json
```

## 🔐 Authentication

### Default Admin Credentials

```
Email: admin@example.com
Password: secret
```

> **Important**: Change these credentials in production!

### Authentication Flow

1. User navigates to `/login`
2. Submits email and password
3. Backend validates and returns JWT token
4. Token stored in `localStorage`
5. Token automatically added to all admin API requests
6. On 401 error, user redirected to login

## 🎨 UI Components

### shadcn/ui Components

The application uses [shadcn/ui](https://ui.shadcn.com/) for consistent, accessible UI components:

- **Layout**: Card, Tabs, Dialog, Alert
- **Forms**: Input, Label, Textarea, Select, Button
- **Data Display**: Table, Badge, Skeleton
- **Feedback**: Toast (Sonner), Alert

### Adding New Components

```bash
# Add a new shadcn/ui component
pnpm dlx shadcn@latest add [component-name]
```

## 📡 API Integration

### API Client

The API client is configured in `client/src/lib/api.ts`:

```typescript
// Automatically uses VITE_API_URL from environment
export const API_BASE_URL = import.meta.env.VITE_API_URL;
```

### Available Endpoints

**Public (No Authentication):**
- `GET /providers/search` - Search providers
- `GET /providers/:id` - Get provider by ID
- `GET /providers/filters` - Get filter options
- `GET /providers/statistics` - Get statistics

**Admin (Authentication Required):**
- `POST /admin/providers` - Create provider
- `PUT /admin/providers/:id` - Update provider
- `DELETE /admin/providers/:id` - Delete provider
- `POST /admin/providers/upload` - Upload Excel file
- `DELETE /admin/providers/clear` - Clear all providers

## 🧪 Development

### Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Type check
pnpm type-check

# Lint code
pnpm lint
```

### Hot Module Replacement

Vite provides instant HMR. Changes appear immediately without full page reload.

## 🚢 Deployment

### Build for Production

```bash
pnpm build
```

This creates an optimized production build in the `dist/` folder.

### Deployment Options

#### **Option 1: Netlify**

1. Push code to GitHub
2. Connect repository to Netlify
3. Configure build settings:
   - Build command: `cd client && pnpm install && pnpm build`
   - Publish directory: `client/dist`
4. Add environment variable: `VITE_API_URL`
5. Deploy

#### **Option 2: Render.com**

1. Push code to GitHub
2. Create new Static Site on Render
3. Configure:
   - Build command: `cd client && pnpm install && pnpm build`
   - Publish directory: `client/dist`
4. Add environment variable: `VITE_API_URL`
5. Deploy

#### **Option 3: Cloudflare Pages**

1. Push code to GitHub
2. Connect repository to Cloudflare Pages
3. Configure:
   - Build command: `cd client && pnpm install && pnpm build`
   - Build output directory: `client/dist`
4. Add environment variable: `VITE_API_URL`
5. Deploy

### Environment Variables for Production

```bash
VITE_API_URL=https://your-api-domain.com/api/v1
```

## 📊 Features Overview

### Search Functionality

```typescript
// Search with multiple filters
const { data } = useProviderSearch({
  q: "جراحة",              // Search query
  province: "القاهرة",      // Filter by province
  city: "مدينة نصر",        // Filter by city
  specialization: "أطفال",  // Filter by specialization
  page: 1,                  // Page number
  limit: 20                 // Results per page
});
```

### Admin Operations

```typescript
// Create provider
const createMutation = useCreateProvider();
createMutation.mutate(providerData);

// Update provider
const updateMutation = useUpdateProvider();
updateMutation.mutate({ id, data: updates });

// Delete provider
const deleteMutation = useDeleteProvider();
deleteMutation.mutate(providerId);

// Upload Excel
const uploadMutation = useUploadExcel();
uploadMutation.mutate(file);
```

## 🔧 Troubleshooting

### Common Issues

**Issue**: "Network Error" or "Failed to fetch"

**Solution**:
1. Verify backend is running
2. Check `VITE_API_URL` is correct
3. Ensure CORS is enabled on backend
4. Check browser console for detailed errors

**Issue**: "Unauthorized" errors

**Solution**:
1. Check if logged in
2. Verify token hasn't expired
3. Try logging out and logging in again
4. Clear localStorage and retry

**Issue**: Build errors

**Solution**:
1. Delete `node_modules` and reinstall: `rm -rf node_modules && pnpm install`
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Check for TypeScript errors: `pnpm type-check`

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit with clear messages: `git commit -m 'Add amazing feature'`
5. Push to your fork: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow existing component patterns
- Use shadcn/ui components when possible
- Keep components small and focused
- Write meaningful commit messages

## 📚 Documentation

- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Comprehensive technical documentation for developers and AI agents
- **[Backend Repository](https://github.com/aihassan1/service-provider-search-api)** - Backend API documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Data fetching with [TanStack Query](https://tanstack.com/query)

## 📞 Support

For issues, questions, or contributions:
- Open an issue on [GitHub](https://github.com/yourusername/service-provider-frontend/issues)
- Check the [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for detailed documentation

---

**Built with ❤️ for healthcare providers in Egypt**


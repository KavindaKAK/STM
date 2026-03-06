# Vite Frontend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
```bash
# Copy the example env file
cp .env.example .env.local
```

Edit `.env.local` if needed (defaults should work for local development):
```env
VITE_API_URL=http://localhost:5000
```

### 3. Start Development Server
```bash
npm run dev
```

The frontend will be available at: **http://localhost:5173**

⚠️ **Note**: Vite uses port 5173 by default (not 3000 like Next.js). You can change it in `vite.config.ts` if needed.

### 4. Build for Production
```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### 5. Preview Production Build Locally
```bash
npm run preview
```

---

## Key Differences from Next.js

| Feature | Next.js | Vite |
|---------|---------|------|
| **Default Port** | 3000 | 5173 |
| **Build Output** | `.next/` | `dist/` |
| **Entry Point** | `app/` folder | `src/main.tsx` |
| **Routing** | App Router (file-based) | React Router (manual) |
| **Env Variables** | `NEXT_PUBLIC_*` | `VITE_*` |
| **HTML Entry** | Auto-generated | `index.html` |

---

## Project Structure

```
frontend/
├── src/
│   ├── main.tsx              # Entry point
│   ├── App.tsx               # Root component with routes
│   ├── globals.css           # Global styles
│   ├── vite-env.d.ts         # Vite type definitions
│   ├── components/           # React components
│   │   ├── layout/           # Header, Footer, etc.
│   │   ├── home/             # Home page components
│   │   ├── products/         # Product components
│   │   ├── ui/               # Button, Input, etc.
│   │   └── providers/        # Context providers
│   ├── contexts/             # React contexts
│   │   ├── AuthContext.tsx   # Authentication
│   │   └── CartContext.tsx   # Shopping cart
│   ├── pages/                # Page components
│   │   ├── HomePage.tsx
│   │   ├── auth/
│   │   ├── products/
│   │   ├── dashboard/
│   │   └── admin/
│   ├── lib/                  # Utilities
│   │   ├── api-client.ts     # API calls
│   │   └── utils.ts          # Helper functions
│   └── types/                # TypeScript types
├── index.html                # HTML entry point
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind CSS config
├── postcss.config.js         # PostCSS config
├── tsconfig.json             # TypeScript config
└── package.json              # Dependencies
```

---

## Important Configuration Files

### `vite.config.ts`
Configures:
- React plugin
- Path alias (`@/` → `./src/`)
- Dev server (port 5173)
- API proxy for `/api` requests
- Build options

### `tsconfig.json`
- Target: ES2020
- Module: ESNext
- Strict mode enabled
- Path aliases configured

### `tailwind.config.js`
- Content paths updated for `src/` folder
- Same styling as Next.js version

### `.env.example`
Template for environment variables. Copy to `.env.local` and customize.

---

## Environment Variables

All environment variables must start with `VITE_` prefix.

**Available Variables:**
- `VITE_API_URL` - Backend API endpoint (default: `http://localhost:5000`)

**Access in Code:**
```tsx
const apiUrl = import.meta.env.VITE_API_URL;
```

⚠️ **Important**: Restart the dev server after changing `.env.local` files.

---

## API Integration

The frontend makes API calls to the backend via the `/api` prefix.

Example API calls:
- `GET /api/products` - Get products
- `POST /api/cart/add` - Add to cart
- `POST /api/auth/login` - User login

The Vite dev server automatically proxies `/api` requests to the backend URL specified in `VITE_API_URL`.

---

## TypeScript

TypeScript is configured with strict mode:
- All variables must have explicit types or inferred types
- Unused variables/imports are errors
- Interface checking is enforced

To check for TypeScript errors:
```bash
npm run build  # This runs TypeScript type checking
```

---

## Debugging

### 1. Dev Tools Console
Press `F12` in the browser to open developer tools.

### 2. React DevTools
Install the [React DevTools Extension](https://react-devtools-tutorial.vercel.app/) for better component inspection.

### 3. Network Tab
Check the Network tab in dev tools to see API requests and responses.

### 4. Source Maps
Vite generates source maps for debugging. Use the Sources tab to set breakpoints.

---

## Build & Deployment

### Local Build
```bash
npm run build
```

Test the build locally:
```bash
npm run preview
```

### Production Deployment

The `dist/` folder contains all static files ready for deployment.

#### For Static Hosting (Vercel, Netlify, etc.):
1. Run `npm run build`
2. Upload the `dist/` folder
3. Set the root directory to `dist/`
4. Ensure API proxy is configured or backend CORS is enabled

#### For Docker:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Troubleshooting

### Blank Page on Load
- Check browser console (F12) for errors
- Verify backend is running at configured URL
- Check Network tab to see if API calls are being made
- Ensure `VITE_API_URL` is correctly set in `.env.local`

### Module Not Found Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Restart dev server: `npm run dev`
- Check path aliases in `tsconfig.json`

### CORS Errors
- Backend needs CORS headers, OR
- Use the dev server proxy (already configured for `/api`)

### Styling Not Applied
- Check if `index.html` includes `<div id="root"></div>`
- Verify Tailwind paths in `tailwind.config.js`
- Clear browser cache (Ctrl+Shift+Del)

### Hot Module Replacement (HMR) Not Working
- Check Dev Server is running: `npm run dev`
- Refresh browser manually
- Restart dev server if needed

---

## Performance Tips

1. **Dev Build**: Use `npm run dev` for development (includes all debugging tools)
2. **Prod Build**: Use `npm run build` for production (optimized and minified)
3. **Images**: Consider using webp format or `<picture>` tags for better performance
4. **Bundle Size**: Use React DevTools Profiler to identify bottlenecks
5. **API Calls**: Use React Query's caching and deduplication

---

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Create `.env.local` file
3. ✅ Start dev server: `npm run dev`
4. ✅ Verify backend is running at `http://localhost:5000`
5. ✅ Test core functionality (login, browse products, cart, etc.)
6. ✅ Build production: `npm run build`
7. ✅ Deploy to production

---

## Additional Resources

- [Vite Documentation](https://vitejs.dev)
- [React Router v6](https://reactrouter.com)
- [React Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## Support

For issues:
1. Check the browser console (F12)
2. Review the troubleshooting section above
3. Check API responses in Network tab
4. Verify `.env.local` is correctly configured
5. Ensure backend is running and accessible


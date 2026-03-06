# ✅ Migration Checklist & Getting Started

> Follow these steps to get your Vite frontend running

---

## 🎯 PRE-FLIGHT CHECK (5 minutes)

- [ ] Read `QUICK_START.md` for overview
- [ ] Ensure Node.js 16+ is installed: `node --version`
- [ ] Ensure npm is installed: `npm --version`
- [ ] Ensure backend repository is available (we migrated frontend only)
- [ ] Backend API should be running at port 5000 (or update `.env.local`)

---

## 🚀 INSTALLATION (2 minutes)

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```
✅ **Verify:** No error messages, `node_modules/` folder created

### Step 2: Create Environment File
```bash
cp .env.example .env.local
```
✅ **Verify:** `.env.local` file exists

### Step 3: Check Environment (Optional)
Edit `.env.local` if needed (defaults usually work):
```env
VITE_API_URL=http://localhost:5000
```
✅ **Verify:** File has correct API URL

---

## 🏃 RUN APPLICATION (2 minutes)

### Step 4: Start Development Server
```bash
npm run dev
```
✅ **Verify:** 
- Terminal shows: "Local: http://localhost:5173"
- No error messages
- Server is running

### Step 5: Open in Browser
Visit: **http://localhost:5173**

✅ **Verify:**
- Page starts loading
- No blank white page
- Splash screen appears (if configured)
- No console errors (F12 to check)

---

## ✅ FUNCTIONALITY TEST (5 minutes)

### Test 1: Navigation
- [ ] Click on menu items
- [ ] All pages load without errors
- [ ] URL changes correctly
- [ ] Browser back button works

### Test 2: Homepage
- [ ] Hero section displays
- [ ] Product cards visible
- [ ] Brand logos visible
- [ ] Reviews section visible

### Test 3: Product Pages
- [ ] Can browse tyres, batteries, accessories
- [ ] Can search/filter products
- [ ] Product details page loads with `/products/:id`
- [ ] Images load correctly

### Test 4: Shopping Cart
- [ ] Can add items to cart (requires login)
- [ ] Cart count updates in header
- [ ] Can view cart page
- [ ] Cart displays items correctly

### Test 5: Authentication
- [ ] Login page loads at `/login`
- [ ] Register page loads at `/register`
- [ ] Can submit form (backend API required)
- [ ] Success/error messages appear

### Test 6: Admin Dashboard (if admin user)
- [ ] Admin pages load at `/admin`
- [ ] Can view products, orders, etc.
- [ ] Admin features work

### Test 7: Network Requests
- [ ] Open DevTools (F12)
- [ ] Click "Network" tab
- [ ] Navigate pages
- [ ] Check that API calls are made to `/api/*`
- [ ] Responses show status 200 (success)

### Test 8: Browser Compatibility
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test on mobile (responsive design)

---

## 🏗️ BUILD & DEPLOY (5 minutes)

### Step 6: Build for Production
```bash
npm run build
```
✅ **Verify:**
- Command completes without errors
- No TypeScript errors
- `dist/` folder is created
- `dist/` contains `index.html` and other assets

### Step 7: Preview Production Build
```bash
npm run preview
```
✅ **Verify:**
- Terminal shows: "Local: http://localhost:4173" (or similar)
- Application loads and functions in preview
- All features work

### Step 8: Verify Build Size
```bash
# Check build output size
ls -lh dist/
```
✅ **Typical sizes:**
- `index.html`: ~2-5 KB
- JS files: ~200-400 KB
- CSS files: ~50-100 KB
- Total: ~300-500 KB (after gzip: ~100-150 KB)

---

## 🚀 DEPLOYMENT

### For Vercel
1. Push code to GitHub
2. Visit vercel.com and import project
3. Select `frontend` as root directory
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Add env var: `VITE_API_URL=https://your-api.com`
7. Deploy

### For Netlify  
1. Push code to GitHub
2. Visit netlify.com and import project
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Set build directory env var:
   - Key: `VITE_API_URL`
   - Value: `https://your-api.com`
6. Deploy

### For Self-Hosted
1. Run `npm run build`
2. Upload `dist/` folder contents to web server
3. Configure server to serve `index.html` for all routes
4. Set environment variables in `.env` file
5. Restart web server

---

## 🐛 TROUBLESHOOTING

### Problem: Blank white page
**Check:**
- [ ] Browser console (F12) for errors
- [ ] Network tab - is the page loading?
- [ ] Backend API is running at correct URL
- [ ] Check `.env.local` has correct `VITE_API_URL`

**Fix:**
```bash
# Restart dev server
npm run dev
```

### Problem: "Cannot find module" errors
**Check:**
- [ ] All dependencies installed: `npm install`
- [ ] `src/` folder exists and has files

**Fix:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Problem: Port 5173 already in use
**Fix:** Change port in `vite.config.ts`:
```typescript
server: {
  port: 3000,  // Change to available port
}
```

### Problem: Styles not loading (no Tailwind)
**Check:**
- [ ] Browser cache cleared (Ctrl+Shift+Del)
- [ ] Dev server restarted

**Fix:**
```bash
npm run dev
# Then wait 5 seconds for styles to compile
```

### Problem: API calls failing (404, CORS)
**Check:**
- [ ] Backend is running at `http://localhost:5000`
- [ ] API endpoints are correct
- [ ] Backend CORS headers are set

**Fix:**
- Update `.env.local`:
  ```env
  VITE_API_URL=http://localhost:5000
  ```
- Restart dev server: `npm run dev`

### Problem: TypeScript errors after build
**Fix:**
```bash
npm run build  # Shows full errors
# Fix reported issues, then try again
```

### Problem: Dev server won't start
**Fix:**
```bash
# Clean reinstall
rm -rf node_modules
npm install
npm run dev
```

---

## 📊 Expected Behavior

### Development Server
- ✅ Starts in < 1 second
- ✅ HMR updates in < 500ms
- ✅ No TypeScript errors
- ✅ Console shows no error logs
- ✅ All pages load instantly

### Production Build
- ✅ `npm run build` completes in < 30 seconds
- ✅ No compilation errors
- ✅ Output in `dist/` folder
- ✅ Build size reasonable (~300-500 KB before gzip)

### Browser
- ✅ No console errors
- ✅ No missing fonts
- ✅ No broken images
- ✅ Responsive on all sizes
- ✅ Smooth animations/transitions

---

## 📋 Post-Deployment Verification

After deploying to production:
- [ ] Visit your deployed URL
- [ ] App loads completely
- [ ] All pages accessible
- [ ] API calls work (check DevTools Network)
- [ ] No 404 errors
- [ ] Styling looks correct
- [ ] Mobile responsive
- [ ] Login/Auth works
- [ ] Shopping functionality works

---

## 🆘 Common Questions

### Q: Why is the port 5173 instead of 3000?
**A:** Vite uses 5173 by default. You can change it in `vite.config.ts`.

### Q: Where's the `.next` folder?
**A:** Vite uses `dist/` instead. Delete `.next/` if it exists.

### Q: Can I use the old `next/link` syntax?
**A:** No. You must use `react-router-dom` imports: `import { Link } from 'react-router-dom'`

### Q: Is the backend changed?
**A:** No. Only the frontend was migrated. Backend is unchanged.

### Q: Do I need to change API endpoints?
**A:** No. All API endpoints remain the same at `/api/*`

### Q: How do I deploy to production?
**A:** Run `npm run build`, upload `dist/` to your hosting.

### Q: Can I go back to Next.js?
**A:** Yes. The backend and database are separate. But not recommended - Vite is faster.

---

## 🎓 Learning Resources

- [Vite Documentation](https://vitejs.dev)
- [React Router v6 Docs](https://reactrouter.com)
- [React Query Docs](https://tanstack.com/query/latest)
- [Tailwind CSS Docs](https://tailwindcss.com)

---

## ✨ You're Ready!

Your migration is complete. Follow the steps above to get started.

**Expected time:** 10 minutes to full functionality

**Have fun coding!** 🚀

---

## 📝 Notes for Your Team

Share this checklist with your team:
1. **Developers:** Use `npm run dev` for development
2. **QA:** Use QUICK_START.md and this checklist
3. **DevOps:** Use deployment instructions above
4. **All:** If issues arise, check troubleshooting section

---

**Questions?** Check the documentation files:
- QUICK_START.md
- VITE_SETUP_GUIDE.md  
- MIGRATION_SUMMARY.md
- FINAL_SUMMARY.md


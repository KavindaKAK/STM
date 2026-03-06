# Add to Cart Debugging Guide

## Step 1: Verify Backend is Running
1. Open a terminal and navigate to the backend folder
2. Run: `npm run dev`
3. Look for output like: "Server running on port 5000"

## Step 2: Verify Environment Variables

### Frontend (.env.local)
Make sure `c:\Users\User\Desktop\STM\frontend\.env.local` contains:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend (.env.local)
Make sure `c:\Users\User\Desktop\STM\backend\.env.local` contains:
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
MONGODB_URI=mongodb://localhost:27017/stm
PORT=5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 3: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to add a product to cart
4. Look for the API request to `/api/cart/add`
5. Check the response status and error message

## Step 4: Common Issues

### Issue: 401 Unauthorized
- You're not logged in or the token is not being sent
- Make sure you're logged in before adding items to cart
- Check if localStorage has the token: Open DevTools > Application > localStorage

### Issue: 404 Not Found
- The API endpoint might not be found
- Make sure NEXT_PUBLIC_API_URL is correct
- Verify backend PORT matches the URL

### Issue: CORS Error
- The frontend and backend ports might not match
- Update NEXT_PUBLIC_API_URL to match your backend URL

## Step 5: Manual Testing

1. Login to the application
2. In DevTools > Application > Storage > Cookies, verify token is saved
3. Go to a product page
4. Open DevTools > Console
5. Click "Add to Cart"
6. Check the Network tab for the API request details

## For Troubleshooting
If you see any error messages in the console or network tab, share them and I can help fix the specific issue.

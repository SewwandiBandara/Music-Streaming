# Browser Cache Clearing Instructions

## The Issue
Your browser is running **OLD compiled JavaScript code** that still tries to fetch `/api/admin/playlists`. The current source code does NOT call this endpoint anymore.

## Solution: Clear Browser Cache Completely

### Option 1: Hard Refresh (Quick - Try This First)

#### Chrome/Edge/Brave (Windows/Linux):
1. Open the admin dashboard page (http://localhost:5173/admin/dashboard)
2. Press: `Ctrl + Shift + Delete`
3. Select "Cached images and files"
4. Click "Clear data"
5. Then press `Ctrl + Shift + R` to hard reload

#### Chrome/Edge/Brave (Mac):
1. Open the admin dashboard page
2. Press: `Cmd + Shift + Delete`
3. Select "Cached images and files"
4. Click "Clear data"
5. Then press `Cmd + Shift + R` to hard reload

#### Firefox (Windows/Linux):
1. Press: `Ctrl + Shift + Delete`
2. Select "Cache"
3. Click "Clear Now"
4. Then press `Ctrl + F5` to hard reload

#### Firefox (Mac):
1. Press: `Cmd + Shift + Delete`
2. Select "Cache"
3. Click "Clear Now"
4. Then press `Cmd + Shift + R` to hard reload

---

### Option 2: DevTools Method (More Thorough)

#### Chrome/Edge/Brave/Firefox:
1. Open the page: http://localhost:5173/admin/dashboard
2. Open DevTools:
   - Windows/Linux: Press `F12` or `Ctrl + Shift + I`
   - Mac: Press `Cmd + Option + I`
3. **Right-click** on the browser's refresh button (next to address bar)
4. Select **"Empty Cache and Hard Reload"** or **"Clear Cache and Hard Reload"**
5. Wait for the page to fully reload

---

### Option 3: Incognito/Private Window (Guaranteed Fresh)

#### Any Browser:
1. Open a new Incognito/Private window:
   - Chrome/Edge: `Ctrl + Shift + N` (Windows/Linux) or `Cmd + Shift + N` (Mac)
   - Firefox: `Ctrl + Shift + P` (Windows/Linux) or `Cmd + Shift + P` (Mac)
2. Navigate to: http://localhost:5173/admin/login
3. Login with: Admin@gmail.com / admin123
4. The error should be gone!

---

### Option 4: Clear All Browsing Data (Nuclear Option)

#### Chrome/Edge/Brave:
1. Press `Ctrl + Shift + Delete` (Windows/Linux) or `Cmd + Shift + Delete` (Mac)
2. Select **"All time"** from the time range dropdown
3. Check these boxes:
   - ✓ Cached images and files
   - ✓ Cookies and other site data (optional, will log you out)
4. Click "Clear data"
5. Restart the browser
6. Visit: http://localhost:5173/admin/login

#### Firefox:
1. Press `Ctrl + Shift + Delete` (Windows/Linux) or `Cmd + Shift + Delete` (Mac)
2. Select **"Everything"** from the time range
3. Check:
   - ✓ Cache
   - ✓ Cookies (optional)
4. Click "Clear Now"
5. Restart the browser
6. Visit: http://localhost:5173/admin/login

---

## What I've Fixed

1. ✅ Updated `vite.config.js` with aggressive no-cache headers
2. ✅ Added cache-control meta tags to `index.html`
3. ✅ Cleared all Vite build caches on the server
4. ✅ Restarted the development server with fresh state

## Verification

After clearing cache, open the browser console (F12) and check:
- The error `/api/admin/playlists?limit=10 404` should be **GONE**
- You should only see 4 API calls:
  - ✓ /api/admin/stats
  - ✓ /api/admin/users?limit=10
  - ✓ /api/admin/songs?limit=10
  - ✓ /api/admin/artists?limit=10

## Why This Happened

Browsers aggressively cache JavaScript files for performance. Even when you rebuild the application, the browser may continue using the old cached version until you explicitly clear the cache.

---

**Note**: The frontend dev server is now running at http://localhost:5173 with fresh cache and anti-caching headers enabled.

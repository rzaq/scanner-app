# 🔧 Build Troubleshooting Guide

## Quick Problem Solver

### The Workflow Files
- **`build.yml`** - Main APK build (recommended for regular builds)
- **`build-web-only.yml`** - Web app only (for testing web without Android)
- **`diagnose.yml`** - Deep environment check (run if build fails)

---

## How to Trigger Builds

### Automatic Builds
Every `git push` to `main` automatically triggers `build.yml`

### Manual Diagnostics
1. Go to GitHub → Actions tab
2. Select "Diagnose Build Issues"
3. Click "Run workflow"
4. Check logs

### Web-Only Build
1. Edit `.github/workflows/build-web-only.yml`
2. Update to have:
   ```yaml
   on:
     workflow_dispatch:  # Allows manual trigger
   ```
3. Go to GitHub Actions and select it
4. Click "Run workflow"

---

## Common Build Failures & Solutions

### ❌ "Unable to find Android SDK"
**Cause**: `compileSdkVersion` set too high
**Fix Already Applied**: Changed from 36 → 34 ✅
**If Still Fails**: 
- Run diagnostic workflow
- Check if Android SDK 34 is available in logs
- If not, try SDK 33 or 32

### ❌ "pnpm: command not found"
**Cause**: pnpm not in PATH
**Fix Already Applied**: Setup order corrected ✅
**Manual Fix** (if needed):
```yaml
- uses: pnpm/action-setup@v2
  with:
    version: 10.4.1

- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'pnpm'
```

### ❌ "gradlew: permission denied"
**Cause**: Execute permission missing
**Fix Already Applied**: `chmod +x gradlew` ✅

### ❌ "dist/public/index.html not found"
**Cause**: Web build didn't run or failed
**Fix Already Applied**: Added verification ✅
**Debug**: Check `pnpm build` output for errors
```bash
pnpm install --frozen-lockfile
pnpm build
ls -la dist/public/
```

### ❌ "Process completed with exit code 1"
**Cause**: Gradle build failed (generic error)
**New Improvement**: Added `--stacktrace` to see actual error ✅
**Manual Test**:
```bash
cd android
./gradlew assembleDebug --stacktrace
```

---

## Files You Might Need to Edit

### For SDK Version Issues
**File**: `android/variables.gradle`
```groovy
compileSdkVersion = 34  # Change if you need different SDK
targetSdkVersion = 34
```

### For Build Behavior
**File**: `.github/workflows/build.yml`
```yaml
- name: Build Debug APK
  working-directory: ./android
  run: ./gradlew assembleDebug --stacktrace -q
```

### For Web App
**File**: `vite.config.ts`
```typescript
build: {
  outDir: path.resolve(import.meta.dirname, "dist/public"),
},
```

---

## Verification Checklist

After making changes:

- [ ] Code builds locally: `pnpm build`
- [ ] Git status clean: `git status`
- [ ] Committed changes: `git add . && git commit -m "..."`
- [ ] Pushed to GitHub: `git push origin main`
- [ ] Check Actions tab for workflow status

---

## How to Read Build Logs

### GitHub Actions Logs
1. Go to repository → Actions tab
2. Click on workflow run
3. Expand "Build Debug APK" step
4. Scroll through logs looking for:
   - ❌ "FAILED"
   - ❌ "error"
   - ⚠️ "ERROR"

### Key Log Sections
```
✅ "BUILD SUCCESSFUL" → APK was created
❌ "BUILD FAILED" → Check section before this for actual error
⚠️ "WARNING" → May be ok, but worth checking
```

### Getting More Details
Add these to gradle command for more info:
- `--stacktrace` - Shows where crash happened (already added)
- `--debug` - Very detailed output
- `--info` - Moderate verbosity

---

## Testing APK Locally

If APK builds in GitHub Actions, you can download it:

1. Go to GitHub Actions → build workflow run
2. Scroll to "Artifacts" section
3. Download `app-debug-apk`
4. Install on Android device:
   ```bash
   adb install app-debug.apk
   ```

---

## Emergency Fallback

If all else fails:

### Option 1: Build Web Only
- Use `build-web-only.yml` to at least get web app built
- Can serve the web app with Node server
- Run: `node dist/index.js`

### Option 2: Downgrade SDK Further
Edit `android/variables.gradle`:
```groovy
compileSdkVersion = 33  # or 32
targetSdkVersion = 33
```

### Option 3: Check with Diagnostic
Run `diagnose.yml` workflow to see exactly what's available in GitHub Actions environment

---

## Key Success Indicators

✅ Workflow completes without cancellation
✅ No "ERROR" messages in logs
✅ APK artifact present in Actions tab
✅ APK file size > 5MB (proves web assets included)

---

## Quick Reference Commands

```bash
# Check web build locally
pnpm install
pnpm build
ls dist/public/

# Check android build locally (requires local setup)
cd android
./gradlew assembleDebug --stacktrace

# Check git status
git status
git log --oneline -5

# Push changes
git push origin main
```

---

## Support Resources

- **BUILD_ANALYSIS.md** - Detailed technical analysis
- **ISSUES_AND_FIXES.md** - Complete issue documentation
- **GITHUB_ACTIONS_README.md** - GitHub Actions specific setup
- **QUICK_START.md** - Quick setup guide

---

## Last Updated
After SDK version fix (commit: 3e3fe75)
- compileSdkVersion: 34 ✅
- targetSdkVersion: 34 ✅
- Diagnostic workflow: Available ✅

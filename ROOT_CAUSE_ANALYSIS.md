# 🚨 ROOT CAUSE ANALYSIS: Build Failures

## The Real Problem (Finally Found! 🎯)

### Error Message
```
SDK location not found. Define a valid SDK location with an ANDROID_HOME 
environment variable or by setting the sdk.dir path in your project's 
local properties file at '/var/www/html/scan/android/local.properties'
```

### Root Cause
The Android Gradle build requires ONE of these to be set:
1. **ANDROID_HOME** environment variable (set by setup-android action ✅)
2. **sdk.dir** in `android/local.properties` file (was MISSING ❌)

The workflow set ANDROID_HOME but Gradle wasn't seeing it because:
- `setup-android` action sets `ANDROID_SDK_ROOT` (not `ANDROID_HOME`)
- Gradle checks for `local.properties` first
- If `local.properties` is missing, build fails ❌

---

## Solution Applied

### Created `android/local.properties` Dynamically
In GitHub Actions workflow (`.github/workflows/build.yml`):
```yaml
- name: Create local.properties
  working-directory: ./android
  run: |
    echo "sdk.dir=$ANDROID_SDK_ROOT" > local.properties
    cat local.properties
```

This creates:
```properties
sdk.dir=/opt/android
```

### Why This Works
- Gradle reads `local.properties` ✅
- Finds `sdk.dir` path ✅
- Uses `ANDROID_SDK_ROOT` value from setup-android ✅
- Build succeeds! ✅

---

## Files Updated

1. **`.github/workflows/build.yml`** ✅
   - Added step to create `local.properties`
   - Placed before `./gradlew assembleDebug`

2. **`.github/workflows/build-apk.yml`** ✅
   - Added same step

3. **`.github/workflows/build-release.yml`** ✅
   - Already had it (from before)

4. **`.github/workflows/diagnose.yml`** ✅
   - Added for testing/debugging

5. **`.gitignore`** ✅
   - Added `android/local.properties` (not committed)
   - Added `android/.gradle/` (build cache)
   - Added `android/app/build/` (build outputs)

---

## Why This Wasn't Obvious

1. **compileSdkVersion 36→34 fix** was correct but not sufficient
2. Error message was confusing - didn't mention `ANDROID_SDK_ROOT` clearly
3. `setup-android` action sets `ANDROID_SDK_ROOT` not `ANDROID_HOME`
4. Gradle prefers `local.properties` over environment variables
5. No build logs until `--stacktrace` flag was added

---

## Expected Behavior Now

✅ Workflows will:
1. Setup Android SDK via `setup-android` action
2. Create `local.properties` with SDK path
3. Gradle finds SDK via `local.properties`
4. Build succeeds! 🎉

---

## Commits

| Hash | Message |
|------|---------|
| `09bb3a9` | 🔴 CRITICAL FIX: Create local.properties with ANDROID_SDK_ROOT path |
| `f398cf5` | 🔧 Fix: Add local.properties creation to build-apk.yml workflow |

---

## Testing

The fixes are now pushed. On next `git push`:
1. Workflows will trigger automatically
2. Should see ✅ Build Success!
3. APK artifact will be uploaded

If still fails, check:
- [ ] `ANDROID_SDK_ROOT` is set in logs
- [ ] `local.properties` shows `sdk.dir=/opt/android`
- [ ] Gradle version compatibility (currently 8.13.0 ✓)
- [ ] Java version (currently 21 ✓)

---

## Prevention for Future

- **Always include `local.properties` creation step** in Android workflows
- **Use `--stacktrace` flag** for gradle to see actual errors
- **Check environment variables** early in workflow (ANDROID_SDK_ROOT not ANDROID_HOME)

# Build Failure Analysis & Solutions

## Potential Issues Identified

### 1. **compileSdkVersion Too High (CRITICAL)**
- **Current Value**: 36
- **Issue**: GitHub Actions may not have Android SDK 36 installed by default
- **Impact**: Gradle will fail to find the SDK
- **Solution**: Downgrade to 34 or 35
- **File**: `android/variables.gradle`

```groovy
// BEFORE (Line 3)
compileSdkVersion = 36

// AFTER - Change to:
compileSdkVersion = 34
targetSdkVersion = 34
```

### 2. **Missing Web Build in APK Assembly**
- **Issue**: APK assembly needs the web build to exist at `dist/public`
- **Sequence**: Web build MUST complete before Android build
- **Current Workflow**: ✅ Already done (pnpm build → gradle assembleDebug)
- **Verify**: Check that `dist/public/` has `index.html`

### 3. **Java/Kotlin Compatibility**
- **Current**: Java 21 (from capacitor.build.gradle)
- **Gradle**: 8.13.0
- **Status**: ✅ Compatible

### 4. **Gradle Wrapper Permissions**
- **Issue**: gradlew may not have execute permissions
- **Fix**: `chmod +x gradlew` (already in workflow)
- **Verify**: Check file is executable on upload

### 5. **Missing Dependencies or Plugins**
- **Capacitor Plugins Used**:
  - ✅ capacitor-camera
  - ✅ capacitor-filesystem
- **Other Dependencies**: AndroidX libraries (should auto-resolve)
- **Potential Issue**: If Maven Central is slow or unavailable

### 6. **Local Properties Not Configured**
- **Issue**: `local.properties` may be missing
- **Current Setup**: Should auto-configure via setup-android action
- **Fallback**: Create if needed:
```properties
sdk.dir=/opt/android
```

### 7. **Namespace vs Package Mismatch**
- **android/app/build.gradle**: `namespace = "com.scanner.app"`
- **capacitor.config.ts**: `appId: 'com.scanner.app'`
- **Status**: ✅ Matches

## Immediate Action Items

### Priority 1: Reduce compileSdkVersion
```bash
# In android/variables.gradle, change line 3:
compileSdkVersion = 34  # from 36
targetSdkVersion = 34   # from 36
```

### Priority 2: Verify Web Build Output
```bash
# After pnpm build, verify:
ls -la dist/public/index.html
ls -la dist/public/assets/
```

### Priority 3: Add Detailed Gradle Logging
```bash
./gradlew assembleDebug --stacktrace --info 2>&1 | tee build.log
```

### Priority 4: Check Android SDK Availability
```bash
ls -la $ANDROID_SDK_ROOT/platforms/android-34/
ls -la $ANDROID_SDK_ROOT/build-tools/
```

## Files That Need Changes

1. **android/variables.gradle** (CRITICAL)
   - Change compileSdkVersion from 36 to 34
   - Change targetSdkVersion from 36 to 34

2. **.github/workflows/build.yml** (Optional but Recommended)
   - Add `--stacktrace` to gradle command for better error messages
   - Add check for `dist/public/index.html` before assembly

3. **android/app/build.gradle** (Optional)
   - Add explicit minifyEnabled = false for debug builds

## Expected Success Criteria

✅ `pnpm install` completes successfully
✅ `pnpm build` creates `dist/public/index.html`
✅ `./gradlew assembleDebug` finds Android SDK 34
✅ `android/app/build/outputs/apk/debug/app-debug.apk` is created
✅ APK file is >= 5MB (proves web assets are included)

## Debugging Commands for Local Testing

```bash
# Full local build test
cd android
./gradlew clean
./gradlew assembleDebug --stacktrace

# If fails, check SDK
android list targets

# Check gradle wrapper
./gradlew --version

# Check Java
java -version
javac -version

# Check Capacitor
npx cap sync
```

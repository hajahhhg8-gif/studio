# Equation Note

This is a Next.js project created in Firebase Studio.

To get started, take a look at `src/app/page.tsx`.

---

## How to Convert this Web App to an Android APK

While this is a web application, you can convert it into an Android app (APK) that can be installed on devices. This process involves using a tool called **Capacitor**, which wraps your web app in a native Android container.

Here is a step-by-step guide to do this:

### Prerequisites

You need to have [Android Studio](https://developer.android.com/studio) installed and configured on your computer.

### Step-by-Step Instructions

1.  **Install Capacitor CLI:**
    Open your terminal in the project's root directory and run this command to install Capacitor's command-line tool and core libraries:
    ```bash
    npm install @capacitor/cli @capacitor/core @capacitor/android
    ```

2.  **Initialize Capacitor:**
    Next, run this command to create the Capacitor configuration file (`capacitor.config.ts`).
    ```bash
    npx cap init "Equation Note" "com.equationnote.app"
    ```
    This will ask you to confirm the web asset directory. The default for Next.js is `out`. You'll need to configure your `next.config.js` to export the project.

3.  **Configure Next.js for Static Export:**
    Modify your `next.config.ts` file to include the `output: 'export'` option. This is necessary for Capacitor to be able to package your web files.

    ```ts
    /** @type {import('next').NextConfig} */
    const nextConfig = {
      output: 'export', // Add this line
      /* ... other config ... */
    };
    export default nextConfig;
    ```
    *Note: I can make this change for you if you'd like.*

4.  **Build Your Web App:**
    Create a production build of your web application. This will generate the static files in the `out` directory.
    ```bash
    npm run build
    ```

5.  **Add the Android Platform:**
    Now, tell Capacitor to create the native Android project.
    ```bash
    npx cap add android
    ```

6.  **Open the Project in Android Studio:**
    This command will open your new native Android project in Android Studio.
    ```bash
    npx cap open android
    ```

7.  **Build the APK in Android Studio:**
    Once the project is open in Android Studio:
    *   Wait for it to sync and build everything.
    *   Go to the menu and select **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
    *   After the build is complete, Android Studio will show a notification with a link to locate the generated APK file (usually in `app/build/outputs/apk/debug/app-debug.apk`).

You can now take this APK file and install it on an Android device for testing.

# Migration to Google Gemini

This guide explains how to migrate the Behavior Intervention Tool from Anthropic (Claude) to Google (Gemini) to align with district-protected Google services.

## 1. Obtain a Gemini API Key

1.  Go to [Google AI Studio](https://aistudio.google.com/).
2.  Sign in with your district-authorized Google account.
3.  Click on **"Get API key"** in the left sidebar.
4.  Click **"Create API key"**.
5.  Copy the API key. **Warning: Keep this key secret.**

## 2. Update the Backend Code

I have provided an example file `api/chat-gemini.js.example`. To use it:

1.  Delete the existing `api/chat.js`.
2.  Rename `api/chat-gemini.js.example` to `api/chat.js`.
3.  Ensure your environment variables are updated. Instead of `ANTHROPIC_API_KEY`, you will now need `GEMINI_API_KEY`.

## 3. Host on Google Cloud (Optional but Recommended)

To keep everything within the Google ecosystem, you can host the project using **Firebase Hosting** and **Firebase Functions**.

### Using Firebase

1.  Install Firebase CLI: `npm install -g firebase-tools`
2.  Run `firebase login` and sign in with your district account.
3.  Run `firebase init` in the project root.
    *   Select **Hosting** and **Functions**.
    *   Select your project or create a new one.
4.  Move the logic from `api/chat.js` into the `functions/index.js` file.
5.  Set your API key in Firebase:
    `firebase functions:config:set gemini.key="YOUR_API_KEY"`
6.  Deploy: `firebase deploy`

## 4. Why Migrate to Google?

*   **District Integration:** Using Google services often falls under existing district data processing agreements.
*   **Security:** Google Cloud provides robust security and identity management (IAM).
*   **Cost:** Gemini has a generous free tier for developers on Google AI Studio.

---

*Note: The frontend code (app.js) remains compatible with the response format provided in the Gemini example file.*

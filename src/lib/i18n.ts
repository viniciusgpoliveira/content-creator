import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// English translations
const enTranslations = {
  common: {
    welcome: "Welcome to Content Creator Dashboard",
    login: "Login",
    logout: "Logout",
    email: "Email",
    password: "Password",
    signIn: "Sign In",
    signUp: "Sign Up",
    forgotPassword: "Forgot Password?",
    dashboard: "Dashboard",
    profile: "Profile",
    settings: "Settings",
    tools: "Tools",
    blogGenerator: "Blog Generator",
    captionGenerator: "Caption Generator",
    engagementMetrics: "Engagement Metrics",
    latestGenerations: "Latest Generations",
    readTime: "Read Time",
    clickThrough: "Click Through",
    shareCount: "Share Count",
    loading: "Loading...",
    error: "An error occurred",
    success: "Success!",
  },
  auth: {
    loginSuccess: "Logged in successfully",
    loginError: "Invalid email or password",
    logoutSuccess: "Logged out successfully",
    signUpSuccess: "Account created successfully",
    passwordResetSuccess: "Password reset email sent",
    sessionExpired: "Your session has expired. Please log in again.",
  },
  dashboard: {
    welcomeMessage: "Welcome back, {{name}}!",
    todayStats: "Today's Stats",
    weeklyStats: "Weekly Stats",
    monthlyStats: "Monthly Stats",
    viewAll: "View All",
  },
  blogGenerator: {
    title: "Blog Post Generator",
    description: "Generate engaging blog posts with AI",
    topic: "Topic",
    topicPlaceholder: "Enter a topic for your blog post",
    tone: "Tone",
    toneOptions: {
      professional: "Professional",
      casual: "Casual",
      humorous: "Humorous",
      formal: "Formal",
      friendly: "Friendly",
    },
    keywords: "Keywords",
    keywordsPlaceholder: "Enter keywords separated by commas",
    generate: "Generate",
    regenerate: "Regenerate",
    copy: "Copy",
    save: "Save",
    preview: "Preview",
    generatingContent: "Generating content...",
    contentCopied: "Content copied to clipboard",
    contentSaved: "Content saved successfully",
  },
  captionGenerator: {
    title: "Social Caption Generator",
    description: "Generate engaging captions for your social media posts",
    productTheme: "Product/Theme",
    productThemePlaceholder: "Enter a product or theme",
    platform: "Platform",
    platformOptions: {
      twitter: "Twitter",
      linkedin: "LinkedIn",
      instagram: "Instagram",
      facebook: "Facebook",
    },
    generate: "Generate",
    regenerate: "Regenerate",
    copy: "Copy",
    post: "Post",
    generatingCaptions: "Generating captions...",
    captionCopied: "Caption copied to clipboard",
  },
  errors: {
    general: "Something went wrong. Please try again.",
    network: "Network error. Please check your connection.",
    unauthorized: "You are not authorized to access this resource.",
    notFound: "The requested resource was not found.",
    validation: "Please check your input and try again.",
  },
};

i18n.use(initReactI18next).init({
  resources: {
    en: enTranslations,
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

/**
 * LoginForm Component
 *
 * A comprehensive login form with validation, error handling, and loading states.
 * This component handles user authentication with proper feedback and transitions.
 *
 * Key features:
 * - Form validation with zod schema
 * - Translated validation messages
 * - Visual feedback for errors
 * - Loading states with spinners
 * - Success animation and transition
 * - Rotating loading messages
 *
 * @bug Fixed: Login button stuck in loading state
 * @bug Fixed: Error messages not showing for invalid credentials
 * @bug Fixed: Missing visual feedback for form errors
 * @bug Fixed: Confusing transition to dashboard without feedback
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNotification } from "@/context/notification-context";
import { Github, Mail } from "lucide-react";

const formSchema = (t: any) => z.object({
  email: z.string().email({
    message: t("validation.emailValid"),
  }),
  password: z.string().min(6, {
    message: t("validation.passwordMinLength"),
  }),
});

export function LoginForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const validationSchema = formSchema(t);

  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /**
   * Handle form submission for login
   *
   * This function manages the entire login flow including:
   * 1. Setting loading states
   * 2. Authenticating with credentials
   * 3. Handling success/error states
   * 4. Providing visual feedback
   * 5. Transitioning to dashboard
   *
   * @param values - The validated form values (email, password)
   */
  async function onSubmit(values: z.infer<typeof validationSchema>) {
    // Initialize loading states and clear any previous errors
    setIsLoginLoading(true);
    setIsLoading(true);
    setHasError(false);

    try {
      // Attempt authentication with credentials
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false, // Handle redirect manually for better UX
      });

      if (result?.error) {
        // Don't log to console in production for security
        if (process.env.NODE_ENV !== "production") {
          console.error("Login error:", result.error);
        }

        // Show error notification for invalid credentials
        showNotification("error", t("auth.loginError"));

        // Small delay ensures notification is visible before focus returns to form
        await new Promise(resolve => setTimeout(resolve, 100));

        // Set error state to show visual feedback (red borders on inputs)
        setHasError(true);

        // Reset loading states
        setIsLoginLoading(false);
        setIsLoading(false);
      } else if (result?.ok) {
        // Authentication successful
        showNotification("success", t("auth.loginSuccess"));

        // Set success state and keep form disabled during transition
        setIsSuccess(true);
        setIsLoading(true); // Keep the form disabled
        setIsLoginLoading(false); // But stop the spinner on the button

        // Add success animation to button
        const loginButton = document.getElementById("login-button");
        if (loginButton) {
          loginButton.classList.add("success-animation-button");
        }

        // Prepare rotating loading messages for better UX during transition
        const messages = [
          t("auth.authenticating"),
          t("auth.preparingDashboard"),
          t("auth.loadingData"),
          t("auth.almostThere"),
        ];

        // Set up rotating messages
        let messageIndex = 0;
        setLoadingMessage(messages[messageIndex]);

        const messageInterval = setInterval(() => {
          messageIndex = (messageIndex + 1) % messages.length;
          setLoadingMessage(messages[messageIndex]);
        }, 1200); // Change message every 1.2 seconds

        // Delayed redirect to dashboard to show success state and messages
        setTimeout(() => {
          clearInterval(messageInterval);
          router.push("/dashboard");

          // Clean up states (in case we're still on the page)
          setIsSuccess(false);
          setIsLoading(false);
          setLoadingMessage("");
          if (loginButton) {
            loginButton.classList.remove("success-animation-button");
          }
        }, 4000); // 4 second delay allows for message rotation
      } else {
        // Unexpected error state
        showNotification("error", t("errors.general"));
        setIsLoginLoading(false);
        setIsLoading(false);
      }
    } catch (error) {
      // Handle unexpected exceptions
      console.error("Login exception:", error);
      showNotification("error", t("errors.general"));
      setIsLoginLoading(false);
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("common.login")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("common.signIn")} {t("common.toYourAccount")}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common.email")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    className={hasError ? "border-red-500 focus-visible:ring-red-500" : ""}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common.password")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="current-password"
                    autoCorrect="off"
                    disabled={isLoading}
                    className={hasError ? "border-red-500 focus-visible:ring-red-500" : ""}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {hasError && (
            <div className="text-sm text-red-500 mb-2 text-center">
              {t("auth.loginError")}
            </div>
          )}

          {isSuccess && loadingMessage && (
            <div className="text-sm text-primary mb-2 text-center animate-pulse">
              {loadingMessage}
            </div>
          )}

          <Button
            id="login-button"
            type="submit"
            className="w-full cursor-pointer"
            disabled={isLoginLoading || isSuccess}
            aria-busy={isLoginLoading}
          >
            {isLoginLoading ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t("common.loading")}
              </>
            ) : isSuccess ? (
              <>
                <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t("common.success")}
              </>
            ) : (
              t("common.signIn")
            )}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t("common.orContinueWith")}
          </span>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative w-full max-w-xs">
          <Button
            variant="outline"
            type="button"
            disabled={isLoading}
            onClick={() => {
              showNotification("info", t("auth.oauthSoon"));
            }}
            className="w-full cursor-pointer flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                fill="#EA4335"
              />
              <path
                d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                fill="#4285F4"
              />
              <path
                d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                fill="#FBBC05"
              />
              <path
                d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                fill="#34A853"
              />
            </svg>
            Google
          </Button>
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-md">
            <span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-muted rounded">
              {t("common.soon")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

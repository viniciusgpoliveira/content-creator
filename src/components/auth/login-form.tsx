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

  const validationSchema = formSchema(t);

  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof validationSchema>) {
    setIsLoginLoading(true);
    setIsLoading(true);

    try {
      // First, try to authenticate with credentials
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        console.error("Login error:", result.error);
        // Show a user-friendly error message
        if (result.error === "CredentialsSignin") {
          showNotification("error", t("auth.loginError"));
        } else {
          showNotification("error", t("errors.general"));
        }
        setIsLoginLoading(false); // Reset login button on error
        setIsLoading(false); // Reset all loading state on error
      } else if (result?.ok) {
        // Authentication successful
        showNotification("success", t("auth.loginSuccess"));

        // Use router.push with a slight delay to ensure the session is properly set
        setTimeout(() => {
          router.push("/dashboard");
          // Reset loading states if for some reason we don't redirect
          setIsLoginLoading(false);
          setIsLoading(false);
        }, 500);
      } else {
        showNotification("error", t("errors.general"));
        setIsLoginLoading(false); // Reset login button on error
        setIsLoading(false); // Reset all loading state on error
      }
    } catch (error) {
      console.error("Login exception:", error);
      showNotification("error", t("errors.general"));
      setIsLoginLoading(false); // Reset login button on error
      setIsLoading(false); // Reset all loading state on error
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
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isLoginLoading}
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

      <div className="flex flex-col space-y-2">
        <div className="relative w-full">
          <Button
            variant="outline"
            type="button"
            disabled={isLoading}
            onClick={() => {
              showNotification("info", t("auth.oauthSoon"));
            }}
            className="w-full cursor-pointer"
          >
            <Mail className="mr-2 h-4 w-4" />
            Google
          </Button>
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-md">
            <span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-muted rounded">
              {t("common.soon")}
            </span>
          </div>
        </div>
        <div className="relative w-full">
          <Button
            variant="outline"
            type="button"
            disabled={isLoading}
            onClick={() => {
              showNotification("info", t("auth.oauthSoon"));
            }}
            className="w-full cursor-pointer"
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
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

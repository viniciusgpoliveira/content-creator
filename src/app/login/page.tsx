import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { getTranslations } from "@/lib/i18n-server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PageTransition } from "@/components/page-transition";
import { AnimatedTestimonial } from "@/components/auth/animated-testimonial";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default async function LoginPage() {
  const session = await auth();

  // Redirect to dashboard if already authenticated
  if (session) {
    redirect("/dashboard");
  }

  const t = await getTranslations();
  return (
    <PageTransition>
      <div className="container relative flex h-screen flex-col items-center justify-center px-4 md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900">
          <Image
            src="https://images.unsplash.com/photo-1674505613923-98085d3712fd?auto=format&fit=crop&q=80&w=1920&h=1080"
            fill
            alt="Login background"
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          {t('common.welcome')}
        </div>
        <div className="relative z-20 mt-auto">
          <AnimatedTestimonial />
        </div>
      </div>
      <div className="w-full p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {t('auth.welcomeBack')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('auth.enterCredentials')}
            </p>
          </div>
          <LoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            {t('auth.termsAgreement')}{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              {t('auth.termsOfService')}
            </Link>{" "}
            {t('common.and')}{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              {t('auth.privacyPolicy')}
            </Link>
            .
          </p>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {t('auth.dontHaveAccount')}{" "}
              <Link
                href="/register"
                className="text-primary hover:underline cursor-pointer"
              >
                {t('common.signUp')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
}

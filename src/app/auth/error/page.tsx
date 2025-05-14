"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function AuthErrorPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const error = searchParams.get("error") as string;

  // Map error codes to user-friendly messages
  const errorMessages: Record<string, string> = {
    default: t("errors.general"),
    configuration: t("errors.configuration"),
    accessdenied: t("errors.accessDenied"),
    verification: t("errors.verification"),
  };

  const errorMessage = error ? errorMessages[error] || errorMessages.default : errorMessages.default;

  return (
    <div className="container flex h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-destructive">
            {t("errors.authError")}
          </h1>
          <p className="text-sm text-muted-foreground">{errorMessage}</p>
        </div>
        <Button asChild>
          <Link href="/login" className="w-full">
            {t("common.backToLogin")}
          </Link>
        </Button>
      </div>
    </div>
  );
}

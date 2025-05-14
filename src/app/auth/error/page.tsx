import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getTranslations } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Authentication Error",
  description: "An error occurred during authentication",
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = await getTranslations();
  const error = searchParams.error as string;

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

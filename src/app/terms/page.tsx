import { Metadata } from "next";
import { getTranslations } from "@/lib/i18n-server";
import { PageTransition } from "@/components/page-transition";
import { BackButton } from "@/components/back-button";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Content Creator Dashboard",
};

export default async function TermsOfServicePage() {
  const t = await getTranslations();

  return (
    <PageTransition>
      <div className="container max-w-4xl py-10 mx-auto">
        <div className="mb-6">
          <BackButton label={t('common.back')} />
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('terms.title')}</h1>
            <p className="text-muted-foreground mt-2">
              {t('terms.lastUpdated', { date: '2025-05-14' })}
            </p>
          </div>

          <div className="space-y-6 text-muted-foreground">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">{t('terms.introduction.title')}</h2>
              <p>{t('terms.introduction.content1')}</p>
              <p>{t('terms.introduction.content2')}</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">{t('terms.accountResponsibilities.title')}</h2>
              <p>{t('terms.accountResponsibilities.content')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('terms.accountResponsibilities.item1')}</li>
                <li>{t('terms.accountResponsibilities.item2')}</li>
                <li>{t('terms.accountResponsibilities.item3')}</li>
                <li>{t('terms.accountResponsibilities.item4')}</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">{t('terms.contentGuidelines.title')}</h2>
              <p>{t('terms.contentGuidelines.content')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('terms.contentGuidelines.item1')}</li>
                <li>{t('terms.contentGuidelines.item2')}</li>
                <li>{t('terms.contentGuidelines.item3')}</li>
                <li>{t('terms.contentGuidelines.item4')}</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">{t('terms.intellectualProperty.title')}</h2>
              <p>{t('terms.intellectualProperty.content1')}</p>
              <p>{t('terms.intellectualProperty.content2')}</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">{t('terms.aiContent.title')}</h2>
              <p>{t('terms.aiContent.content1')}</p>
              <p>{t('terms.aiContent.content2')}</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">{t('terms.termination.title')}</h2>
              <p>{t('terms.termination.content')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('terms.termination.item1')}</li>
                <li>{t('terms.termination.item2')}</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">{t('terms.limitation.title')}</h2>
              <p>{t('terms.limitation.content')}</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">{t('terms.changes.title')}</h2>
              <p>{t('terms.changes.content')}</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">{t('terms.governing.title')}</h2>
              <p>{t('terms.governing.content')}</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">{t('terms.contact.title')}</h2>
              <p>{t('terms.contact.content')}</p>
            </section>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

import { Metadata } from "next";
import { getTranslations } from "@/lib/i18n-server";
import { PageTransition } from "@/components/page-transition";
import { BackButton } from "@/components/back-button";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Content Creator Dashboard",
};

export default async function PrivacyPolicyPage() {
  const t = await getTranslations();

  return (
    <PageTransition>
      <div className="container max-w-4xl py-10 mx-auto">
        <div className="mb-6">
          <BackButton label={t('common.back')} />
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('privacy.title')}</h1>
            <p className="text-muted-foreground mt-2">
              {t('privacy.lastUpdated', { date: '2025-05-14' })}
            </p>
          </div>

          <div className="space-y-6 text-muted-foreground">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">{t('privacy.introduction.title')}</h2>
              <p>{t('privacy.introduction.content1')}</p>
              <p>{t('privacy.introduction.content2')}</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">{t('privacy.dataCollection.title')}</h2>
              <p>{t('privacy.dataCollection.content1')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('privacy.dataCollection.item1')}</li>
                <li>{t('privacy.dataCollection.item2')}</li>
                <li>{t('privacy.dataCollection.item3')}</li>
                <li>{t('privacy.dataCollection.item4')}</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">{t('privacy.dataUsage.title')}</h2>
              <p>{t('privacy.dataUsage.content')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('privacy.dataUsage.item1')}</li>
                <li>{t('privacy.dataUsage.item2')}</li>
                <li>{t('privacy.dataUsage.item3')}</li>
                <li>{t('privacy.dataUsage.item4')}</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">{t('privacy.cookies.title')}</h2>
              <p>{t('privacy.cookies.content1')}</p>
              <p>{t('privacy.cookies.content2')}</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">{t('privacy.thirdParty.title')}</h2>
              <p>{t('privacy.thirdParty.content')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('privacy.thirdParty.item1')}</li>
                <li>{t('privacy.thirdParty.item2')}</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">{t('privacy.security.title')}</h2>
              <p>{t('privacy.security.content')}</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">{t('privacy.userRights.title')}</h2>
              <p>{t('privacy.userRights.content')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('privacy.userRights.item1')}</li>
                <li>{t('privacy.userRights.item2')}</li>
                <li>{t('privacy.userRights.item3')}</li>
                <li>{t('privacy.userRights.item4')}</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">{t('privacy.changes.title')}</h2>
              <p>{t('privacy.changes.content')}</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">{t('privacy.contact.title')}</h2>
              <p>{t('privacy.contact.content')}</p>
            </section>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

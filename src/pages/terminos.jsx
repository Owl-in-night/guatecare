import React from 'react';
import { useTranslation } from 'react-i18next';

function TermsyCondi() {
  const { t } = useTranslation('global');

  return (
    <div className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          aria-hidden="true"
          className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
        >
          <defs>
            <pattern
              x="50%"
              y={-1}
              id="terms-pattern"
              width={200}
              height={200}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <rect fill="url(#terms-pattern)" width="100%" height="100%" strokeWidth={0} />
        </svg>
      </div>
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="lg:max-w-lg">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {t('termsAndConditions.title')}
              </h1>
              <p className="mt-6 text-xl ">
                {t('termsAndConditions.description')}
              </p>
            </div>
          </div>
        </div>
        <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
          <img
            alt={t('termsAndConditions.imageAlt')}
            src="/img/tyc.png"
            className="w-[48rem] max-w-none rounded-xl shadow-xl sm:w-[57rem]"
          />
        </div>
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="max-w-xl text-base lg:max-w-lg">
              <h2 className="text-2xl font-semibold ">
                {t('termsAndConditions.sections.purpose.title')}
              </h2>
              <p className="mt-4">
                {t('termsAndConditions.sections.purpose.content')}
              </p>
              <h2 className="mt-8 text-2xl font-semibold ">
                {t('termsAndConditions.sections.acceptableUse.title')}
              </h2>
              <p className="mt-4">{t('termsAndConditions.sections.acceptableUse.contentIntro')}</p>
              <ul className="mt-4 list-disc pl-5 space-y-2">
                {t('termsAndConditions.sections.acceptableUse.content', { returnObjects: true }).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <h2 className="mt-8 text-2xl font-semibold ">
                {t('termsAndConditions.sections.liabilityLimitation.title')}
              </h2>
              <p className="mt-4">
                {t('termsAndConditions.sections.liabilityLimitation.content')}
              </p>
              <h2 className="mt-8 text-2xl font-semibold ">
                {t('termsAndConditions.sections.modifications.title')}
              </h2>
              <p className="mt-4">
                {t('termsAndConditions.sections.modifications.content')}
              </p>
              <h2 className="mt-8 text-2xl font-semibold ">
                {t('termsAndConditions.sections.contact.title')}
              </h2>
              <p className="mt-4">
                {t('termsAndConditions.sections.contact.content')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsyCondi;

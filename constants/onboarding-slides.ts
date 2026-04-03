import { SymbolViewProps } from 'expo-symbols';
import { ComponentType } from 'react';
import { PhoneIllustration } from '@/components/onboarding/phone-illustration';
import { ChartIllustration } from '@/components/onboarding/chart-illustration';

export type OnboardingSlide = {
  key: string;
  title: string;
  body: string;
  features: { icon: SymbolViewProps['name']; label: string }[];
  Illustration: ComponentType;
};

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    key: 'tracking',
    title: 'Automatic expense\ntracking',
    body: 'Connect your bank accounts securely and let Spendalt handle the heavy lifting. No more manual data entry.',
    features: [
      { icon: 'bolt.fill', label: 'Real-time' },
      { icon: 'lock.shield.fill', label: 'Bank Secure' },
    ],
    Illustration: PhoneIllustration,
  },
  {
    key: 'insights',
    title: 'AI financial\ninsights',
    body: 'Get personalized advice on where you can save and how to optimize your monthly spending habits.',
    features: [
      { icon: 'brain.head.profile', label: 'AI Powered' },
      { icon: 'chart.line.uptrend.xyaxis', label: 'Trends' },
    ],
    Illustration: ChartIllustration,
  },
];

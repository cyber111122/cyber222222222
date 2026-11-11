import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.elmassarclub.youthguide',
  appName: 'EL-Massar Youth Guide',
  webDir: 'dist',
  backgroundColor: '#FFFFFF',
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: '#FFFFFF',
      showSpinner: false,
      androidSplashResourceName: 'splash',
    },
  },
};

export default config;

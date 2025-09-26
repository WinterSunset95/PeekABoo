import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'github.WinterSunset95.PeekABoo',
  appName: 'PeekABoo',
  webDir: 'dist',
  android: { allowMixedContent: true },
  server: {
	  androidScheme: "http",
	  cleartext: true
  },
  plugins: {
	  CapacitorHttp: {
		  enabled: true
	  },
    FirebaseAuthentication: {
      authDomain: undefined,
      skipNativeAuth: false,
      providers: ["google.com", "phone"],
    },
  }
};

export default config;

import { Browser } from '@capacitor/browser';

export async function openExternalLink(url: string): Promise<void> {
  await Browser.open({ url });
}

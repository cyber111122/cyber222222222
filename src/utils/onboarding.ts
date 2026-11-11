const WELCOME_KEY = 'elmassar.welcomeSeen';

export function hasSeenWelcome(): boolean {
  return localStorage.getItem(WELCOME_KEY) === 'true';
}

export function markWelcomeSeen(): void {
  localStorage.setItem(WELCOME_KEY, 'true');
}

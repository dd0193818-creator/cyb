/**
 * Curated list of top common, easily crackable, and leaked passwords
 * Stored in a JavaScript Set for instantaneous O(1) client-side lookups.
 */
export const COMMON_PASSWORDS = new Set<string>([
  "123456", "password", "12345678", "qwerty", "123456789", "12345", "1234", "111111",
  "1234567", "dragon", "123123", "baseball", "football", "monkey", "letmein", "shadow",
  "master", "superman", "killer", "trustno1", "password1", "password123", "admin", "welcome",
  "login", "root", "toor", "pass", "secret", "default", "guest", "access", "iloveyou",
  "starwars", "pokemon", "princess", "cookie", "sunshine", "charlie", "hunter2", "batman",
  "testing", "system", "administrator", "computer", "qwertz", "azerty", "asdfgh", "zxcvbnm",
  "hello123", "liverpool", "arsenal", "chelsea", "manchester", "barcelona", "realmadrid",
  "test123", "changeme", "ninja", "mustang", "michael", "jessica", "jordan", "matrix",
  "server", "hacker", "network", "firewall", "cyber", "security", "telemetry", "socadmin"
]);

/**
 * Checks whether a given string matches known common or dictionary passwords.
 */
export function isCommonPassword(pwd: string): boolean {
  if (!pwd) return false;
  const normalized = pwd.trim().toLowerCase();
  return COMMON_PASSWORDS.has(normalized);
}

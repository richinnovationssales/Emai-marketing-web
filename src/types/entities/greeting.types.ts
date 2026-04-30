export const GREETING_TOKENS = ['firstName', 'lastName', 'fullName', 'email'] as const;
export type GreetingToken = typeof GREETING_TOKENS[number];

export const GREETING_TOKEN_LABELS: Record<GreetingToken, string> = {
  firstName: 'First name',
  lastName: 'Last name',
  fullName: 'Full name',
  email: 'Email',
};

// Must match the backend's runtime regex in core/utils/personalize.ts so a
// template that validates here also substitutes correctly on send.
const TOKEN_REGEX = /\{\{(\w+)\}\}/g;

export function extractGreetingTokens(template: string): string[] {
  const found = new Set<string>();
  let match: RegExpExecArray | null;
  TOKEN_REGEX.lastIndex = 0;
  while ((match = TOKEN_REGEX.exec(template)) !== null) {
    found.add(match[1]);
  }
  return Array.from(found);
}

export function findInvalidGreetingTokens(template: string): string[] {
  const allowed = new Set<string>(GREETING_TOKENS);
  return extractGreetingTokens(template).filter((t) => !allowed.has(t));
}

export interface Greeting {
  id: string;
  name: string;
  template: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGreetingDTO {
  name: string;
  template: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface UpdateGreetingDTO {
  name?: string;
  template?: string;
  isActive?: boolean;
  displayOrder?: number;
}

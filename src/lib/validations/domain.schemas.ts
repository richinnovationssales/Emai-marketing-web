import * as z from "zod";

// List of public email provider domains to block
export const PUBLIC_EMAIL_PROVIDERS = [
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "yahoo.co.in",
  "ymail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "aol.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "protonmail.com",
  "proton.me",
  "zoho.com",
  "mail.com",
  "gmx.com",
  "gmx.net",
  "yandex.com",
  "yandex.ru",
  "rediffmail.com",
  "inbox.com",
  "fastmail.com",
  "tutanota.com",
  "mailinator.com",
  "guerrillamail.com",
  "tempmail.com",
];

// Domain validation regex - validates proper domain format
export const DOMAIN_REGEX = /^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

// Custom validation function for domain
export const isValidDomain = (domain: string): boolean => {
  if (!domain) return true;
  return DOMAIN_REGEX.test(domain);
};

// Check if domain is a public email provider
export const isPublicEmailProvider = (domain: string): boolean => {
  if (!domain) return false;
  const lowerDomain = domain.toLowerCase().trim();
  return PUBLIC_EMAIL_PROVIDERS.some(
    (provider) =>
      lowerDomain === provider || lowerDomain.endsWith(`.${provider}`),
  );
};

// Reusable mailgunDomain zod field (optional, with validation)
export const mailgunDomainField = z
  .string()
  .transform((val) => val.trim() || undefined)
  .refine(
    (val) => !val || isValidDomain(val),
    "Please enter a valid domain (e.g., mail.yourdomain.com)",
  )
  .refine(
    (val) => !val || !isPublicEmailProvider(val),
    "Public email providers (Gmail, Yahoo, Outlook, etc.) are not allowed",
  )
  .optional();

// Reusable mailgunFromEmail zod field (optional, with validation)
export const mailgunFromEmailField = z
  .string()
  .transform((val) => val.trim() || undefined)
  .refine(
    (val) => !val || z.string().email().safeParse(val).success,
    "Please enter a valid email address (e.g., info@yourdomain.com)",
  )
  .refine(
    (val) => {
      if (!val) return true;
      const domain = val.split("@")[1];
      return domain ? !isPublicEmailProvider(domain) : true;
    },
    "Public email providers (Gmail, Yahoo, Outlook, etc.) are not allowed",
  )
  .optional();

// Cross-field refinement: mailgunFromEmail domain must match mailgunDomain
export const mailgunDomainMatchRefinement = (data: {
  mailgunFromEmail?: string;
  mailgunDomain?: string;
}) => {
  if (!data.mailgunFromEmail || !data.mailgunDomain) return true;
  const emailDomain = data.mailgunFromEmail.split("@")[1];
  return emailDomain === data.mailgunDomain;
};

export const MAILGUN_DOMAIN_MATCH_MESSAGE =
  "From email domain must match the Mailgun domain (e.g., if domain is mail.example.com, use user@mail.example.com)";

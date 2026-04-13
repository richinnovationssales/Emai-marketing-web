// utils/greetingUtils.ts
export type GreetingFormat = "NONE" | "FIRST_NAME" | "LAST_NAME" | "FULL_NAME";

export const GREETING_LABELS: Record<GreetingFormat, string> = {
  NONE: "No greeting",
  FIRST_NAME: "First Name — Hi {firstName},",
  LAST_NAME: "Last Name — Hi {lastName},",
  FULL_NAME: "Full Name — Hi {firstName} {lastName},",
};

export function buildGreetingHtml(format: GreetingFormat): string {
  switch (format) {
    case "FIRST_NAME":
      return `<p>Hi {{firstName}},</p>`;
    case "LAST_NAME":
      return `<p>Hi {{lastName}},</p>`;
    case "FULL_NAME":
      return `<p>Hi {{firstName}} {{lastName}},</p>`;
    default:
      return "";
  }
}

// Strip any existing greeting line from content before prepending new one
const GREETING_REGEX = /^<p>Hi\s*(\{\{firstName\}\})?(\s*\{\{lastName\}\})?,<\/p>/;

export function injectGreetingIntoContent(
  currentContent: string,
  format: GreetingFormat
): string {
  // Remove existing greeting if any
  const stripped = currentContent.replace(GREETING_REGEX, "").trimStart();
  const greeting = buildGreetingHtml(format);
  return greeting ? `${greeting}${stripped}` : stripped;
}
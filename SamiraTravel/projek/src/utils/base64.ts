const DATA_URL_PATTERN = /^data:([^;]+);base64,/;
const BASE64_WHITESPACE = /\s+/g;

type GuessRule = {
  prefix: string;
  mime: string;
};

const IMAGE_GUESS_RULES: GuessRule[] = [
  { prefix: "iVBORw0KGgo", mime: "image/png" },
  { prefix: "/9j/", mime: "image/jpeg" },
  { prefix: "R0lGOD", mime: "image/gif" },
  { prefix: "UklGR", mime: "image/webp" },
  { prefix: "AAAB", mime: "image/x-icon" },
];

const normalizeBase64 = (value: string) => value.replace(BASE64_WHITESPACE, "");

export const extractMimeTypeFromDataUrl = (value: string): string | undefined => {
  const match = DATA_URL_PATTERN.exec(value);
  return match?.[1];
};

export const stripDataUrlPrefix = (value: string): string => {
  const commaIndex = value.indexOf(",");
  if (commaIndex === -1) {
    return normalizeBase64(value);
  }
  const base64Part = value.slice(commaIndex + 1);
  return normalizeBase64(base64Part);
};

export const guessImageMimeType = (base64: string): string | undefined => {
  const sanitized = normalizeBase64(base64);
  const rule = IMAGE_GUESS_RULES.find((item) => sanitized.startsWith(item.prefix));
  return rule?.mime;
};

export const buildDataUrl = (base64?: string, mimeType?: string): string => {
  if (!base64) {
    return "";
  }
  if (base64.startsWith("data:")) {
    return base64;
  }
  const sanitized = normalizeBase64(base64);
  const type = mimeType ?? guessImageMimeType(sanitized) ?? "image/jpeg";
  return `data:${type};base64,${sanitized}`;
};

export const base64ByteLength = (base64: string): number => {
  const sanitized = normalizeBase64(base64);
  const padding = sanitized.endsWith("==") ? 2 : sanitized.endsWith("=") ? 1 : 0;
  return Math.floor((sanitized.length * 3) / 4) - padding;
};

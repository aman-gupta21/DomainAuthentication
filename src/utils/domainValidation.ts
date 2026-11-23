const ALLOWED_DOMAIN = process.env.EXPO_PUBLIC_ALLOWED_DOMAIN || "hbplus.fit";

export const isAllowedEmail = (
email: string | null | undefined
): boolean => {

if (!email) return false;

const normalizedEmail = email.trim().toLowerCase();

return normalizedEmail.endsWith(`@${ALLOWED_DOMAIN}`);

};
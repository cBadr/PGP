import { prisma } from "./prisma";

export async function logActivity(userId: string, action: string, details?: string) {
  await prisma.activityLog.create({
    data: { userId, action, details: details ?? null },
  });
}

/**
 * Audit trail for admin actions on user data.
 * Admin reads ARE themselves auditable — there is no admin "free look".
 */
export async function logAdminRead(adminId: string, what: string, subject?: string) {
  await prisma.activityLog.create({
    data: { userId: adminId, action: "admin_read", details: subject ? `${what} · ${subject}` : what },
  });
}

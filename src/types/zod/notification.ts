import { z } from "zod";

const typesSchema = z.array(
  z.enum(["Issue", "PullRequest", "Commit"], {
    errorMap: (_issue, ctx) => ({
      message: `請選擇正確的通知類型：Issue、PullRequest 或 Commit，而不是 ${ctx.data}`,
    }),
  })
);
const NotificationSchema = z.object({
  id: z.string(),
  unread: z.boolean(),
  subject: z.object({
    title: z.string(),
    url: z.string(),
    type: z.string(),
  }),
  updated_at: z.string(),
  url: z.string(),
  webUrl: z.string(),
});

const RepoWithNotificationsSchema = z.object({
  name: z.string(),
  isActive: z.boolean(),
  preference: z.object({
    types: z.array(z.string()),
  }),
  notifications: z.array(NotificationSchema),
});

export { typesSchema, NotificationSchema, RepoWithNotificationsSchema };

export type Notification = z.infer<typeof NotificationSchema>;
export type RepoWithNotifications = z.infer<typeof RepoWithNotificationsSchema>;

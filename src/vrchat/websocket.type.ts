import * as z from "zod";

const BadgeSchema = z.object({
  assignedAt: z.string().nullable().optional(),
  badgeDescription: z.string(),
  badgeId: z.string(),
  badgeImageUrl: z.string(),
  badgeName: z.string(),
  hidden: z.boolean().nullable().optional(),
  showcased: z.boolean(),
  updatedAt: z.string().nullable().optional(),
});

export const UserSchema = z.object({
  ageVerificationStatus: z.enum(["18+", "hidden", "verified"]),
  ageVerified: z.boolean(),
  allowAvatarCopying: z.boolean(),

  badges: z.array(BadgeSchema).optional(),

  bio: z.string(),
  bioLinks: z.array(z.string()),
  currentAvatarImageUrl: z.string(),
  currentAvatarTags: z.array(z.string().min(1)),
  currentAvatarThumbnailImageUrl: z.string(),
  date_joined: z.string(),

  developerType: z.enum(["internal", "moderator", "none", "trusted"]),
  displayName: z.string(),
  friendKey: z.string(),
  friendRequestStatus: z.string().optional(),

  id: z.string(),
  instanceId: z.string().optional(),
  isFriend: z.boolean(),

  last_activity: z.string(),
  last_login: z.string(),
  last_mobile: z.string().nullable().optional(),
  last_platform: z.string(),

  location: z.string().optional(),
  note: z.string().optional(),
  platform: z.string().optional(),

  profilePicOverride: z.string(),
  profilePicOverrideThumbnail: z.string(),
  pronouns: z.string(),

  state: z.enum(["active", "offline", "online"]),
  status: z.enum(["active", "ask me", "busy", "join me", "offline"]),
  statusDescription: z.string(),

  tags: z.array(z.string().min(1)),
  travelingToInstance: z.string().optional(),
  travelingToLocation: z.string().optional(),
  travelingToWorld: z.string().optional(),

  userIcon: z.string(),
  username: z.string().optional(),
  worldId: z.string().optional(),
});

export const KnownWebSocketResponseSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("friend-online"),
    content: z.strictObject({
      userId: z.string(),
      platform: z.string(),
      location: z.string(),
      canRequestInvite: z.boolean(),
      user: UserSchema
    })
  }),
  z.object({
    type: z.literal("friend-offline"),
    content: z.strictObject({
      userId: z.string(),
      platform: z.string()
    })
  })
])

export type KnownWebSocketResponse = z.infer<typeof KnownWebSocketResponseSchema>;
export type WebSocketEvent = KnownWebSocketResponse["type"];

export const WebSocketResponseSchema = z.looseObject({
  type: z.string(),
  content: z.unknown().optional(),
});
export type WebSocketResponse = z.infer<typeof WebSocketResponseSchema>;

export interface AppTokenCacheDto {
  clientId?: string;
  accessToken: string;
  refreshToken?: string;
}

export type AppListResponse = Record<string, AppTokenCacheDto>;

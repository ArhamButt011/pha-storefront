import { apiClient } from "./client";
import type { BeResponse } from "./base";
import type {
  Article,
  ArticlePage,
  ArticleTagCount,
  ContentPage,
  PublicSeoSettings,
  RedirectTarget,
  SitemapEntries,
} from "@/types/seo";

export const getPublicSeo = async () => {
  const { data } = await apiClient.get<BeResponse<PublicSeoSettings>>("/seo/public/settings");
  return data;
};

export const listArticles = async (page = 1, tag?: string) => {
  const { data } = await apiClient.get<BeResponse<ArticlePage>>("/seo/public/articles", {
    params: { page, ...(tag && { tag }) },
  });
  return data;
};

export const listArticleTags = async () => {
  const { data } = await apiClient.get<BeResponse<ArticleTagCount[]>>("/seo/public/articles/tags");
  return data;
};

export const getArticle = async (slug: string) => {
  const { data } = await apiClient.get<BeResponse<Article>>(`/seo/public/articles/${encodeURIComponent(slug)}`);
  return data;
};

export const getPage = async (slug: string) => {
  const { data } = await apiClient.get<BeResponse<ContentPage>>(`/seo/public/pages/${encodeURIComponent(slug)}`);
  return data;
};

export const resolveRedirect = async (path: string) => {
  const { data } = await apiClient.get<BeResponse<RedirectTarget | null>>("/seo/public/redirect", { params: { path } });
  return data;
};

export const getSitemapEntries = async () => {
  const { data } = await apiClient.get<BeResponse<SitemapEntries>>("/seo/public/sitemap");
  return data;
};

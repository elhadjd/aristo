import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { MediaImage } from "@/components/shared/media-image";
import { JsonLd } from "@/components/seo/json-ld";
import { defaultKeywords, pageSeo } from "@/config/seo";
import { getArticle } from "@/lib/data";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  buildMetadata,
} from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) {
    return buildMetadata({ title: "Article", path: `/articles/${slug}`, noIndex: true });
  }
  const description =
    article.excerpt ||
    article.content.replace(/\s+/g, " ").trim().slice(0, 155) ||
    pageSeo.articles.description;
  return buildMetadata({
    title: article.title,
    description: description.length > 160 ? `${description.slice(0, 157).trim()}…` : description,
    path: `/articles/${article.slug}`,
    image: article.coverImage || undefined,
    keywords: [
      ...defaultKeywords,
      ...pageSeo.articles.keywords,
      article.title,
      "Fellah Express LLC blog",
      "Columbus car buying tips",
    ],
    type: "article",
    publishedTime: article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined,
    modifiedTime: article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined,
  });
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const path = `/articles/${article.slug}`;
  const description = article.excerpt || article.content.slice(0, 160);

  return (
    <article className="section-shell py-28">
      <JsonLd
        data={[
          articleJsonLd({
            title: article.title,
            description,
            path,
            image: article.coverImage || undefined,
            publishedAt: article.publishedAt,
            updatedAt: article.updatedAt,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Articles", path: "/articles" },
            { name: article.title, path },
          ]),
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Articles", href: "/articles" },
          { label: article.title },
        ]}
      />
      <h1 className="mt-4 max-w-3xl font-display text-4xl sm:text-5xl">{article.title}</h1>
      {article.coverImage ? (
        <div className="relative mt-8 aspect-[16/8] overflow-hidden rounded-3xl">
          <MediaImage
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      ) : null}
      <div className="prose-sm mt-8 max-w-3xl whitespace-pre-wrap text-muted">
        {article.content}
      </div>
    </article>
  );
}

import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getArticle } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return buildMetadata({ title: "Article", path: `/articles/${slug}`, noIndex: true });
  return buildMetadata({
    title: article.title,
    description: article.excerpt || article.content.slice(0, 140),
    path: `/articles/${article.slug}`,
    image: article.coverImage || undefined,
  });
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  return (
    <article className="section-shell py-28">
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
          <Image
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

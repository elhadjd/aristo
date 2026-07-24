import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/shared/page-hero";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { listArticles } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("articles");

export default async function ArticlesPage() {
  const articles = await listArticles(true);

  return (
    <>
      <PageHero title="Articles" description="Guides, updates, and dealership stories." />
      <section className="section-shell py-12 sm:py-16">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Articles" }]} />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={
                    article.coverImage ||
                    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80"
                  }
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-5">
                <h2 className="font-display text-2xl">{article.title}</h2>
                <p className="mt-2 text-sm text-muted">{article.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
        {articles.length === 0 ? (
          <p className="text-sm text-muted">No articles published yet.</p>
        ) : null}
      </section>
    </>
  );
}

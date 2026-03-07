import { Clock, User, Tag } from "lucide-react";

const ARTICLE_IMAGE_MAP: Record<string, string> = {
  "priority-mail": "/images/articles/priority-mail-box.webp",
  "certified-mail": "/images/articles/certified-mail.webp",
  "first-class": "/images/articles/first-class-mail.webp",
  "first-class-mail": "/images/articles/first-class-mail.webp",
  "media-mail": "/images/articles/media-mail.webp",
  "express-mail": "/images/articles/express-mail.webp",
  "priority-mail-express": "/images/articles/express-mail.webp",
  "ground-advantage": "/images/articles/ground-advantage.webp",
  "international": "/images/features/international-shipping.webp",
  "customs": "/images/articles/customs-forms.webp",
  "customs-clearance": "/images/articles/customs-forms.webp",
  "tracking-label": "/images/articles/tracking-label.webp",
  "barcode": "/images/articles/tracking-label.webp",
  "post-office": "/images/articles/post-office.webp",
  "lost": "/images/articles/package-late.webp",
  "delayed": "/images/articles/package-late.webp",
  "not-updating": "/images/articles/package-late.webp",
  "stuck": "/images/articles/package-late.webp",
  "return-to-sender": "/images/articles/package-return.webp",
  "return": "/images/articles/package-return.webp",
  "fragile": "/images/articles/fragile-package.webp",
  "holiday": "/images/articles/holiday-packages.webp",
  "delivered": "/images/statuses/delivered.webp",
  "out-for-delivery": "/images/statuses/out-for-delivery.webp",
  "in-transit": "/images/statuses/in-transit.webp",
  "sorting": "/images/statuses/sorting-facility.webp",
  "weather": "/images/statuses/weather-delay.webp",
  "scanning": "/images/statuses/scanning.webp",
  "package-network": "/images/features/package-network.webp",
  "postal-worker": "/images/features/postal-worker.webp",
  "ecommerce": "/images/features/ecommerce.webp",
};

function getArticleImage(slug: string): string {
  const lower = slug.toLowerCase();
  for (const [key, img] of Object.entries(ARTICLE_IMAGE_MAP)) {
    if (lower.includes(key)) return img;
  }
  return "/images/features/package-network.webp";
}

interface ArticleImageHeaderProps {
  slug: string;
  title: string;
  readTime?: string;
  author?: string;
  category?: string;
  publishDate?: string;
}

export default function ArticleImageHeader({
  slug,
  title,
  readTime = "5 min read",
  author = "US Postal Tracking Team",
  category,
  publishDate,
}: ArticleImageHeaderProps) {
  const img = getArticleImage(slug);
  const date = publishDate || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden mb-6 img-card">
      <img
        src={img}
        alt={title}
        className="w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
        {category && (
          <div className="inline-flex items-center gap-1.5 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
            <Tag className="h-3 w-3" />
            {category}
          </div>
        )}
        <div className="flex items-center gap-4 text-xs text-white/70">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" /> {author}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {readTime}
          </span>
          {publishDate && (
            <span>{date}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export { getArticleImage };

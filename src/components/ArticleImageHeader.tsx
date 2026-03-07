import { Clock, User, Tag } from "lucide-react";

const ARTICLE_IMAGE_MAP: Record<string, string> = {
  "priority-mail": "/images/articles/priority-mail-box.png",
  "certified-mail": "/images/articles/certified-mail.png",
  "first-class": "/images/articles/first-class-mail.png",
  "first-class-mail": "/images/articles/first-class-mail.png",
  "media-mail": "/images/articles/media-mail.png",
  "express-mail": "/images/articles/express-mail.png",
  "priority-mail-express": "/images/articles/express-mail.png",
  "ground-advantage": "/images/articles/ground-advantage.png",
  "international": "/images/features/international-shipping.png",
  "customs": "/images/articles/customs-forms.png",
  "customs-clearance": "/images/articles/customs-forms.png",
  "tracking-label": "/images/articles/tracking-label.png",
  "barcode": "/images/articles/tracking-label.png",
  "post-office": "/images/articles/post-office.png",
  "lost": "/images/articles/package-late.png",
  "delayed": "/images/articles/package-late.png",
  "not-updating": "/images/articles/package-late.png",
  "stuck": "/images/articles/package-late.png",
  "return-to-sender": "/images/articles/package-return.png",
  "return": "/images/articles/package-return.png",
  "fragile": "/images/articles/fragile-package.png",
  "holiday": "/images/articles/holiday-packages.png",
  "delivered": "/images/statuses/delivered.png",
  "out-for-delivery": "/images/statuses/out-for-delivery.png",
  "in-transit": "/images/statuses/in-transit.png",
  "sorting": "/images/statuses/sorting-facility.png",
  "weather": "/images/statuses/weather-delay.png",
  "scanning": "/images/statuses/scanning.png",
  "package-network": "/images/features/package-network.png",
  "postal-worker": "/images/features/postal-worker.png",
  "ecommerce": "/images/features/ecommerce.png",
};

function getArticleImage(slug: string): string {
  const lower = slug.toLowerCase();
  for (const [key, img] of Object.entries(ARTICLE_IMAGE_MAP)) {
    if (lower.includes(key)) return img;
  }
  return "/images/features/package-network.png";
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

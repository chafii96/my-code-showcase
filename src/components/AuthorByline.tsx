import { Link } from "react-router-dom";
import { Author, getAuthorForPage, getPublishDate, getModifiedDate } from "@/data/authors";
import { Calendar, User, Clock } from "lucide-react";

interface AuthorBylineProps {
  slug: string;
  showBio?: boolean;
  className?: string;
}

/**
 * Author byline with structured data for E-E-A-T.
 * Shows author name, role, publish/modified dates.
 */
export function AuthorByline({ slug, showBio = false, className = "" }: AuthorBylineProps) {
  const author = getAuthorForPage(slug);
  const publishDate = getPublishDate(slug);
  const modifiedDate = getModifiedDate(slug);

  const formattedPublish = new Date(publishDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedModified = new Date(modifiedDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
        {/* Author Avatar + Name */}
        <Link
          to="/about#editorial-team"
          className="flex items-center gap-2 hover:text-primary transition-colors"
        >
          <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
            {author.avatar}
          </span>
          <span className="font-medium text-foreground">{author.name}</span>
        </Link>

        <span className="text-muted-foreground/40">·</span>
        <span className="text-xs">{author.role}</span>

        <span className="text-muted-foreground/40">·</span>

        {/* Dates */}
        <span className="flex items-center gap-1 text-xs">
          <Calendar className="h-3 w-3" />
          Published {formattedPublish}
        </span>

        <span className="flex items-center gap-1 text-xs">
          <Clock className="h-3 w-3" />
          Updated {formattedModified}
        </span>
      </div>

      {showBio && (
        <p className="text-xs text-muted-foreground leading-relaxed mt-1 max-w-2xl">
          {author.bio}
        </p>
      )}
    </div>
  );
}

/**
 * Full author card — shown at bottom of articles for E-E-A-T
 */
export function AuthorCard({ slug }: { slug: string }) {
  const author = getAuthorForPage(slug);

  return (
    <div className="border rounded-xl p-5 bg-card mt-8">
      <div className="flex items-start gap-4">
        <span className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm shrink-0">
          {author.avatar}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Link to="/about#editorial-team" className="font-semibold text-foreground hover:text-primary transition-colors">
              {author.name}
            </Link>
          </div>
          <p className="text-xs text-primary/80 font-medium mb-2">{author.role}</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">{author.bio}</p>
          <div className="flex flex-wrap gap-2">
            {author.credentials.map((cred, i) => (
              <span key={i} className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
                {cred}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * JSON-LD author schema for structured data
 */
export function AuthorSchema({ slug }: { slug: string }) {
  const author = getAuthorForPage(slug);
  const publishDate = getPublishDate(slug);
  const modifiedDate = getModifiedDate(slug);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    jobTitle: author.role,
    description: author.bio,
    worksFor: {
      "@type": "Organization",
      name: "US Postal Tracking",
      url: "https://uspostaltracking.com",
    },
    url: "https://uspostaltracking.com/about#editorial-team",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

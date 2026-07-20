import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import type { BlogPost } from '../types';
import BlogHeader from './BlogHeader';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

function formatDate(value?: string): string {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog?status=published')
      .then(res => res.json())
      .then((data: BlogPost[]) => setPosts(data))
      .catch(err => console.error("Error fetching blog posts:", err))
      .finally(() => setLoading(false));
  }, []);

  const goToPost = (slug: string) => {
    window.history.pushState({ path: '/blog/' + slug }, '', '/blog/' + slug);
  };

  return (
    <>
      <BlogHeader />
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="py-24 bg-bg min-h-screen font-sans"
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <span className="font-sans text-xs font-bold text-primary uppercase tracking-[0.2em] block mb-2">
            Cuva Journal
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-charcoal">
            From the Blog
          </h2>
          <p className="font-sans text-lg text-charcoal/60 mt-4 max-w-2xl mx-auto">
            Notes on IT systems, print craft, and brand strategy from the Cuva Tech studio.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <p className="font-sans text-charcoal/60 text-lg">Loading articles…</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-charcoal/5 rounded-3xl">
            <p className="font-sans text-charcoal/60 text-lg">
              No articles published yet. Check back soon!
            </p>
          </div>
        ) : (
          <motion.div
            variants={fadeInScale}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {posts.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => goToPost(post.slug)}
                className="cursor-pointer bg-white border border-charcoal/5 rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all flex flex-col"
              >
                <div className="aspect-[16/9] overflow-hidden bg-primary/10">
                  {post.coverImageUrl ? (
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                      <span className="font-display text-charcoal/30 text-sm font-bold px-2 text-center">
                        {post.title}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-xl font-bold text-charcoal leading-tight">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="font-sans text-sm text-charcoal/60 leading-relaxed mt-3 flex-1">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-charcoal/5">
                    <span className="font-sans text-xs text-charcoal/40 font-medium">
                      {post.author ? `${post.author} · ` : ''}{formatDate(post.createdAt)}
                    </span>
                    <span className="text-sm font-bold text-primary hover:text-primary/80 flex items-center space-x-1 transition-colors">
                      <span>Read more</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </motion.section>
    </>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

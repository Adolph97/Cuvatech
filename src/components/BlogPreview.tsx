import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Newspaper } from 'lucide-react';
import type { BlogPost } from '../types';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
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

// Strip HTML tags (TipTap content) down to readable text.
function toPlainText(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function truncate(text: string, max = 150): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return trimmed.slice(0, max).trimEnd() + '…';
}

const goToBlog = () => window.history.pushState({ path: '/blog' }, '', '/blog');
const goToPost = (slug: string) =>
  window.history.pushState({ path: '/blog/' + slug }, '', '/blog/' + slug);

export default function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog?status=published')
      .then((res) => res.json())
      .then((data: BlogPost[]) => {
        const sorted = Array.isArray(data)
          ? [...data].sort(
              (a, b) =>
                new Date(b.createdAt || 0).getTime() -
                new Date(a.createdAt || 0).getTime()
            )
          : [];
        setPosts(sorted.slice(0, 3));
      })
      .catch((err) => console.error('Error fetching blog posts:', err))
      .finally(() => setLoading(false));
  }, []);

  // Keep the landing page clean when there are no published articles yet.
  if (loading || posts.length === 0) return null;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={fadeInUp}
      className="py-24 bg-white/50 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeInUp} className="max-w-3xl mx-auto text-center mb-16">
          <span className="font-sans text-xs font-bold text-primary uppercase tracking-[0.2em] block mb-3 flex items-center justify-center space-x-2">
            <Newspaper className="w-4 h-4" />
            <span>Cuva Journal</span>
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-charcoal">
            Latest from the Blog
          </h2>
          <p className="font-sans text-lg text-charcoal/60 mt-4 max-w-2xl mx-auto">
            Notes on IT systems, print craft, and brand strategy from the Cuva Tech studio.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {posts.map((post) => {
            const snippet = truncate(
              post.excerpt ? post.excerpt : toPlainText(post.content || '')
            );
            return (
              <motion.article
                key={post.id}
                onClick={() => goToPost(post.slug)}
                className="cursor-pointer bg-white border border-charcoal/5 rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all flex flex-col group"
              >
                <div className="aspect-[16/9] overflow-hidden bg-primary/10">
                  {post.coverImageUrl ? (
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                  {snippet && (
                    <p className="font-sans text-sm text-charcoal/60 leading-relaxed mt-3 flex-1">
                      {snippet}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-charcoal/5">
                    <span className="font-sans text-xs text-charcoal/40 font-medium">
                      {post.author ? `${post.author} · ` : ''}
                      {formatDate(post.createdAt)}
                    </span>
                    <span className="text-sm font-bold text-primary hover:text-primary/80 flex items-center space-x-1 transition-colors">
                      <span>Read more</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        <motion.div variants={fadeInUp} className="flex justify-center mt-12">
          <button
            onClick={goToBlog}
            className="bg-charcoal text-white px-8 py-4 text-sm font-bold rounded-2xl shadow-lg shadow-charcoal/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-2 cursor-pointer"
          >
            <span>View all articles</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}

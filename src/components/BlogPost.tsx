import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import type { BlogPost as BlogPostType } from '../types';

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

export default function BlogPost() {
  const slug = window.location.pathname.split('/blog/')[1];
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    fetch(`/api/blog/${slug}`)
      .then(res => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data: BlogPostType | null) => {
        if (data) setPost(data);
      })
      .catch(err => {
        console.error("Error fetching blog post:", err);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const goToBlog = () => {
    window.history.pushState({ path: '/blog' }, '', '/blog');
  };

  return (
    <motion.article
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="py-24 bg-bg min-h-screen font-sans"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={goToBlog}
          className="text-sm font-bold text-primary hover:text-primary/80 flex items-center space-x-2 cursor-pointer transition-colors mb-10"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M19 12H5M11 19l-7-7 7-7" />
          </svg>
          <span>Back to blog</span>
        </button>

        {loading ? (
          <div className="text-center py-20">
            <p className="font-sans text-charcoal/60 text-lg">Loading article…</p>
          </div>
        ) : notFound || !post ? (
          <div className="text-center py-20 bg-white border border-charcoal/5 rounded-3xl">
            <h3 className="font-display text-2xl font-bold text-charcoal mb-3">Article not found</h3>
            <p className="font-sans text-charcoal/60 text-base">
              We couldn’t find that post. It may have been moved or unpublished.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-charcoal/5 rounded-[2.5rem] shadow-sm overflow-hidden">
            {post.coverImageUrl && (
              <div className="aspect-[16/9] overflow-hidden bg-primary/10">
                <img
                  src={post.coverImageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-8 sm:p-12">
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-charcoal leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center space-x-3 mt-4 font-sans text-sm text-charcoal/40 font-medium">
                {post.author && <span className="text-charcoal/60">{post.author}</span>}
                {post.author && post.createdAt && <span>·</span>}
                {post.createdAt && <span>{formatDate(post.createdAt)}</span>}
              </div>

              <div
                className="prose prose-charcoal mt-8 font-sans text-charcoal/80 leading-relaxed [&_a]:text-primary [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.article>
  );
}

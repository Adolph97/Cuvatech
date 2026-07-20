import React from 'react';
import { ArrowLeft, Newspaper } from 'lucide-react';
import { CuvaLogo } from './Navbar';

const goHome = () => window.history.pushState({ path: '/' }, '', '/');
const goToBlog = () => window.history.pushState({ path: '/blog' }, '', '/blog');

export default function BlogHeader({ showBlogLink = true }: { showBlogLink?: boolean }) {
  return (
    <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b border-charcoal/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button
          onClick={goHome}
          className="flex items-center cursor-pointer focus:outline-none rounded-xl"
          aria-label="Back to home"
        >
          <CuvaLogo />
        </button>

        <div className="flex items-center space-x-2">
          {showBlogLink && (
            <button
              onClick={goToBlog}
              className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold text-charcoal/50 hover:text-charcoal hover:bg-white transition-all cursor-pointer"
            >
              <Newspaper className="w-4 h-4" />
              <span>All articles</span>
            </button>
          )}
          <button
            onClick={goHome}
            className="flex items-center space-x-2 bg-charcoal text-white px-4 py-2.5 rounded-full text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to site</span>
          </button>
        </div>
      </div>
    </header>
  );
}

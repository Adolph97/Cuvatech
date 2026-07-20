import React, { useState, useEffect } from 'react';
import { Save, FileText, Navigation, PanelBottom, UserCircle, Layers, MessageSquare, Megaphone } from 'lucide-react';
import { useContent } from '../../ContentStore';
import { TextField, RichTextField, Repeater } from './fields';

// Replicates AdminDashboard's admin auth header for protected PUTs.
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${sessionStorage.getItem('cuva_admin_token') || ''}`
});

type Draft = any;

const SECTIONS: Record<string, {
  label: string;
  icon: React.ReactNode;
  get: (c: any) => any;
  patch: (v: any, c: any) => Record<string, any>;
}> = {
  homepage: {
    label: 'Hero & Home',
    icon: <FileText className="w-4 h-4" />,
    get: (c) => c.homepage || {},
    patch: (v) => ({ homepage: v })
  },
  navbar: {
    label: 'Navbar',
    icon: <Navigation className="w-4 h-4" />,
    get: (c) => c.navbar || [],
    patch: (v) => ({ navbar: v })
  },
  footer: {
    label: 'Footer',
    icon: <PanelBottom className="w-4 h-4" />,
    get: (c) => c.footer || {},
    patch: (v) => ({ footer: v })
  },
  about: {
    label: 'About Us',
    icon: <UserCircle className="w-4 h-4" />,
    get: (c) => c.about || {},
    patch: (v) => ({ about: v })
  },
  services: {
    label: 'IT Services',
    icon: <Layers className="w-4 h-4" />,
    get: (c) => c.services || {},
    patch: (v) => ({ services: v })
  },
  testimonials: {
    label: 'Testimonials',
    icon: <MessageSquare className="w-4 h-4" />,
    get: (c) => c.testimonials || [],
    patch: (v) => ({ testimonials: v })
  },
  marketing: {
    label: 'Marketing',
    icon: <Megaphone className="w-4 h-4" />,
    get: (c) => (c.homepage && c.homepage.marketingSection) || {},
    patch: (v, c) => ({ homepage: { ...(c.homepage || {}), marketingSection: v } })
  }
};

export default function ContentManager() {
  const { content, setContent } = useContent();
  const [sub, setSub] = useState<string>('homepage');
  const [draft, setDraft] = useState<Draft>(() => SECTIONS['homepage'].get(content));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Re-seed the local draft whenever the active sub-tab or underlying content changes.
  useEffect(() => {
    setDraft(SECTIONS[sub].get(content));
    setSaved(false);
  }, [sub, content]);

  const set = (key: string, value: any) => setDraft((d: Draft) => ({ ...d, [key]: value }));
  const setN = (objKey: string, field: string, value: any) =>
    setDraft((d: Draft) => ({ ...d, [objKey]: { ...(d[objKey] || {}), [field]: value } }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const patch = SECTIONS[sub].patch(draft, content);
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(patch)
      });
      if (res.ok) {
        setContent(await res.json());
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        alert('Failed to save content.');
      }
    } catch {
      alert('Error connecting to server.');
    } finally {
      setSaving(false);
    }
  };

  const panelCls = 'bg-white border border-charcoal/5 rounded-[2.5rem] shadow-xl shadow-charcoal/5 p-8 space-y-6';
  const subHead = (t: string, s: string) => (
    <div className="mb-2">
      <h3 className="font-display text-xl font-bold text-charcoal">{t}</h3>
      <p className="text-xs text-charcoal/40 font-medium">{s}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Sub-tab switcher */}
      <div className="flex flex-wrap items-center gap-2 bg-white border border-charcoal/5 p-1.5 rounded-2xl w-fit">
        {Object.entries(SECTIONS).map(([id, sec]) => (
          <button
            key={id}
            onClick={() => setSub(id)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              sub === id ? 'bg-primary text-white shadow-sm' : 'text-charcoal/40 hover:bg-bg hover:text-charcoal'
            }`}
          >
            {sec.icon}
            <span>{sec.label}</span>
          </button>
        ))}
      </div>

      {/* Save bar */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest">
          Editing: {SECTIONS[sub].label}
        </span>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save changes'}</span>
        </button>
      </div>

      {/* ── HOMEPAGE / HERO ─────────────────────────────────────────────── */}
      {sub === 'homepage' && (
        <div className="space-y-6">
          <div className={panelCls}>
            {subHead('Hero', 'The opening headline and call-to-action buttons.')}
            <TextField label="Hero title" value={draft.heroTitle} onChange={(v) => set('heroTitle', v)} />
            <TextField label="Hero subtitle" textarea rows={3} value={draft.heroSubtitle} onChange={(v) => set('heroSubtitle', v)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField label="Primary CTA text" value={draft.heroCtaPrimary} onChange={(v) => set('heroCtaPrimary', v)} />
              <TextField label="Secondary CTA text" value={draft.heroCtaSecondary} onChange={(v) => set('heroCtaSecondary', v)} />
            </div>
            <Repeater
              label="Stat counters"
              items={draft.stats || []}
              onChange={(arr) => set('stats', arr)}
              addItem={() => ({ value: '0', label: '' })}
              addLabel="Add stat"
              renderRow={(item, onItemChange) => (
                <div className="grid grid-cols-2 gap-3">
                  <TextField label="Value" value={item.value} onChange={(v) => onItemChange({ value: v })} />
                  <TextField label="Label" value={item.label} onChange={(v) => onItemChange({ label: v })} />
                </div>
              )}
            />
          </div>

          <div className={panelCls}>
            {subHead('Core overview', 'The three-practice summary grid on the homepage.')}
            <TextField label="Eyebrow" value={draft.coreOverview?.eyebrow} onChange={(v) => setN('coreOverview', 'eyebrow', v)} />
            <TextField label="Title" value={draft.coreOverview?.title} onChange={(v) => setN('coreOverview', 'title', v)} />
            <Repeater
              label="Practice cards"
              items={draft.coreOverview?.cards || []}
              onChange={(arr) => setN('coreOverview', 'cards', arr)}
              addItem={() => ({ title: '', description: '' })}
              addLabel="Add card"
              renderRow={(item, onItemChange) => (
                <div className="space-y-3">
                  <TextField label="Card title" value={item.title} onChange={(v) => onItemChange({ title: v })} />
                  <TextField label="Card description" textarea rows={2} value={item.description} onChange={(v) => onItemChange({ description: v })} />
                </div>
              )}
            />
          </div>

          <div className={panelCls}>
            {subHead('Section headings', 'Titles & intro copy for the Branding and IT sections.')}
            <TextField label="Branding section title" value={draft.brandingSection?.title} onChange={(v) => setN('brandingSection', 'title', v)} />
            <TextField label="Branding section subtitle" textarea rows={2} value={draft.brandingSection?.subtitle} onChange={(v) => setN('brandingSection', 'subtitle', v)} />
            <TextField label="IT section title" value={draft.itSection?.title} onChange={(v) => setN('itSection', 'title', v)} />
            <TextField label="IT section subtitle" textarea rows={2} value={draft.itSection?.subtitle} onChange={(v) => setN('itSection', 'subtitle', v)} />
          </div>
        </div>
      )}

      {/* ── NAVBAR ──────────────────────────────────────────────────────── */}
      {sub === 'navbar' && (
        <div className={panelCls}>
          {subHead('Navbar', 'Top navigation links. The id is the on-page scroll target; keep it stable.')}
          <Repeater
            items={Array.isArray(content.navbar) ? content.navbar : []}
            onChange={(arr) => { setContent({ ...content, navbar: arr }); setDraft(arr); }}
            addItem={() => ({ id: 'new-link', label: 'New Link' })}
            addLabel="Add nav item"
            renderRow={(item, onItemChange) => (
              <div className="grid grid-cols-2 gap-3">
                <TextField label="Label" value={item.label} onChange={(v) => onItemChange({ label: v })} />
                <TextField label="Target id" value={item.id} onChange={(v) => onItemChange({ id: v })} />
              </div>
            )}
          />
        </div>
      )}

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      {sub === 'footer' && (
        <div className={panelCls}>
          {subHead('Footer', 'Bottom-of-page brand copy and link columns.')}
          <TextField label="Tagline" textarea rows={3} value={draft.tagline} onChange={(v) => set('tagline', v)} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <TextField label="Newsletter eyebrow" value={draft.newsletterEyebrow} onChange={(v) => set('newsletterEyebrow', v)} />
            <TextField label="Newsletter title" value={draft.newsletterTitle} onChange={(v) => set('newsletterTitle', v)} />
            <TextField label="Copyright" value={draft.copyright} onChange={(v) => set('copyright', v)} />
          </div>
          <TextField label="Newsletter subtitle" textarea rows={2} value={draft.newsletterSubtitle} onChange={(v) => set('newsletterSubtitle', v)} />
          <Repeater
            label="Link columns"
            items={draft.columns || []}
            onChange={(arr) => set('columns', arr)}
            addItem={() => ({ title: 'New Column', links: [] })}
            addLabel="Add column"
            renderRow={(item, onItemChange) => (
              <div className="space-y-4">
                <TextField label="Column title" value={item.title} onChange={(v) => onItemChange({ title: v })} />
                <Repeater
                  label="Links"
                  items={item.links || []}
                  onChange={(links) => onItemChange({ links })}
                  addItem={() => ({ label: '', target: '' })}
                  addLabel="Add link"
                  renderRow={(link, onLinkChange) => (
                    <div className="grid grid-cols-2 gap-3">
                      <TextField label="Label" value={link.label} onChange={(v) => onLinkChange({ label: v })} />
                      <TextField label="Target (section id or 'admin')" value={link.target} onChange={(v) => onLinkChange({ target: v })} />
                    </div>
                  )}
                />
              </div>
            )}
          />
        </div>
      )}

      {/* ── ABOUT US ────────────────────────────────────────────────────── */}
      {sub === 'about' && (
        <div className="space-y-6">
          <div className={panelCls}>
            {subHead('About — header', 'Section heading and intro.')}
            <TextField label="Eyebrow" value={draft.eyebrow} onChange={(v) => set('eyebrow', v)} />
            <TextField label="Title (before accent)" value={draft.title} onChange={(v) => set('title', v)} />
            <TextField label="Title accent (highlighted)" value={draft.titleAccent} onChange={(v) => set('titleAccent', v)} />
            <TextField label="Subtitle" textarea rows={3} value={draft.subtitle} onChange={(v) => set('subtitle', v)} />
            <TextField label="Story button text" value={draft.storyButton} onChange={(v) => set('storyButton', v)} />
          </div>

          <div className={panelCls}>
            {subHead('About — story modal', 'The "Read Our Full Story" modal copy.')}
            <TextField label="Modal eyebrow" value={draft.modalEyebrow} onChange={(v) => set('modalEyebrow', v)} />
            <TextField label="Modal title" value={draft.modalTitle} onChange={(v) => set('modalTitle', v)} />
            <TextField label="Story heading" value={draft.story?.heading} onChange={(v) => setN('story', 'heading', v)} />
            <StringList
              label="Story paragraphs"
              items={draft.story?.paragraphs || []}
              onChange={(arr) => setN('story', 'paragraphs', arr)}
              addLabel="Add paragraph"
              placeholder="Write a paragraph…"
            />
            <TextField label="Mission label" value={draft.story?.missionLabel} onChange={(v) => setN('story', 'missionLabel', v)} />
            <TextField label="Mission statement" textarea rows={3} value={draft.story?.mission} onChange={(v) => setN('story', 'mission', v)} />
            <TextField label="Vision label" value={draft.story?.visionLabel} onChange={(v) => setN('story', 'visionLabel', v)} />
            <TextField label="Vision statement" textarea rows={3} value={draft.story?.vision} onChange={(v) => setN('story', 'vision', v)} />
            <Repeater
              label="Principles"
              items={draft.story?.principles || []}
              onChange={(arr) => setN('story', 'principles', arr)}
              addItem={() => ({ eyebrow: '', title: '', text: '' })}
              addLabel="Add principle"
              renderRow={(item, onItemChange) => (
                <div className="space-y-3">
                  <TextField label="Eyebrow" value={item.eyebrow} onChange={(v) => onItemChange({ eyebrow: v })} />
                  <TextField label="Title" value={item.title} onChange={(v) => onItemChange({ title: v })} />
                  <TextField label="Text" textarea rows={2} value={item.text} onChange={(v) => onItemChange({ text: v })} />
                </div>
              )}
            />
          </div>

          <div className={panelCls}>
            {subHead('About — team', 'Team section heading.')}
            <TextField label="Team eyebrow" value={draft.teamEyebrow} onChange={(v) => set('teamEyebrow', v)} />
            <TextField label="Team title" value={draft.teamTitle} onChange={(v) => set('teamTitle', v)} />
          </div>
        </div>
      )}

      {/* ── IT SERVICES ─────────────────────────────────────────────────── */}
      {sub === 'services' && (
        <div className="space-y-6">
          <div className={panelCls}>
            {subHead('IT Services', 'The service cards shown on the homepage.')}
            <Repeater
              items={draft.it || []}
              onChange={(arr) => set('it', arr)}
              addItem={() => ({ id: `service-${Date.now()}`, title: '', tagline: '', description: '', bullets: [] })}
              addLabel="Add service"
              renderRow={(item, onItemChange) => (
                <div className="space-y-3">
                  <TextField label="Id (stable key)" value={item.id} onChange={(v) => onItemChange({ id: v })} />
                  <TextField label="Title" value={item.title} onChange={(v) => onItemChange({ title: v })} />
                  <TextField label="Tagline" value={item.tagline} onChange={(v) => onItemChange({ tagline: v })} />
                  <TextField label="Description" textarea rows={2} value={item.description} onChange={(v) => onItemChange({ description: v })} />
                  <StringList
                    label="Bullets"
                    items={item.bullets || []}
                    onChange={(bullets) => onItemChange({ bullets })}
                    addLabel="Add bullet"
                    placeholder="List item…"
                  />
                </div>
              )}
            />
          </div>

          <div className={panelCls}>
            {subHead('IT banner', 'The consultation CTA banner beneath the services.')}
            <TextField label="Title" value={draft.itBanner?.title} onChange={(v) => setN('itBanner', 'title', v)} />
            <TextField label="Text" textarea rows={2} value={draft.itBanner?.text} onChange={(v) => setN('itBanner', 'text', v)} />
            <TextField label="Button text" value={draft.itBanner?.cta} onChange={(v) => setN('itBanner', 'cta', v)} />
          </div>
        </div>
      )}

      {/* ── TESTIMONIALS ────────────────────────────────────────────────── */}
      {sub === 'testimonials' && (
        <div className={panelCls}>
          {subHead('Testimonials', 'Client reviews displayed in the slider.')}
          <Repeater
            items={Array.isArray(content.testimonials) ? content.testimonials : []}
            onChange={(arr) => { setContent({ ...content, testimonials: arr }); setDraft(arr); }}
            addItem={() => ({ id: `t-${Date.now()}`, name: '', company: '', sector: '', role: '', review: '', rating: 5, serviceType: 'IT', date: 'Just now' })}
            addLabel="Add testimonial"
            renderRow={(item, onItemChange) => (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextField label="Name" value={item.name} onChange={(v) => onItemChange({ name: v })} />
                  <TextField label="Company" value={item.company} onChange={(v) => onItemChange({ company: v })} />
                  <TextField label="Role" value={item.role} onChange={(v) => onItemChange({ role: v })} />
                  <TextField label="Sector" value={item.sector} onChange={(v) => onItemChange({ sector: v })} />
                </div>
                <TextField label="Review" textarea rows={3} value={item.review} onChange={(v) => onItemChange({ review: v })} />
                <div className="grid grid-cols-2 gap-3">
                  <TextField label="Rating (e.g. 4.9)" value={String(item.rating)} onChange={(v) => onItemChange({ rating: Number(v) || 0 })} />
                  <TextField label="Date" value={item.date} onChange={(v) => onItemChange({ date: v })} />
                </div>
                <TextField label="Service type" value={item.serviceType} onChange={(v) => onItemChange({ serviceType: v })} />
              </div>
            )}
          />
        </div>
      )}

      {/* ── MARKETING ───────────────────────────────────────────────────── */}
      {sub === 'marketing' && (
        <div className="space-y-6">
          <div className={panelCls}>
            {subHead('Marketing — header', 'Section title & intro shown above the tab switcher.')}
            <TextField label="Title" value={draft.title} onChange={(v) => set('title', v)} />
            <TextField label="Subtitle" textarea rows={3} value={draft.subtitle} onChange={(v) => set('subtitle', v)} />
          </div>

          <div className={panelCls}>
            {subHead('SEO tab', 'Copy for the SEO Engine tab.')}
            <TextField label="Eyebrow" value={draft.seo?.eyebrow} onChange={(v) => setN('seo', 'eyebrow', v)} />
            <TextField label="Headline (before accent)" value={draft.seo?.headline} onChange={(v) => setN('seo', 'headline', v)} />
            <TextField label="Headline accent" value={draft.seo?.headlineAccent} onChange={(v) => setN('seo', 'headlineAccent', v)} />
            <TextField label="Description" textarea rows={3} value={draft.seo?.description} onChange={(v) => setN('seo', 'description', v)} />
            <StringList
              label="Bullet points"
              items={draft.seo?.bullets || []}
              onChange={(arr) => setN('seo', 'bullets', arr)}
              addLabel="Add bullet"
              placeholder="List item…"
            />
          </div>

          <div className={panelCls}>
            {subHead('Ads tab', 'Copy for the Paid Campaigns tab.')}
            <TextField label="Eyebrow" value={draft.ads?.eyebrow} onChange={(v) => setN('ads', 'eyebrow', v)} />
            <TextField label="Headline (before accent)" value={draft.ads?.headline} onChange={(v) => setN('ads', 'headline', v)} />
            <TextField label="Headline accent" value={draft.ads?.headlineAccent} onChange={(v) => setN('ads', 'headlineAccent', v)} />
            <TextField label="Description" textarea rows={3} value={draft.ads?.description} onChange={(v) => setN('ads', 'description', v)} />
            <TextField label="Did you know?" textarea rows={2} value={draft.ads?.didYouKnow} onChange={(v) => setN('ads', 'didYouKnow', v)} />
          </div>

          <div className={panelCls}>
            {subHead('Social tab', 'Copy for the Social Strategy tab.')}
            <TextField label="Eyebrow" value={draft.social?.eyebrow} onChange={(v) => setN('social', 'eyebrow', v)} />
            <TextField label="Headline (before accent)" value={draft.social?.headline} onChange={(v) => setN('social', 'headline', v)} />
            <TextField label="Headline accent" value={draft.social?.headlineAccent} onChange={(v) => setN('social', 'headlineAccent', v)} />
            <TextField label="Description" textarea rows={3} value={draft.social?.description} onChange={(v) => setN('social', 'description', v)} />
          </div>

          <div className={panelCls}>
            {subHead('Analytics & Email tab', 'Copy for the Analytics & Email tab.')}
            <TextField label="Eyebrow" value={draft.analytics?.eyebrow} onChange={(v) => setN('analytics', 'eyebrow', v)} />
            <TextField label="Headline (before accent)" value={draft.analytics?.headline} onChange={(v) => setN('analytics', 'headline', v)} />
            <TextField label="Headline accent" value={draft.analytics?.headlineAccent} onChange={(v) => setN('analytics', 'headlineAccent', v)} />
            <TextField label="Description" textarea rows={3} value={draft.analytics?.description} onChange={(v) => setN('analytics', 'description', v)} />
            <StringList
              label="Bullet points"
              items={draft.analytics?.bullets || []}
              onChange={(arr) => setN('analytics', 'bullets', arr)}
              addLabel="Add bullet"
              placeholder="List item…"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Small inline editor for a list of plain strings (paragraphs, bullets).
function StringList({
  label,
  items,
  onChange,
  addLabel,
  placeholder
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  addLabel: string;
  placeholder?: string;
}) {
  return (
    <div>
      <span className="font-sans text-[10px] font-bold text-charcoal/30 uppercase tracking-[0.2em] block mb-2">{label}</span>
      <div className="space-y-2">
        {items.map((text, i) => (
          <div key={i} className="flex items-start gap-2">
            <textarea
              className="flex-1 bg-bg border border-charcoal/5 px-4 py-2.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              rows={2}
              value={text}
              placeholder={placeholder}
              onChange={(e) => onChange(items.map((t, j) => (j === i ? e.target.value : t)))}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="mt-1 px-3 py-2 rounded-xl text-red-400 hover:bg-red-50 transition-colors text-xs font-bold"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, ''])}
        className="mt-2 inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2.5 rounded-2xl text-xs font-bold hover:bg-primary/20 transition-all"
      >
        + {addLabel}
      </button>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useStore, KnowledgeSource, WikiPage, KBSourceType } from '@/lib/store';

const SOURCE_TYPES: { value: KBSourceType; label: string; icon: string }[] = [
  { value: 'article', label: 'Article', icon: 'article' },
  { value: 'book', label: 'Book', icon: 'menu_book' },
  { value: 'podcast', label: 'Podcast', icon: 'podcasts' },
  { value: 'meeting', label: 'Meeting', icon: 'groups' },
  { value: 'note', label: 'Note', icon: 'sticky_note_2' },
  { value: 'research', label: 'Research', icon: 'science' },
];

type Tab = 'sources' | 'wiki' | 'log';

export default function KnowledgeBasePage() {
  const store = useStore();
  const [activeTab, setActiveTab] = useState<Tab>('sources');
  const [showAddSource, setShowAddSource] = useState(false);
  const [selectedPage, setSelectedPage] = useState<WikiPage | null>(null);
  const [queryInput, setQueryInput] = useState('');
  const [queryAnswer, setQueryAnswer] = useState<{ answer: string; citations: string[] } | null>(
    null
  );
  const [queryLoading, setQueryLoading] = useState(false);
  const [ingestingId, setIngestingId] = useState<string | null>(null);
  const [lintReport, setLintReport] = useState<string | null>(null);
  const [lintLoading, setLintLoading] = useState(false);

  // Add source form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<KBSourceType>('article');

  // Load KB data on mount
  useEffect(() => {
    store.loadKnowledgeBase();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleAddSource() {
    if (!newTitle.trim() || !newContent.trim()) return;
    try {
      const source = await store.addKnowledgeSource({
        title: newTitle.trim(),
        content: newContent.trim(),
        sourceType: newType,
        metadata: {},
      });
      setNewTitle('');
      setNewContent('');
      setShowAddSource(false);

      // Auto-ingest
      setIngestingId(source.id);
      await store.ingestSource(source.id);
      setIngestingId(null);
    } catch {
      setIngestingId(null);
    }
  }

  async function handleIngest(sourceId: string) {
    setIngestingId(sourceId);
    try {
      await store.ingestSource(sourceId);
    } finally {
      setIngestingId(null);
    }
  }

  async function handleQuery() {
    if (!queryInput.trim()) return;
    setQueryLoading(true);
    setQueryAnswer(null);
    try {
      const result = await store.queryKnowledgeBase(queryInput.trim());
      setQueryAnswer(result);
    } finally {
      setQueryLoading(false);
    }
  }

  async function handleLint() {
    setLintLoading(true);
    setLintReport(null);
    try {
      const result = await store.lintKnowledgeBase();
      setLintReport(result.report);
    } finally {
      setLintLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-['Playfair_Display'] text-[#F5F5F5] mb-2">
              Knowledge Base
            </h1>
            <p className="text-[#9CA3AF] font-['Space_Grotesk'] tracking-wide">
              Your AI-powered second brain. Drop sources in, get a compounding wiki out.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleLint}
              disabled={lintLoading || store.wikiPages.length === 0}
              className="px-4 py-2.5 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-[#9CA3AF] hover:text-[#F5F5F5] hover:border-[#C17A72]/30 transition-colors disabled:opacity-40"
            >
              {lintLoading ? 'Checking...' : 'Health Check'}
            </button>
            <button
              onClick={() => setShowAddSource(true)}
              className="btn-glow px-5 py-2.5 rounded-xl text-sm font-medium"
            >
              + Add Source
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex gap-6 mt-6">
          <div className="glass-card px-4 py-2 rounded-xl">
            <span className="text-xs text-[#9CA3AF] font-['Space_Grotesk']">Sources</span>
            <span className="ml-2 text-lg font-bold text-[#F5F5F5]">
              {store.knowledgeSources.length}
            </span>
          </div>
          <div className="glass-card px-4 py-2 rounded-xl">
            <span className="text-xs text-[#9CA3AF] font-['Space_Grotesk']">Wiki Pages</span>
            <span className="ml-2 text-lg font-bold text-[#F5F5F5]">{store.wikiPages.length}</span>
          </div>
          <div className="glass-card px-4 py-2 rounded-xl">
            <span className="text-xs text-[#9CA3AF] font-['Space_Grotesk']">Activity</span>
            <span className="ml-2 text-lg font-bold text-[#F5F5F5]">{store.wikiLog.length}</span>
          </div>
        </div>
      </div>

      {/* Query bar */}
      <div className="glass-card p-3 rounded-xl mb-4 flex gap-3">
        <input
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
          placeholder="Ask your knowledge base a question..."
          className="flex-1 bg-transparent border-none outline-none text-sm text-[#F5F5F5] placeholder:text-[#6B7280]"
        />
        <button
          onClick={handleQuery}
          disabled={queryLoading || !queryInput.trim()}
          className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[#C17A72]/20 text-[#C17A72] hover:bg-[#C17A72]/30 transition-colors disabled:opacity-40"
        >
          {queryLoading ? 'Thinking...' : 'Query'}
        </button>
      </div>

      {/* Query answer */}
      {queryAnswer && (
        <div className="glass-card p-5 rounded-xl mb-4 border border-[#C17A72]/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-sm text-[#C17A72]">smart_toy</span>
            <span className="text-xs font-['Space_Grotesk'] text-[#C17A72] uppercase tracking-wider font-bold">
              Answer
            </span>
            <button
              onClick={() => setQueryAnswer(null)}
              className="ml-auto text-[#6B7280] hover:text-[#F5F5F5]"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
          <div className="text-sm text-[#BEC6DF] leading-relaxed whitespace-pre-wrap">
            {queryAnswer.answer}
          </div>
          {queryAnswer.citations.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 flex-wrap">
              <span className="text-[10px] text-[#6B7280]">Sources:</span>
              {queryAnswer.citations.map((slug) => (
                <span
                  key={slug}
                  className="text-[10px] px-2 py-0.5 rounded bg-[#C17A72]/10 text-[#C17A72]"
                >
                  [[{slug}]]
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lint report */}
      {lintReport && (
        <div className="glass-card p-5 rounded-xl mb-4 border border-yellow-500/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-sm text-yellow-400">
              health_and_safety
            </span>
            <span className="text-xs font-['Space_Grotesk'] text-yellow-400 uppercase tracking-wider font-bold">
              Health Report
            </span>
            <button
              onClick={() => setLintReport(null)}
              className="ml-auto text-[#6B7280] hover:text-[#F5F5F5]"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
          <div className="text-sm text-[#BEC6DF] leading-relaxed whitespace-pre-wrap">
            {lintReport}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white/5 rounded-lg p-1 w-fit">
        {(['sources', 'wiki', 'log'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-['Space_Grotesk'] transition-colors ${
              activeTab === tab
                ? 'bg-[#C17A72]/20 text-[#C17A72] font-semibold'
                : 'text-[#9CA3AF] hover:text-[#F5F5F5]'
            }`}
          >
            {tab === 'sources' ? 'Raw Sources' : tab === 'wiki' ? 'Wiki' : 'Activity Log'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'sources' && (
          <div className="space-y-3">
            {store.knowledgeSources.length === 0 ? (
              <EmptyState
                icon="source"
                title="No sources yet"
                description="Add articles, book notes, podcast takeaways, meeting transcripts — anything you want your AI to synthesize."
              />
            ) : (
              store.knowledgeSources.map((source) => (
                <SourceCard
                  key={source.id}
                  source={source}
                  isIngesting={ingestingId === source.id}
                  onIngest={() => handleIngest(source.id)}
                  onDelete={() => store.deleteKnowledgeSource(source.id)}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'wiki' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {store.wikiPages.length === 0 ? (
              <EmptyState
                icon="auto_stories"
                title="Wiki is empty"
                description="Add sources and your AI will build wiki pages automatically — summaries, concepts, connections."
              />
            ) : selectedPage ? (
              <div className="col-span-2">
                <button
                  onClick={() => setSelectedPage(null)}
                  className="text-xs text-[#9CA3AF] hover:text-[#F5F5F5] mb-4 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Back to all pages
                </button>
                <div className="glass-card p-6 rounded-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#C17A72]/20 text-[#C17A72]">
                      {selectedPage.category}
                    </span>
                    <button
                      onClick={() => {
                        store.deleteWikiPage(selectedPage.id);
                        setSelectedPage(null);
                      }}
                      className="ml-auto text-[#6B7280] hover:text-red-400 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                  <h2 className="text-2xl font-['Playfair_Display'] text-[#F5F5F5] mb-4">
                    {selectedPage.title}
                  </h2>
                  <pre className="text-sm text-[#BEC6DF] whitespace-pre-wrap leading-relaxed font-['Inter']">
                    {selectedPage.content}
                  </pre>
                  {selectedPage.linkedPageSlugs.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <span className="text-xs text-[#9CA3AF]">Linked pages: </span>
                      {selectedPage.linkedPageSlugs.map((slug) => (
                        <button
                          key={slug}
                          onClick={() => {
                            const linked = store.wikiPages.find((p) => p.slug === slug);
                            if (linked) setSelectedPage(linked);
                          }}
                          className="text-xs text-[#C17A72] mr-2 hover:underline"
                        >
                          [[{slug}]]
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              store.wikiPages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => setSelectedPage(page)}
                  className="glass-card p-5 rounded-xl text-left hover:border-[#C17A72]/30 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#C17A72]/20 text-[#C17A72]">
                      {page.category}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[#F5F5F5] mb-1">{page.title}</h3>
                  <p className="text-xs text-[#9CA3AF] line-clamp-2">
                    {page.content.slice(0, 120)}...
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-[10px] text-[#6B7280]">
                    <span>
                      {page.linkedSourceIds.length} source{page.linkedSourceIds.length !== 1 && 's'}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#6B7280]" />
                    <span>{new Date(page.updatedAt).toLocaleDateString()}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {activeTab === 'log' && (
          <div className="space-y-2">
            {store.wikiLog.length === 0 ? (
              <EmptyState
                icon="history"
                title="No activity yet"
                description="Ingests, queries, and health checks will appear here as a timeline."
              />
            ) : (
              store.wikiLog.map((entry) => (
                <div
                  key={entry.id}
                  className="glass-card px-4 py-3 rounded-xl flex items-center gap-3"
                >
                  <span
                    className={`material-symbols-outlined text-base ${
                      entry.action === 'ingest'
                        ? 'text-green-400'
                        : entry.action === 'query'
                          ? 'text-blue-400'
                          : entry.action === 'lint'
                            ? 'text-yellow-400'
                            : 'text-[#9CA3AF]'
                    }`}
                  >
                    {entry.action === 'ingest'
                      ? 'download'
                      : entry.action === 'query'
                        ? 'search'
                        : entry.action === 'lint'
                          ? 'health_and_safety'
                          : 'edit'}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-[#F5F5F5]">{entry.description}</p>
                    {entry.pagesAffected.length > 0 && (
                      <p className="text-[10px] text-[#6B7280] mt-0.5">
                        Pages: {entry.pagesAffected.join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] text-[#6B7280]">
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Add Source Modal */}
      {showAddSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card p-8 rounded-2xl w-full max-w-lg mx-4">
            <h2 className="text-2xl font-['Playfair_Display'] text-[#F5F5F5] mb-6">Add Source</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#9CA3AF] font-['Space_Grotesk'] mb-1 block">
                  Title
                </label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Article title, book name, etc."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#F5F5F5] outline-none focus:border-[#C17A72]/50"
                />
              </div>

              <div>
                <label className="text-xs text-[#9CA3AF] font-['Space_Grotesk'] mb-1 block">
                  Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {SOURCE_TYPES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setNewType(t.value)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        newType === t.value
                          ? 'bg-[#C17A72]/20 text-[#C17A72] border border-[#C17A72]/30'
                          : 'bg-white/5 text-[#9CA3AF] border border-white/10 hover:text-[#F5F5F5]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">{t.icon}</span>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-[#9CA3AF] font-['Space_Grotesk'] mb-1 block">
                  Content
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste article text, notes, transcript, highlights..."
                  rows={10}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#F5F5F5] outline-none focus:border-[#C17A72]/50 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddSource(false)}
                className="px-4 py-2 text-sm text-[#9CA3AF] hover:text-[#F5F5F5] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSource}
                disabled={!newTitle.trim() || !newContent.trim()}
                className="btn-glow px-5 py-2 rounded-xl text-sm font-medium disabled:opacity-40"
              >
                Add & Ingest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SourceCard({
  source,
  isIngesting,
  onIngest,
  onDelete,
}: {
  source: KnowledgeSource;
  isIngesting: boolean;
  onIngest: () => void;
  onDelete: () => void;
}) {
  const typeInfo = SOURCE_TYPES.find((t) => t.value === source.sourceType);
  return (
    <div className="glass-card p-4 rounded-xl flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
        <span className="material-symbols-outlined text-[#C17A72]">
          {typeInfo?.icon || 'description'}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-[#F5F5F5] truncate">{source.title}</h3>
          <span
            className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
              source.status === 'ingested'
                ? 'bg-green-500/20 text-green-400'
                : source.status === 'processing'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : source.status === 'failed'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-white/10 text-[#9CA3AF]'
            }`}
          >
            {isIngesting ? 'processing' : source.status}
          </span>
        </div>
        <p className="text-xs text-[#9CA3AF] mt-1 line-clamp-1">{source.content.slice(0, 100)}</p>
        <div className="flex items-center gap-2 mt-2 text-[10px] text-[#6B7280]">
          <span>{typeInfo?.label}</span>
          <span className="w-1 h-1 rounded-full bg-[#6B7280]" />
          <span>{new Date(source.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {source.status === 'pending' || source.status === 'failed' ? (
          <button
            onClick={onIngest}
            disabled={isIngesting}
            className="text-[#C17A72] hover:text-[#F5F5F5] transition-colors p-1 disabled:opacity-40"
            title="Ingest with AI"
          >
            <span className="material-symbols-outlined text-base">play_arrow</span>
          </button>
        ) : null}
        <button
          onClick={onDelete}
          className="text-[#6B7280] hover:text-red-400 transition-colors p-1"
        >
          <span className="material-symbols-outlined text-base">delete</span>
        </button>
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center py-16 col-span-2">
      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-[#C17A72]/10 border border-[#C17A72]/20">
        <span className="material-symbols-outlined text-2xl text-[#C17A72]">{icon}</span>
      </div>
      <h3 className="text-lg font-['Playfair_Display'] text-[#F5F5F5] mb-2">{title}</h3>
      <p className="text-sm text-[#9CA3AF] max-w-md mx-auto">{description}</p>
    </div>
  );
}

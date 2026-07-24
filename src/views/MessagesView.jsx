const MessagesView = () => {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
          Inbox
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Messages</h1>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-500">
          No new messages right now.
        </div>
      </section>
    </div>
  );
};

export default MessagesView;

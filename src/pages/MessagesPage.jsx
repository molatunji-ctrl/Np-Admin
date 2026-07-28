import { useBackendData } from "../hooks/useBackendData";
import { fetchMessages } from "../lib/api";

const MessagesPage = () => {
  const { data, loading, error } = useBackendData(fetchMessages, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
          Inbox
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Messages</h1>
      </div>

      {error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Backend unavailable. No messages to display right now.
        </div>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {loading && !data ? (
          <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-500">
            Loading messages...
          </div>
        ) : (data || []).length > 0 ? (
          <div className="space-y-3">
            {(data || []).map((message) => (
              <div key={message.id} className="rounded-2xl border border-slate-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900">{message.sender}</p>
                  {message.unread && (
                    <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                      New
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-500">{message.preview}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-500">
            No new messages right now.
          </div>
        )}
      </section>
    </div>
  );
};

export default MessagesPage;

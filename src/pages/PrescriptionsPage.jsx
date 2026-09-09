import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Eye, FileText, XCircle } from "lucide-react";
import {
  fetchPrescriptionFile,
  fetchPrescriptions,
  reviewPrescription,
} from "../lib/api";

const filters = ["PENDING", "APPROVED", "REJECTED", "ALL"];

const statusStyles = {
  PENDING: "bg-amber-50 text-amber-700",
  APPROVED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-rose-50 text-rose-700",
};

function readableSize(bytes) {
  const value = Number(bytes || 0);
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

const PrescriptionsPage = () => {
  const [status, setStatus] = useState("PENDING");
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewing, setReviewing] = useState(null);
  const [decision, setDecision] = useState("APPROVED");
  const [approvedQuantity, setApprovedQuantity] = useState(1);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [openingId, setOpeningId] = useState(null);

  const loadPrescriptions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setPrescriptions(await fetchPrescriptions(status));
    } catch (loadError) {
      setError(loadError.message || "Unable to load prescriptions.");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    loadPrescriptions();
  }, [loadPrescriptions]);

  const openReview = (prescription, nextDecision) => {
    setReviewing(prescription);
    setDecision(nextDecision);
    setApprovedQuantity(prescription.requestedQuantity || 1);
    setReason("");
    setError("");
  };

  const submitReview = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const updated = await reviewPrescription(reviewing.id, {
        status: decision,
        approvedQuantity: decision === "APPROVED" ? Number(approvedQuantity) : null,
        reason: reason.trim() || null,
      });
      setPrescriptions((current) => current
        .map((item) => item.id === updated.id ? updated : item)
        .filter((item) => status === "ALL" || item.status === status));
      setReviewing(null);
    } catch (reviewError) {
      setError(reviewError.message || "Unable to save this review.");
    } finally {
      setSaving(false);
    }
  };

  const viewFile = async (prescription) => {
    setOpeningId(prescription.id);
    setError("");
    try {
      const blob = await fetchPrescriptionFile(prescription.id);
      const objectUrl = URL.createObjectURL(blob);
      window.open(objectUrl, "_blank", "noopener,noreferrer");
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
    } catch (fileError) {
      setError(fileError.message || "Unable to open this prescription file.");
    } finally {
      setOpeningId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Pharmacist review</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Prescriptions</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-500">
          Review private customer documents and approve only the verified medicine quantity.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setStatus(filter)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              status === filter ? "bg-slate-900 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {error && (
        <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {loading ? (
          <div className="flex h-64 items-center justify-center text-slate-500">Loading prescriptions...</div>
        ) : prescriptions.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-500">
            No {status === "ALL" ? "" : status.toLowerCase()} prescriptions found.
          </div>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((prescription) => (
              <article key={prescription.id} className="rounded-2xl border border-slate-200 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-slate-100 p-3 text-slate-600"><FileText size={24} /></div>
                    <div>
                      <h2 className="font-semibold text-slate-900">{prescription.productName}</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {prescription.customerName} · {prescription.customerEmail}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Requested quantity: {prescription.requestedQuantity} · {prescription.fileName} ({readableSize(prescription.fileSize)})
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {new Date(prescription.createdAt).toLocaleString("en-NG")}
                      </p>
                    </div>
                  </div>

                  <span className={`rounded-full px-4 py-1.5 text-xs font-semibold ${statusStyles[prescription.status] || "bg-slate-100 text-slate-600"}`}>
                    {prescription.status}
                  </span>
                </div>

                {prescription.status === "APPROVED" && (
                  <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
                    Approved: {prescription.approvedQuantity} · Used: {prescription.usedQuantity} · Available: {prescription.availableQuantity}
                  </p>
                )}
                {prescription.reviewReason && (
                  <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                    Review note: {prescription.reviewReason}
                  </p>
                )}
                {prescription.reviewedBy && (
                  <p className="mt-2 text-xs text-slate-400">
                    Reviewed by {prescription.reviewedBy}{prescription.reviewedAt ? ` on ${new Date(prescription.reviewedAt).toLocaleString("en-NG")}` : ""}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => viewFile(prescription)}
                    disabled={openingId === prescription.id}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-60"
                  >
                    <Eye size={17} /> {openingId === prescription.id ? "Opening..." : "View file"}
                  </button>

                  {prescription.status === "PENDING" && (
                    <>
                      <button
                        type="button"
                        onClick={() => openReview(prescription, "APPROVED")}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                      >
                        <CheckCircle2 size={17} /> Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => openReview(prescription, "REJECTED")}
                        className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
                      >
                        <XCircle size={17} /> Reject
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {reviewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button type="button" aria-label="Close review" className="absolute inset-0 bg-black/40" onClick={() => setReviewing(null)} />
          <form onSubmit={submitReview} className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-semibold text-slate-900">
              {decision === "APPROVED" ? "Approve" : "Reject"} prescription
            </h2>
            <p className="mt-2 text-sm text-slate-500">{reviewing.productName} for {reviewing.customerName}</p>

            {decision === "APPROVED" && (
              <div className="mt-5">
                <label htmlFor="approvedQuantity" className="block text-sm font-semibold text-slate-700">Approved quantity</label>
                <input
                  id="approvedQuantity"
                  type="number"
                  min="1"
                  max={reviewing.requestedQuantity}
                  value={approvedQuantity}
                  onChange={(event) => setApprovedQuantity(event.target.value)}
                  required
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4"
                />
              </div>
            )}

            <div className="mt-5">
              <label htmlFor="reviewReason" className="block text-sm font-semibold text-slate-700">
                Pharmacist note {decision === "REJECTED" ? "(required)" : "(optional)"}
              </label>
              <textarea
                id="reviewReason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                required={decision === "REJECTED"}
                maxLength={1000}
                rows={4}
                className="mt-2 w-full rounded-xl border border-slate-200 p-4"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setReviewing(null)} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
              <button type="submit" disabled={saving} className={`rounded-xl px-5 py-2 text-sm font-semibold text-white disabled:opacity-60 ${decision === "APPROVED" ? "bg-emerald-600" : "bg-rose-600"}`}>
                {saving ? "Saving..." : `Confirm ${decision.toLowerCase()}`}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PrescriptionsPage;

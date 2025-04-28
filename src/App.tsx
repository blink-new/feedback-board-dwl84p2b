
import React, { useState } from "react";
import { Plus, ThumbsUp } from "lucide-react";
import { Dialog } from "@headlessui/react";

type Feedback = {
  id: string;
  title: string;
  description: string;
  votes: number;
};

const initialFeedback: Feedback[] = [];

function randomId() {
  return Math.random().toString(36).substr(2, 9);
}

const palette = {
  bg: "bg-gradient-to-br from-blue-50 via-white to-pink-50",
  card: "bg-white shadow-lg rounded-xl p-6 transition hover:shadow-2xl",
  accent: "bg-blue-600 text-white hover:bg-blue-700",
  upvote: "bg-pink-100 text-pink-600 hover:bg-pink-200",
  upvoted: "bg-pink-600 text-white",
  modalBg: "bg-white rounded-2xl shadow-2xl p-8",
  input: "border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200",
  label: "block text-sm font-medium text-gray-700 mb-1",
};

function FeedbackCard({
  feedback,
  onUpvote,
  upvoted,
}: {
  feedback: Feedback;
  onUpvote: () => void;
  upvoted: boolean;
}) {
  return (
    <div className={`${palette.card} flex items-start gap-4`}>
      <button
        className={`flex flex-col items-center px-3 py-2 rounded-lg transition font-semibold text-sm focus:outline-none ${
          upvoted ? palette.upvoted : palette.upvote
        }`}
        onClick={onUpvote}
        aria-label="Upvote"
        style={{
          boxShadow: upvoted
            ? "0 2px 8px 0 rgba(236, 72, 153, 0.15)"
            : undefined,
          transform: upvoted ? "scale(1.08)" : undefined,
          transition: "all 0.15s",
        }}
      >
        <ThumbsUp
          size={20}
          className={upvoted ? "animate-bounce" : ""}
          strokeWidth={2.2}
        />
        <span className="mt-1">{feedback.votes}</span>
      </button>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {feedback.title}
        </h3>
        <p className="text-gray-600">{feedback.description}</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
        alt="Empty"
        className="w-40 h-40 object-cover rounded-full mb-6 opacity-80"
      />
      <h2 className="text-2xl font-bold text-gray-700 mb-2">
        No feedback yet
      </h2>
      <p className="text-gray-500 mb-4">
        Be the first to share an idea or suggestion!
      </p>
    </div>
  );
}

function AddFeedbackModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    onSubmit(title.trim(), desc.trim());
    setTitle("");
    setDesc("");
    setError("");
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0">
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
        aria-hidden="true"
      />
      {/* Modal Panel */}
      <div className="fixed inset-0 z-60 flex items-center justify-center">
        <Dialog.Panel
          className={
            palette.modalBg +
            " w-full max-w-md animate-modalPop"
          }
          style={{
            boxShadow:
              "0 8px 32px 0 rgba(31, 41, 55, 0.18), 0 1.5px 6px 0 rgba(59, 130, 246, 0.08)",
          }}
        >
          <Dialog.Title className="text-xl font-bold mb-4">
            Add Feedback
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={palette.label}>Title</label>
              <input
                className={palette.input + " w-full"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={60}
                autoFocus
                placeholder="Short summary"
              />
            </div>
            <div>
              <label className={palette.label}>Description</label>
              <textarea
                className={palette.input + " w-full min-h-[60px] resize-y"}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                maxLength={300}
                placeholder="Describe your idea (optional)"
              />
            </div>
            {error && (
              <div className="text-pink-600 text-sm font-medium">{error}</div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-100"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={palette.accent + " px-5 py-2 rounded-lg font-semibold"}
              >
                Submit
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
      <style>
        {`
        .animate-fadeIn {
          animation: fadeIn 0.3s;
        }
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        .animate-modalPop {
          animation: modalPop 0.25s cubic-bezier(.4,2,.6,1) both;
        }
        @keyframes modalPop {
          0% { opacity: 0; transform: scale(0.92) translateY(30px);}
          100% { opacity: 1; transform: scale(1) translateY(0);}
        }
        `}
      </style>
    </Dialog>
  );
}

function getLocalVotes(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem("votes") || "{}");
  } catch {
    return {};
  }
}

function setLocalVotes(votes: Record<string, boolean>) {
  localStorage.setItem("votes", JSON.stringify(votes));
}

function getLocalFeedback(): Feedback[] {
  try {
    return JSON.parse(localStorage.getItem("feedback") || "[]");
  } catch {
    return [];
  }
}

function setLocalFeedback(feedback: Feedback[]) {
  localStorage.setItem("feedback", JSON.stringify(feedback));
}

export default function App() {
  const [feedback, setFeedback] = useState<Feedback[]>(
    getLocalFeedback().length ? getLocalFeedback() : initialFeedback
  );
  const [votes, setVotes] = useState<Record<string, boolean>>(getLocalVotes());
  const [modalOpen, setModalOpen] = useState(false);

  function handleAddFeedback(title: string, description: string) {
    const newFeedback: Feedback = {
      id: randomId(),
      title,
      description,
      votes: 1,
    };
    setFeedback((prev) => {
      const updated = [newFeedback, ...prev];
      setLocalFeedback(updated);
      return updated;
    });
    setVotes((prev) => {
      const updated = { ...prev, [newFeedback.id]: true };
      setLocalVotes(updated);
      return updated;
    });
  }

  function handleUpvote(id: string) {
    setFeedback((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx === -1) return prev;
      const alreadyVoted = votes[id];
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        votes: alreadyVoted
          ? updated[idx].votes - 1
          : updated[idx].votes + 1,
      };
      setLocalFeedback(updated);
      return updated;
    });
    setVotes((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      setLocalVotes(updated);
      return updated;
    });
  }

  // Keep localStorage in sync
  React.useEffect(() => {
    setLocalFeedback(feedback);
    setLocalVotes(votes);
  }, [feedback, votes]);

  return (
    <div className={palette.bg + " min-h-screen"}>
      <header className="max-w-2xl mx-auto px-4 pt-10 pb-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          Feedback Board
        </h1>
        <button
          className={palette.accent + " flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow transition"}
          onClick={() => setModalOpen(true)}
        >
          <Plus size={20} />
          Add Feedback
        </button>
      </header>
      <main className="max-w-2xl mx-auto px-4 pb-20">
        {feedback.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-5">
            {feedback
              .slice()
              .sort((a, b) => b.votes - a.votes)
              .map((f) => (
                <FeedbackCard
                  key={f.id}
                  feedback={f}
                  upvoted={!!votes[f.id]}
                  onUpvote={() => handleUpvote(f.id)}
                />
              ))}
          </div>
        )}
      </main>
      <AddFeedbackModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddFeedback}
      />
      <footer className="text-center text-gray-400 text-xs py-6">
        Made with Blink &bull; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
type Props = {
  message: string | null;
  error: string | null;
};

export function BatchFeedback({ message, error }: Props) {
  if (!message && !error) {
    return null;
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
      >
        {error}
      </div>
    );
  }

  return (
    <div
      role="status"
      className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
    >
      {message}
    </div>
  );
}

'use client';

export default function DeleteLeagueButton({ onDelete }) {
  const handleDelete = (e) => {
    if (!confirm('Are you sure you want to delete this league?')) {
      e.preventDefault(); // Cancel submission
    }
  };

  return (
    <form action={onDelete} onSubmit={handleDelete}>
      <button
        type="submit"
        className="btn btn-danger btn-sm"
      >
        Delete
      </button>
    </form>
  );
}

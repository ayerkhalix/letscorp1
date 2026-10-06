import Link from "next/link";
export default function NotFound() {
  return (
    <div className="empty-state">
      <h1>Let’s find your way back.</h1>
      <p>This place isn’t in our neighborhood yet.</p>
      <Link className="btn btn-primary" href="/">
        Back to discover
      </Link>
    </div>
  );
}

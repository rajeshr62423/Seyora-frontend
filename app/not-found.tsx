import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div className="card card-pad" style={{ maxWidth: 420, textAlign: "center" }}>
        <div className="eyebrow">404</div>
        <h1 className="page-title">Page not found</h1>
        <p className="page-sub" style={{ marginBottom: 20 }}>
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <Link href="/projects" className="btn primary" style={{ justifyContent: "center" }}>
          Back to Projects
        </Link>
      </div>
    </div>
  );
}

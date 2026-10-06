import credits from "@/data/image-credits.json";
export function PhotoCredits() {
  return (
    <section className="photo-credits" id="photo-credits">
      <h2>Photography & credits</h2>
      <p>
        Business photos are illustrative. Destination photos show Palawan and do
        not identify the fictional businesses in this demo. Photos are cropped
        or resized for presentation.
      </p>
      <div>
        {credits.map((c) => (
          <article key={c.filename}>
            <a href={c.page} target="_blank" rel="noopener noreferrer">
              <strong>{c.role}</strong>
              <span>Photo by {c.author}</span>
            </a>
            <a href={c.license_url} target="_blank" rel="noopener noreferrer">
              {c.license}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

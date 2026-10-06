"use client";
import { useEffect, useState } from "react";
import {
  WandSparkles,
  Sparkles,
  Bookmark,
  RefreshCw,
  Check,
  Pencil,
  Upload,
  ImagePlus,
  LoaderCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  BackLink,
  PageTitle,
  Chips,
  PrototypeNotice,
} from "@/components/ui/shared";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/states";
const tools = [
  "Generate Poster",
  "Generate Product Image",
  "Generate Social Post",
  "Generate Promo Video",
  "Generate Caption",
];
export function AIWorkspace() {
  const [tool, setTool] = useState(tools[0]);
  const [prompt, setPrompt] = useState(
    "A weekend coffee + pastry offer, 20% off. Warm and welcoming, made for our local community.",
  );
  const [business, setBusiness] = useState("Palawan Brew Café");
  const [style, setStyle] = useState("Warm & editorial");
  const [colors, setColors] = useState("Navy, cream & warm yellow");
  const [format, setFormat] = useState("Square · 1:1");
  const [photo, setPhoto] = useState("/images/coffee.jpg");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [selected, setSelected] = useState(0);
  const [saved, setSaved] = useState<number[]>([]);
  const [iteration, setIteration] = useState(0);
  const [result, setResult] = useState({
    prompt: "",
    business: "",
    style: "",
    colors: "",
    format: "",
    photo: "",
    tool: "",
  });
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tool");
    if (t && tools.includes(t)) setTool(t);
  }, []);
  function generate() {
    if (!prompt.trim() || !business.trim()) {
      toast.error("Add your business name and promotion first.");
      return;
    }
    setLoading(true);
    setGenerated(false);
    setSaved([]);
    setTimeout(() => {
      setResult({ prompt, business, style, colors, format, photo, tool });
      setGenerated(true);
      setLoading(false);
      setIteration((i) => i + 1);
      toast.success("Your sample creative results are ready.");
    }, 1600);
  }
  function save() {
    setSaved((s) => (s.includes(selected) ? s : [...s, selected]));
    try {
      const previous = JSON.parse(
        localStorage.getItem("lets-corp-ai-results") || "[]",
      );
      localStorage.setItem(
        "lets-corp-ai-results",
        JSON.stringify([
          ...previous,
          {
            ...result,
            photo: result.photo.startsWith("data:")
              ? "Uploaded image (session only)"
              : result.photo,
            selected,
            saved: new Date().toISOString(),
          },
        ]),
      );
      toast.success("Sample result saved on this device.");
    } catch {
      toast.error("Could not save this result. Device storage may be full.");
    }
  }
  const variantTitles = [
    "Good coffee. Better company.",
    "Your weekend, a little sweeter.",
    "A little local. A lot to love.",
  ];
  return (
    <div className="ai-workspace">
      <BackLink href="/create/" label="Back to Let’s Create" />
      <PageTitle
        title="Your little creative studio"
        description="Start with an idea. See where it takes you."
        badge="Prototype AI experience"
      />
      <Chips
        options={tools}
        value={tool}
        onChange={(v) => {
          setTool(v);
          setGenerated(false);
        }}
      />
      <div className="ai-workspace-layout">
        <form
          className="ai-prompt-panel"
          onSubmit={(e) => {
            e.preventDefault();
            generate();
          }}
        >
          <span className="eyebrow">YOUR IDEA, YOUR WAY</span>
          <h2>Create it yourself with AI</h2>
          <label className="field">
            Business name
            <input
              required
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
            />
          </label>
          <label className="field">
            What are you promoting?
            <textarea
              id="ai-prompt"
              required
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </label>
          <label className="field">
            Product image
            <label className="ai-upload">
              <img src={photo} alt="Your product reference" />
              <span>
                <Upload size={17} />
                Upload or replace image
              </span>
              <input
                type="file"
                accept="image/*"
                aria-label="Upload product image"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  if (f.size > 2 * 1024 * 1024) {
                    toast.error("Choose an image under 2 MB.");
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = () => setPhoto(String(reader.result));
                  reader.readAsDataURL(f);
                }}
              />
            </label>
          </label>
          <div className="form-two-cols">
            <label className="field">
              Style
              <select value={style} onChange={(e) => setStyle(e.target.value)}>
                {[
                  "Warm & editorial",
                  "Clean & modern",
                  "Playful & bold",
                  "Island-inspired",
                ].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="field">
              Format
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                {[
                  "Square · 1:1",
                  "Portrait · 4:5",
                  "Story · 9:16",
                  "Landscape · 16:9",
                ].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="field">
            Brand colors
            <input value={colors} onChange={(e) => setColors(e.target.value)} />
          </label>
          <Button className="full-width" disabled={loading}>
            {loading ? (
              <>
                <LoaderCircle size={17} className="spin" />
                Creating your sample…
              </>
            ) : (
              <>
                <WandSparkles size={18} />
                Generate
              </>
            )}
          </Button>
          <p className="small muted">
            Simulated generation using local templates. No production AI service
            is connected.
          </p>
        </form>
        <section className="ai-results-panel">
          <div className="section-title">
            <div>
              <span className="eyebrow">A LITTLE CREATIVE POSSIBILITY</span>
              <h2>
                {generated ? "Your sample results" : "Your idea goes here."}
              </h2>
            </div>
            {generated && (
              <span className="badge subtle">Round {iteration}</span>
            )}
          </div>
          {loading ? (
            <div className="ai-result-grid">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="ai-result-skeleton" />
              ))}
            </div>
          ) : generated ? (
            <>
              {result.tool === "Generate Caption" ? (
                <div className="caption-results">
                  {variantTitles.map((t, i) => (
                    <button
                      key={t}
                      onClick={() => setSelected(i)}
                      className={selected === i ? "selected" : ""}
                    >
                      <span className="eyebrow">CAPTION CONCEPT {i + 1}</span>
                      <h3>{t}</h3>
                      <p>
                        {result.prompt} Stop by {result.business} and discover a
                        little more local. #LetsConnectLocal #PuertoPrincesa
                        #Palawan
                      </p>
                      {selected === i && <Check size={18} />}
                    </button>
                  ))}
                </div>
              ) : (
                <div
                  className={`ai-result-grid ${result.format.includes("9:16") ? "portrait-results" : ""}`}
                >
                  {variantTitles.map((t, i) => (
                    <button
                      key={t}
                      className={`ai-result-card result-${i} ${selected === i ? "selected" : ""}`}
                      onClick={() => setSelected(i)}
                      aria-label={`Select sample result ${i + 1}`}
                    >
                      <div className="ai-result-art">
                        <span>{result.business.toUpperCase()}</span>
                        <img
                          src={result.photo}
                          alt={`${result.business} sample creative ${i + 1}`}
                        />
                        <strong>
                          {result.tool === "Generate Product Image"
                            ? "Your product. Its moment."
                            : t}
                        </strong>
                        <p>
                          {result.prompt.length > 105
                            ? result.prompt.slice(0, 102) + "…"
                            : result.prompt}
                        </p>
                        {result.tool === "Generate Promo Video" && (
                          <span className="video-preview-label">
                            ▶ STORYBOARD PREVIEW · 00:15
                          </span>
                        )}
                        <small>MADE LOCAL. CONNECTED BY LET’S CORP.</small>
                      </div>
                      <div className="ai-result-caption">
                        <span>
                          Concept {i + 1}
                          <small>
                            {result.style} · {result.format}
                          </small>
                        </span>
                        {selected === i && (
                          <span className="selected-check">
                            <Check size={15} />
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <div className="generated-brief">
                <strong>Your creative brief</strong>
                <p>{result.prompt}</p>
                <span>
                  {result.colors} · {result.style} · {result.format}
                </span>
              </div>
              <div className="ai-result-actions">
                <Button variant="outline" onClick={generate}>
                  <RefreshCw size={16} />
                  Regenerate
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    document.getElementById("ai-prompt")?.focus();
                    document
                      .getElementById("ai-prompt")
                      ?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                >
                  <Pencil size={16} />
                  Edit prompt
                </Button>
                <Button onClick={save}>
                  <Bookmark
                    size={16}
                    fill={saved.includes(selected) ? "currentColor" : "none"}
                  />
                  {saved.includes(selected) ? "Saved result" : "Save result"}
                </Button>
              </div>
              <PrototypeNotice>
                These are sample compositions and captions. Video output is a
                storyboard preview. Style and color preferences are recorded in
                your brief.
              </PrototypeNotice>
            </>
          ) : (
            <div className="ai-empty">
              <span>
                <Sparkles size={38} />
              </span>
              <h3>A small idea can go a long way.</h3>
              <p>
                Tell us what you’re promoting and generate
                <br />a set of sample creative directions.
              </p>
              <span className="badge subtle">Prototype AI experience</span>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

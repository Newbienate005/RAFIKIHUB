import { toFormValue, type Field } from "@/lib/content-kinds";
import { ImageField } from "./ImageField";

/** One form field from its definition in lib/content-kinds.ts. */
export function FieldInput({ field, value, folder }: { field: Field; value: unknown; folder?: string }) {
  const id = `f-${field.name}`;
  const v = toFormValue(field, value);
  const hint = field.hint ? <p className="hint" id={`${id}-hint`}>{field.hint}</p> : null;
  const describedBy = field.hint ? `${id}-hint` : undefined;
  const label = (
    <label htmlFor={id}>
      {field.label} {field.required ? null : <span className="optional">(optional)</span>}
    </label>
  );

  if (field.type === "image") return <ImageField name={field.name} label={field.label} defaultValue={String(v)} folder={folder} hint={field.hint} />;

  if (field.type === "checkbox") {
    return (
      <div className="field field--check">
        <label><input type="checkbox" name={field.name} defaultChecked={Boolean(v)} /> {field.label}</label>
        {hint}
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="field field--half">
        {label}
        <select id={id} name={field.name} defaultValue={String(v)} aria-describedby={describedBy}>
          <option value="">Choose one</option>
          {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        {hint}
      </div>
    );
  }

  const long = ["textarea", "lines", "paragraphs", "blocks"].includes(field.type);
  if (long) {
    const rows = field.type === "blocks" ? 18 : field.type === "paragraphs" ? 8 : field.type === "lines" ? 4 : 4;
    return (
      <div className="field">
        {label}
        <textarea id={id} name={field.name} rows={rows} defaultValue={String(v)} aria-describedby={describedBy} />
        {hint}
      </div>
    );
  }

  const type = field.type === "date" ? "date" : field.type === "email" ? "email" : field.type === "url" || field.type === "youtube" ? "url" : "text";
  const half = ["date", "slug", "email"].includes(field.type) || field.name === "phone";
  return (
    <div className={half ? "field field--half" : "field"}>
      {label}
      <input id={id} name={field.name} type={type} defaultValue={String(v)} aria-describedby={describedBy} spellCheck={field.type === "text" ? undefined : false} />
      {hint}
    </div>
  );
}

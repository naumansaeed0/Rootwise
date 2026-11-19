import type { ReactNode, ElementType } from "react";
import { Icon } from "../Icon";
export function ReadoutLabel({
  index,
  children,
}: {
  index?: string;
  children: ReactNode;
}) {
  return (
    <span className="ui-label">
      {index && <span className="ui-label-index">{index}</span>}
      {children}
    </span>
  );
}
export function Panel({
  children,
  className = "",
  as: Tag = "div",
  id,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  id?: string;
}) {
  return (
    <Tag className={`ui-panel ui-panel--bracket ${className}`} id={id}>
      {children}
    </Tag>
  );
}
export function SectionHeading({
  index = "01",
  label,
  title,
  text,
  href,
  linkLabel,
}: {
  index?: string;
  label: string;
  title: string;
  text?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="ui-section-heading">
      <div>
        <ReadoutLabel index={index}>{label}</ReadoutLabel>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      {href && (
        <a className="text-link" href={href}>
          {linkLabel}
        </a>
      )}
    </div>
  );
}
export function PageIntro({
  index,
  label,
  title,
  description,
  icon = "leaf",
}: {
  index: string;
  label: string;
  title: ReactNode;
  description: string;
  icon?: string;
}) {
  return (
    <div className="ui-page-intro">
      <div>
        <ReadoutLabel index={index}>{label}</ReadoutLabel>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="ui-intro-orbit" aria-hidden="true">
        <Icon name={icon} size={35} />
      </div>
    </div>
  );
}
export function Meter({ value, total = 4 }: { value: number; total?: number }) {
  return (
    <span className="ui-meter" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <i key={i} className={i < value ? "is-filled" : ""} />
      ))}
    </span>
  );
}
export function SafetyStatus({ value }: { value: string }) {
  const status =
    value === "Non-toxic" ? "safe" : value === "Toxic" ? "caution" : "unknown";
  return (
    <span className="ui-status" data-status={status}>
      <span className="ui-status-symbol" aria-hidden="true">
        {status === "safe" ? "✓" : status === "caution" ? "!" : "?"}
      </span>
      {status === "safe"
        ? "Pet-friendly"
        : status === "caution"
          ? "Toxic / irritating"
          : "Unverified"}
    </span>
  );
}
export function ToggleGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <fieldset className="instrument-filter">
      <legend>
        <ReadoutLabel>{label}</ReadoutLabel>
      </legend>
      <div className="instrument-filter-options">
        {options.map((o) => (
          <button
            className="ui-chip"
            key={o.value}
            aria-pressed={value === o.value}
            type="button"
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

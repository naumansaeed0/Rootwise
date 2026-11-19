import { useEffect, useRef, type ReactNode } from "react";
import { Icon } from "./Icon";
export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const active = document.activeElement as HTMLElement;
    el.showModal();
    document.body.classList.add("modal-open");
    return () => {
      el.close();
      document.body.classList.remove("modal-open");
      active?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby="modal-heading"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-inner">
        <button
          className="icon-button modal-close"
          onClick={onClose}
          aria-label="Close panel"
        >
          <Icon name="close" />
        </button>
        <span className="eyebrow">A FIELD NOTE</span>
        <h2 id="modal-heading">{title}</h2>
        {children}
      </div>
    </dialog>
  );
}

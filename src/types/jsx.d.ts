declare namespace JSX {
  interface IntrinsicElements {
    'lov-presentation-mermaid': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }, HTMLElement>;
    'lov-presentation-link': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { url?: string; children?: React.ReactNode }, HTMLElement>;
    'lov-presentation-suggestion': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { message?: string; children?: React.ReactNode }, HTMLElement>;
    'lov-presentation-actions': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }, HTMLElement>;
  }
}

export {};

import { fontRoles } from "./fontThemes";

/**
 * Applies the redesign fonts (Cormorant Garamond + Jost) to everything inside
 * it, via the --f-serif / --f-sans / --f-mono roles the components use.
 */
export default function FontTheme({
  variables,
  className = "",
  children,
}: {
  /** The font CSS-variable classNames from fontThemes.ts. */
  variables: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${variables} font-th-sans ${className}`} style={fontRoles}>
      {children}
    </div>
  );
}

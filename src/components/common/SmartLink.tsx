import { Link } from "react-router-dom";
import { isExternalUrl } from "@/utils/format";

interface SmartLinkProps {
  // A /path inside the shop or a full http(s) URL.
  to: string;
  className?: string;
  children: React.ReactNode;
}

/** Router Link for shop paths, a plain anchor for external URLs. */
export function SmartLink({ to, className, children, ...rest }: SmartLinkProps) {
  return isExternalUrl(to) ? (
    <a href={to} className={className} {...rest}>
      {children}
    </a>
  ) : (
    <Link to={to} className={className} {...rest}>
      {children}
    </Link>
  );
}

"use client";

import DOMPurify from "dompurify";
import { useEffect, useState } from "react";

interface SanitizedHTMLProps {
  html: string;
  className?: string;
}

export default function SanitizedHTML({ html, className }: SanitizedHTMLProps) {
  const [sanitized, setSanitized] = useState("");

  useEffect(() => {
    // Sanitize on the client to avoid SSR issues with DOMPurify
    setSanitized(DOMPurify.sanitize(html));
  }, [html]);

  if (!sanitized) return <div className={className} />;

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }} 
    />
  );
}

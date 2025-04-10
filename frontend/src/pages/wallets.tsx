import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

export const WalletsPage = () => {
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/wallets/list")
      .then((response) => response.text())
      .then((html) => {
        setHtmlContent(DOMPurify.sanitize(html));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching wallets:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading wallets...</div>;

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

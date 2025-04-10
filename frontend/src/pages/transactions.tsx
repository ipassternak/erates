import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

export const TransactionsPage = () => {
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/transactions")
      .then((response) => response.text())
      .then((html) => {
        setHtmlContent(DOMPurify.sanitize(html));
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading transactions...</div>;

  return (
    <div className="transactions-container">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

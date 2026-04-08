import { useState } from "react";
import Button from "../../base/Button";

function CopyToClipboardButton({ content }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset after 2s
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Button onClick={handleCopy} clickable={content!=null} reason={"First confirm between first pass and second pass in all panes."}>
      {copied ? "Copied!" : "Copy to Clipboard"}
    </Button>
  );
}

export default CopyToClipboardButton;
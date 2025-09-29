import React, { useEffect } from "react";
import { CheckOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useState } from "react";
import { NewCopyIcon } from "../../assets/SvgIcon/SvgIcon";

export default function CopyText({ text, copy }) {
  const [copied, setCopied] = useState(copy || false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  useEffect(() => {
    setCopied(copy);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }, [copy]);

  return (
    <div onClick={handleCopyClick}>
      <Tooltip title={copied ? " Copied" : "Copy"} className="copyIconToolTip">
        <div>{copied ? <CheckOutlined /> : <NewCopyIcon />}</div>
      </Tooltip>
    </div>
  );
}

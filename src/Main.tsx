import React from "react";
import ReactDom from "react-dom/client";
import "./index.less";
import App from "@src/App";
import ErrorBoundary from "@src/container/ErrorBoundary";

const Main = () => (
  // 严格模式
  <React.StrictMode>
    {/* 边界异常监控 */}
    <ErrorBoundary>
      {/* 内容 */}
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

const root = ReactDom.createRoot(document.getElementById("root"));
root.render(<App />);

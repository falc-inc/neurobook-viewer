export const urlToContentType = (url: string) => {
  const extension = url.split(".").pop();
  switch (extension) {
    case "css":
      return "text/css";
    case "epub":
      return "application/epub+zip";
    case "opf":
      return "application/oebps-package+xml";
    case "xml":
      return "text/xml";
    case "html":
      return "text/html";
    case "xhtml":
      return "application/xhtml+xml";
    case "js":
      return "application/javascript";
    case "json":
      return "application/json";
    case "png":
      return "image/png";
    case "svg":
      return "image/svg+xml";
    case "ttf":
      return "font/ttf";
    case "woff":
      return "font/woff";
    case "woff2":
      return "font/woff2";
    default:
      return "text/plain";
  }
};

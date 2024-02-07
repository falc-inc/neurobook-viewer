import { VolatileState, Renderer } from "./components/renderer";
import { mockBasePath } from "./msw/constants";
import { PageViewMode } from "@vivliostyle/core";
import { ToParent, ToViewer } from "./event";
import { useEffect, useState } from "react";
import queryString from 'query-string';

const BookViewer = () => {
  const search = window.location.search;
  const query3 = queryString.parse(search);
  const book = query3['book'] as string;

  const [page, setPage] = useState(1);
  const [fontSize, setFontSize] = useState(16);

  // epubファイルを開く場合はServiceWorkerでUnzipするため、モックサーバーにリクエストを送る
  const source = book?.endsWith(".epub") ? `${mockBasePath}?url=${book}` : book;

  useEffect(() => {
    const data: ToParent = {
      type: "load-start",
    };
    window.parent.postMessage(data, "*");
  }, [])

  useEffect(() => {
    const handler = (response: MessageEvent<ToViewer>) => {
      if (response.data.type === "set-page") {
        setPage(response.data.page);
      }
      if (response.data.type === "set-font-size") {
        setFontSize(response.data.fontSize);
      }
    };
    window.addEventListener("message", handler);

    return () => {
      window.removeEventListener("message", handler);
    };
  }, []);

  const onLoad = (state: VolatileState) => {
    const data: ToParent = {
      type: "load-complete",
      state: state,
    };
    window.parent.postMessage(data, "*");
  };

  const handleError = (error: string) => {
    const data: ToParent = {
      type: "load-error",
      error: error,
    };
    window.parent.postMessage(data, "*");
  }

  return (
    <>
      {source && (
        <Renderer
          className="h-book w-book"
          pageViewMode={PageViewMode.SINGLE_PAGE}
          autoResize={true}
          zoom={1}
          fontSize={fontSize}
          fitToScreen={false}
          source={source}
          renderAllPages={true}
          page={page}
          onLoad={onLoad}
          onError={handleError}
          background="transparent"
        />
      )}
    </>
  );
};

export default BookViewer;

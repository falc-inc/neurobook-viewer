import { VolatileState, Renderer } from "./components/renderer";
import { mockBasePath } from "./msw/constants";
import { PageViewMode } from "@vivliostyle/core";
import { ToParent, ToViewer } from "./event";
import { useEffect, useState } from "react";
import queryString from 'query-string';

const BookViewer = () => {
  const search = window.location.search;
  const query3 = queryString.parse(search);

  const [page, setPage] = useState(1);

  const book = query3['book'] as string

  // epubファイルを開く場合はServiceWorkerでUnzipするため、モックサーバーにリクエストを送る
  const source = book?.endsWith(".epub") ? `${mockBasePath}?url=${book}` : book;

  useEffect(() => {
    const handler = (response: MessageEvent<ToViewer>) => {
      if (response.data.type === "set-page") {
        setPage(response.data.page);
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

  return (
    <>
      {source && (
        <Renderer
          className="h-book w-book"
          pageViewMode={PageViewMode.SINGLE_PAGE}
          autoResize={true}
          zoom={1}
          fitToScreen={false}
          source={source}
          renderAllPages={true}
          page={page}
          onLoad={onLoad}
          background="transparent"
        />
      )}
    </>
  );
};

export default BookViewer;

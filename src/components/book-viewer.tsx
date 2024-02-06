import { useState } from "react";
import { Renderer, VolatileState } from "./renderer";
import { PageViewMode } from "@vivliostyle/core";
import { mockBasePath } from "../msw/constants";

export const BibiViewer = ({ filePath }: { filePath?: string }) => {
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  function next() {
    if (page === lastPage) {
      return;
    }
    setPage((page) => page + 1);
  }

  function prev() {
    if (page === 1) {
      return;
    }
    setPage((page) => page - 1);
  }

  function onLoad(state: VolatileState) {
    setLastPage(state.epageCount);
    setIsLoading(false);
  }

  // epubファイルを開く場合はServiceWorkerでUnzipするため、モックサーバーにリクエストを送る
  const source = filePath?.endsWith(".epub")
    ? `${mockBasePath}?url=${filePath}`
    : filePath;

  return (
    <article className="grid justify-center">
      {isLoading && (
        <section className="fixed z-popup grid size-full items-center justify-center bg-black opacity-20">
          <div className="text-white">本を開いています</div>
        </section>
      )}
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
    </article>
  );
};
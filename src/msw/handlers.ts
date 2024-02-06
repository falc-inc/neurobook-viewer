import { HttpResponse, http } from "msw";
import JSZip from "jszip";
import { urlToContentType } from "./utils/content-type";
import { MockUrl } from "./utils/url";
import { mockBasePath } from "./constants";

// TODO: unzip済みのファイルをキャッシュしたい

async function getData(url: string) {
  const cacheStorage = await caches.open("bibliography-cache");
  const cachedResponse = await cacheStorage.match(url);

  if (!cachedResponse || !cachedResponse.ok) {
    const blob = await (await fetch(url)).blob();
    await cacheStorage.put(url, new Response(blob));
    return blob;
  }

  return await cachedResponse.blob();
}

const bibiRequestHandlers = [
  http.all(`${mockBasePath}?url=:url`, async ({ request }) => {
    const mockUrl = new MockUrl(request.url);

    // NOTE: ファイル自体にアクセスがあった時にstatus: 400以上を返すと、vlvliostyleがディレクトリとして認識してくれる
    // https://github.com/vivliostyle/vivliostyle.js/blob/master/packages/core/src/vivliostyle/epub.ts#L98
    if (mockUrl.resourceUrl.endsWith(".epub")) {
      return new HttpResponse(null, {
        status: 404,
      });
    }

    const data = await getData(mockUrl.epubUrl);

    const zipContent = await JSZip.loadAsync(data);
    const target = zipContent.file(mockUrl.relativePath);
    let targetData = (await target?.async("text")) ?? "";

    // NOTE: ファイル内のリンクをすべてモック経由のリンクに書き換える
    const hrefRegex = /href="(.*)"/g;
    targetData?.match(hrefRegex)?.forEach((match) => {
      const href = match.split(`href="`)[1]?.split(`"`)[0] ?? "";
      const newHref = mockUrl.toMockRequestPath(href);
      targetData = targetData.replace(href, newHref);
    });

    // NOTE: css importをすべてモック経由で読み込むように書き換える
    const cssImportRegex = /@import "(.*)";/g;
    targetData?.match(cssImportRegex)?.forEach((match) => {
      const importPath = match.split(`@import "`)[1]?.split(`"`)[0] ?? "";
      const newImportPath = mockUrl.toMockRequestPath(importPath);
      targetData = targetData.replace(match, `@import "${newImportPath}";`);
    });

    const contentType = urlToContentType(mockUrl.resourceUrl);

    return new HttpResponse(targetData, {
      status: targetData ? 200 : 404,
      headers: {
        "Content-Type": contentType,
      },
    });
  }),
];

export const handlers = [...bibiRequestHandlers];

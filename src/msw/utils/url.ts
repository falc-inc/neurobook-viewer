import { mockBasePath } from "../constants";

export class MockUrl {
  readonly urlObject: URL;

  readonly resourceUrl: string;

  readonly epubUrl: string;

  readonly relativePath: string;

  constructor(requestUrl: string) {
    this.urlObject = new URL(requestUrl);
    this.resourceUrl = this.urlObject.searchParams.get("url") ?? "";
    this.epubUrl = this.resourceUrl.split(".epub")[0] + ".epub";
    this.relativePath = this.resourceUrl.split(".epub/")?.[1] ?? "";
  }

  toMockRequestPath(path: string) {
    const relativeCount = (path.match(/\.\.\//g) || []).length;
    const absoluteImportPath = path.replace(/\.\.\//g, "");
    const relativeDir =
      this.relativePath
        ?.split("/")
        ?.slice(0, -1 - relativeCount)
        ?.join("/") ?? "";
    return `${this.urlObject.origin}${mockBasePath}?url=${this.epubUrl}/${relativeDir}/${absoluteImportPath}`;
  }
}

import { expect } from "chai";
import "mocha";
import { Nielsen } from "../nielsen";
import { path } from "ramda";
import { WebRequestData } from "../../types/Types";

describe("Nielsen", () => {
  describe("transformer", () => {
    describe("Title", () => {
      const webRequestData: WebRequestData = {
        meta: {},
        params: [{ label: "test", value: "test", valueType: "string" }],
      };
      const transformed = Nielsen.transformer(webRequestData);
      it("returns the correct event title", () => {
        expect(path(["meta", "title"], transformed)).to.eql("Page View");
      });
    });

    describe("When a label is present that needs replacing", () => {
      const webRequestData: WebRequestData = {
        meta: {},
        params: [{ label: "lg", value: "test", valueType: "string" }],
      };
      const transformed = Nielsen.transformer(webRequestData);
      it("sets the correct label", () => {
        expect(path(["params", 0, "label"], transformed)).to.eql("Language");
      });
    });
  });
});

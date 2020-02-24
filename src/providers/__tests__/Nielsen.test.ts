import { expect } from "chai";
import "mocha";
import { path } from "ramda";
import { GetRequest } from "../../types/Types";
import { Nielsen } from "../Nielsen";

describe("Nielsen", () => {
  describe("transformer", () => {
    describe("Title", () => {
      const rwrd: GetRequest = {
        url: "http://someurl.tld",
        requestType: "GET",
        requestParams: { test: "test" },
      };
      const transformed = Nielsen.transformer(rwrd);
      it("returns the correct event title", () => {
        expect(path(["meta", "title"], transformed[0])).to.eql("Page View");
      });
    });

    describe("When a label is present that needs replacing", () => {
      const rwrd: GetRequest = {
        url: "http://someurl.tld",
        requestType: "GET",
        requestParams: { lg: "test" },
      };
      const transformed = Nielsen.transformer(rwrd);
      it("sets the correct label", () => {
        expect(path(["data", 0, "label"], transformed[0])).to.eql("Language");
      });
    });
  });
});

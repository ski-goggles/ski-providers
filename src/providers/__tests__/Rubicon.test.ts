import { expect } from "chai";
import "mocha";
import { path } from "ramda";
import { GetRequest } from "../../types/Types";
import { Rubicon } from "../Rubicon";

describe("Rubicon", () => {
  describe("transformer", () => {
    describe("Title", () => {
      const rwrd: GetRequest = {
        url: "http://someurl.tld",
        requestType: "GET",
        requestParams: { fired: "test" }
      };
      const transformed = Rubicon.transformer(rwrd);
      it("returns the correct event title", () => {
        expect(path(["meta", "title"], transformed[0])).to.eql(
          "Ad Load Request"
        );
      });
    });

    describe("Data Layer", () => {
      describe("When a 'tg_' property is present", () => {
        const rwrd: GetRequest = {
          url: "http://someurl.tld",
          requestType: "GET",
          requestParams: { tg_i: "test", u: "test2" }
        };
        const transformed = Rubicon.transformer(rwrd);
        it("sets the correct category", () => {
          expect(path(["data", 0, "category"], transformed[0])).to.eql(
            "Data Layer"
          );
          expect(path(["data", 1, "category"], transformed[0])).to.eql(null);
        });
      });

      describe("When a label is present that needs replacing", () => {
        const rwrd: GetRequest = {
          url: "http://someurl.tld",
          requestType: "GET",
          requestParams: { source: "test", u: "test2" }
        };
        const transformed = Rubicon.transformer(rwrd);
        it("sets the correct label", () => {
          expect(path(["data", 0, "label"], transformed[0])).to.eql("Source");
        });
      });
    });
  });
});

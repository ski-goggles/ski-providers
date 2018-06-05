import { expect } from "chai";
import "mocha";
import { path } from "ramda";
import { GetRequest } from "../../types/Types";
import { GoogleAnalytics } from "../GoogleAnalytics";

describe("GoogleAnalytics", () => {
  describe("transformer", () => {
    describe("Title", () => {
      describe("when the hit type is set", () => {
        const rwrd: GetRequest = {
          url: "http://someurl.tld",
          requestType: "GET",
          requestParams: { t: "pageview" },
        };
        const transformed = GoogleAnalytics.transformer(rwrd);
        it("returns the correct event title", () => {
          expect(path(["meta", "title"], transformed)).to.eql("Page Load");
        });
      });

      describe("when the hit type is not set", () => {
        const rwrd: GetRequest = {
          url: "http://someurl.tld",
          requestType: "GET",
          requestParams: { ea: "Awesome" },
        };
        const transformed = GoogleAnalytics.transformer(rwrd);
        it("returns the correct event title based on the event action", () => {
          expect(path(["meta", "title"], transformed)).to.eql("Awesome");
        });
      });

      describe("when the hit type and event action are not set", () => {
        const rwrd: GetRequest = {
          url: "http://someurl.tld",
          requestType: "GET",
          requestParams: { something: "Awesome" },
        };
        const transformed = GoogleAnalytics.transformer(rwrd);
        it("returns a fallback value", () => {
          expect(path(["meta", "title"], transformed)).to.eql("Unknown Event");
        });
      });
    });

    describe("Data Layer", () => {
      describe("When a label is present that needs replacing", () => {
        const rwrd: GetRequest = {
          url: "http://someurl.tld",
          requestType: "GET",
          requestParams: { tid: "awesome-tracking-id" },
        };
        const transformed = GoogleAnalytics.transformer(rwrd);
        it("returns the replaced Label", () => {
          expect(path(["data", 0, "label"], transformed)).to.eql("Tracking ID");
        });
      });
    });
  });
});

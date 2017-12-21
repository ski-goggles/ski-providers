import { expect } from "chai";
import "mocha";
import { GoogleAnalytics } from "../GoogleAnalytics";
import { path } from "ramda";
import { WebRequestData } from "../../types/Types";

describe("GoogleAnalytics", () => {
  describe("transformer", () => {
    describe("Title", () => {
      describe("when the hit type is set", () => {
        const webRequestData: WebRequestData = {
          meta: {},
          params: [{ label: "t", value: "pageview", valueType: "string" }],
        };
        const transformed = GoogleAnalytics.transformer(webRequestData);
        it("returns the correct event title", () => {
          expect(path(["meta", "title"], transformed)).to.eql("Page Load");
        });
      });

      describe("when the hit type is not set", () => {
        const webRequestData: WebRequestData = {
          meta: {},
          params: [{ label: "ea", value: "Awesome", valueType: "string" }],
        };
        const transformed = GoogleAnalytics.transformer(webRequestData);
        it("returns the correct event title based on the event action", () => {
          expect(path(["meta", "title"], transformed)).to.eql("Awesome");
        });
      });

      describe("when the hit type and event action are not set", () => {
        const webRequestData: WebRequestData = {
          meta: {},
          params: [{ label: "something", value: "Awesome", valueType: "string" }],
        };
        const transformed = GoogleAnalytics.transformer(webRequestData);
        it("returns a fallback value", () => {
          expect(path(["meta", "title"], transformed)).to.eql("Unknown Event");
        });
      });
    });

    describe("Data Layer", () => {
      describe("When a label is present that needs replacing", () => {
        const webRequestData: WebRequestData = {
          meta: {},
          params: [{ label: "tid", value: "awesome-tracking-id", valueType: "string" }],
        };
        const transformed = GoogleAnalytics.transformer(webRequestData);
        it("returns the replaced Label", () => {
          expect(path(["params", 0, "label"], transformed)).to.eql("Tracking ID");
        });
      });
    });
  });
});

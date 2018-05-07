import { expect } from "chai";
import "mocha";
import { AdobeAnalyticsAppMeasurement } from "../AdobeAnalyticsAppMeasurement";
import { path } from "ramda";
import { WebRequestData } from "../../types/Types";

describe("Adobe Analytics Manager", () => {
  describe("transformer", () => {
    describe("Title", () => {
      describe("When the data contains 'pe' param", () => {
        describe("When no events are populated", () => {
          const webRequestData: WebRequestData = {
            meta: { requestUrl: "https://google.com" },
            params: [{ label: "pe", value: "link_o", valueType: "string" }],
          };
          const transformed = AdobeAnalyticsAppMeasurement.transformer(webRequestData);
          it("returns the label Unknown Event", () => {
            expect(path(["meta", "title"], transformed)).to.eql("Unknown Event");
          });
        });

        describe("When an event is populated", () => {
          const webRequestData: WebRequestData = {
            meta: { requestUrl: "https://google.com" },
            params: [
              { label: "pe", value: "link_o", valueType: "string" },
              { label: "events", value: "event1", valueType: "string" },
            ],
          };
          const transformed = AdobeAnalyticsAppMeasurement.transformer(webRequestData);
          it("returns the correct event", () => {
            expect(path(["meta", "title"], transformed)).to.eql("event1");
          });
        });
      });

      describe("When the data does not contain 'pe' param", () => {
        const webRequestData: WebRequestData = {
          meta: { requestUrl: "https://google.com" },
          params: [{ label: "pet", value: "link_o", valueType: "string" }],
        };
        const transformed = AdobeAnalyticsAppMeasurement.transformer(webRequestData);
        it("returns the Page Load label", () => {
          expect(path(["meta", "title"], transformed)).to.eql("Page Load");
        });

        describe("and contains events data", () => {
          const webRequestData: WebRequestData = {
            meta: { requestUrl: "https://google.com" },
            params: [
              { label: "pet", value: "link_o", valueType: "string" },
              { label: "events", value: "event1", valueType: "string" },
            ],
          };
          const transformed = AdobeAnalyticsAppMeasurement.transformer(webRequestData);
          it("returns Page Load label with events", () => {
            expect(path(["meta", "title"], transformed)).to.eql("Page Load (event1)");
          });
        });
      });
    });

    describe("Evars, Props, and Lists", () => {
      describe("When an evar/v property is present with the correct category", () => {
        const webRequestData: WebRequestData = {
          meta: { requestUrl: "https://google.com" },
          params: [
            { label: "v1", value: "test", valueType: "string" },
            { label: "evar2", value: "test2", valueType: "string" },
          ],
        };
        const transformed = AdobeAnalyticsAppMeasurement.transformer(webRequestData);
        it("sets the label with a readble prefix - eVar", () => {
          expect(path(["params", 0, "label"], transformed)).to.eql("eVar1");
          expect(path(["params", 0, "category"], transformed)).to.eql("Evars, Props, and Lists");
          expect(path(["params", 1, "label"], transformed)).to.eql("eVar2");
        });
      });

      describe("When an prop/c property is present with the correct category", () => {
        const webRequestData: WebRequestData = {
          meta: { requestUrl: "https://google.com" },
          params: [
            { label: "c1", value: "test", valueType: "string" },
            { label: "prop2", value: "test2", valueType: "string" },
          ],
        };
        const transformed = AdobeAnalyticsAppMeasurement.transformer(webRequestData);
        it("sets the label with a readble prefix - eVar", () => {
          expect(path(["params", 0, "label"], transformed)).to.eql("Prop1");
          expect(path(["params", 0, "category"], transformed)).to.eql("Evars, Props, and Lists");
          expect(path(["params", 1, "label"], transformed)).to.eql("Prop2");
        });
      });

      describe("When an list/l property is present with the correct category", () => {
        const webRequestData: WebRequestData = {
          meta: { requestUrl: "https://google.com" },
          params: [
            { label: "l1", value: "test", valueType: "string" },
            { label: "list2", value: "test2", valueType: "string" },
          ],
        };
        const transformed = AdobeAnalyticsAppMeasurement.transformer(webRequestData);
        it("sets the label with a readble prefix - list", () => {
          expect(path(["params", 0, "label"], transformed)).to.eql("List1");
          expect(path(["params", 0, "category"], transformed)).to.eql("Evars, Props, and Lists");
          expect(path(["params", 1, "label"], transformed)).to.eql("List2");
        });
      });

      describe("When a label is present that needs replacing", () => {
        const webRequestData: WebRequestData = {
          meta: { requestUrl: "https://google.com" },
          params: [{ label: "ns", value: "test", valueType: "string" }],
        };
        const transformed = AdobeAnalyticsAppMeasurement.transformer(webRequestData);
        it("sets the correct label", () => {
          expect(path(["params", 0, "label"], transformed)).to.eql("Visitor namespace");
        });
      });
    });
  });
});

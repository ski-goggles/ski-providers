import { expect } from "chai";
import "mocha";
import { Snowplow } from "../Snowplow";
import { path, map, prop } from "ramda";
import { snowplowFixture } from "./fixtures";
import { WebRequestData } from "../../types/Types";

describe("Snowplow", () => {
  describe("Title", () => {
    describe("When the data contains 'ue_px' param", () => {
      const webRequestData: WebRequestData = {
        meta: { requestUrl: "https://google.com" },
        params: [
          { label: "ue_px", value: snowplowFixture.ue_px, valueType: "json" },
          { label: "e", value: "ue", valueType: "string" },
        ],
      };
      const transformed = Snowplow.transformer(webRequestData);
      it("returns the event_name as the Title", () => {
        expect(path(["meta", "title"], transformed)).to.eql("property_details_carousel_click");
      });
    });

    describe("When the data does not contain 'ue_px' param", () => {
      const webRequestData: WebRequestData = {
        meta: { requestUrl: "https://google.com" },
        params: [{ label: "e", value: "pv", valueType: "string" }],
      };
      const transformed = Snowplow.transformer(webRequestData);
      it("returns the event_name as the Title", () => {
        expect(path(["meta", "title"], transformed)).to.eql("Page View");
      });
    });
  });

  describe("transformer", () => {
    describe("JSON parsing", () => {
      map(
        param => {
          describe(`When the data contains ${param} param`, () => {
            describe("with a good payload", () => {
              const webRequestData: WebRequestData = {
                meta: { requestUrl: "https://google.com" },
                params: [{ label: param, value: prop(param, snowplowFixture), valueType: "json" }],
              };
              const transformed = Snowplow.transformer(webRequestData);
              it("Payload is decoded", () => {
                const payload = JSON.parse(path(["params", 0, "value"], transformed));
                expect(payload).to.be.an("object");
              });
            });

            describe("with a bad payload", () => {
              const webRequestData: WebRequestData = {
                meta: { requestUrl: "https://google.com" },
                params: [{ label: param, value: "not-a-good-payload", valueType: "json" }],
              };
              const transformer = () => Snowplow.transformer(webRequestData);

              it("Handles the JSON error gracefully", () => {
                expect(transformer).to.not.throw(SyntaxError);
              });

              it("returns a JSON object indicating an error message", () => {
                const parsed = JSON.parse(path(["params", 0, "value"], transformer()));
                expect(parsed).to.contain({ error: "Could not parse data" });
              });
            });
          });
        },
        ["ue_px", "cx"],
      );
    });
  });

  describe("When a label is present that needs replacing", () => {
    const webRequestData: WebRequestData = {
      meta: { requestUrl: "https://google.com" },
      params: [{ label: "cx", value: "test", valueType: "json" }],
    };
    const transformed = Snowplow.transformer(webRequestData);
    it("sets the correct label", () => {
      expect(path(["params", 0, "label"], transformed)).to.eql("Context Payload");
    });
  });
});

import { expect } from "chai";
import "mocha";
import { map, mapObjIndexed, path, prop } from "ramda";
import { GetRequest } from "../../types/Types";
import { Snowplow } from "../Snowplow";
import { snowplowFixture } from "./fixtures";

describe("Snowplow", () => {
  describe("Title", () => {
    const eventTypes = {
      pv: "Page View",
      pp: "Page Ping",
      tr: "Ecommerce transaction",
      ti: "Ecommerce transaction",
      se: "Custom Structured Event",
    };

    mapObjIndexed((eventTitle, eventKey) => {
      describe(`when event type is set as ${eventKey}`, () => {
        const rwrd: GetRequest = {
          url: "http://someurl.tld",
          requestType: "GET",
          requestParams: { e: eventKey },
        };
        const transformed = Snowplow.transformer(rwrd);
        it(`returns the event type as ${eventTitle} `, () => {
          expect(path(["meta", "title"], transformed)).to.eql(eventTitle);
        });
      });
    }, eventTypes);

    describe("When the data contains 'ue_px' param", () => {
      const rwrd: GetRequest = {
        url: "http://someurl.tld",
        requestType: "GET",
        requestParams: { e: "ue", ue_px: snowplowFixture.ue_px },
      };
      const transformed = Snowplow.transformer(rwrd);
      it("returns the event_name as the Title", () => {
        expect(path(["meta", "title"], transformed)).to.eql("property_details_carousel_click");
      });
    });

    describe("When the data does not contain 'ue_px' param", () => {
      const rwrd: GetRequest = {
        url: "http://someurl.tld",
        requestType: "GET",
        requestParams: { e: "pv" },
      };
      const transformed = Snowplow.transformer(rwrd);
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
              const requestParams = {}
              requestParams[param] = snowplowFixture[param];
              const rwrd: GetRequest = {
                url: "http://someurl.tld",
                requestType: "GET",
                requestParams: requestParams,
              };
              const transformed = Snowplow.transformer(rwrd);
              it("Payload is decoded", () => {
                const payload = JSON.parse(path(["data", 0, "value"], transformed));
                expect(payload).to.be.an("object");
              });
            });

            describe("with a bad payload", () => {
              const requestParams = {}
              requestParams[param] = 'not-a-good-payload';
              const rwrd: GetRequest = {
                url: "http://someurl.tld",
                requestType: "GET",
                requestParams: requestParams,
              };
              const transformer = () => Snowplow.transformer(rwrd);

              it("Handles the JSON error gracefully", () => {
                expect(transformer).to.not.throw(SyntaxError);
              });

              it("returns a JSON object indicating an error message", () => {
                const parsed = JSON.parse(path(["data", 0, "value"], transformer()));
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
    const rwrd: GetRequest = {
      url: "http://someurl.tld",
      requestType: "GET",
      requestParams: { cx: "test" },
    };
    const transformed = Snowplow.transformer(rwrd);
    it("sets the correct label", () => {
      expect(path(["data", 0, "label"], transformed)).to.eql("Context Payload");
    });
  });
});

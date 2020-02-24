import { expect } from "chai";
import "mocha";
import { path } from "ramda";
import { GetRequest } from "../../types/Types";
import { Mixpanel } from "../Mixpanel";
import { MixpanelTrackData, MixpanelEngageData } from "./fixtures";

describe("Mixpanel", () => {
  describe("transformer", () => {
    describe("Data Layer", () => {
      describe("When it's a track event", () => {
        const rwrd: GetRequest = {
          url: "http://someurl.tld",
          requestType: "GET",
          requestParams: { data: MixpanelTrackData },
        };

        const transformed = Mixpanel.transformer(rwrd);

        it("formats the data accordingly", () => {
          expect(path(["data", 0, "label"], transformed[0])).to.eql("Event");
          expect(path(["data", 0, "value"], transformed[0])).to.eql("game");
        });

        it("sets the 'properties' formatting type to JSON", () => {
          expect(path(["data", 1, "formatting"], transformed[0])).to.eql("json");
        });

        it("returns the correct title", () => {
          expect(path(["meta", "title"], transformed[0])).to.eql("game");
        });
      });

      describe("When it's a engage event", () => {
        const rwrd: GetRequest = {
          url: "http://someurl.tld",
          requestType: "GET",
          requestParams: { data: MixpanelEngageData },
        };

        const transformed = Mixpanel.transformer(rwrd);

        it("formats the data accordingly", () => {
          expect(path(["data", 2, "label"], transformed[0])).to.eql("Set Operation");
          expect(path(["data", 1, "value"], transformed[0])).to.eql("123.123.123.123");
        });

        it("sets the 'properties' formatting type to JSON", () => {
          expect(path(["data", 2, "formatting"], transformed[0])).to.eql("json");
        });

        it("returns the correct title", () => {
          expect(path(["meta", "title"], transformed[0])).to.eql("Set Operation");
        });
      });
    });
  });
});

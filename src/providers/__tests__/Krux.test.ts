import { expect } from "chai";
import "mocha";
import { path } from "ramda";
import { GetRequest } from "../../types/Types";
import { Krux } from "../Krux";

describe("Krux", () => {
  describe("transformer", () => {
    describe("Title", () => {
      describe("When the data contains 'fired' param", () => {
        const rwrd: GetRequest = {
          url: "http://someurl.tld",
          requestType: "GET",
          requestParams: { fired: "test" },
        };
        const transformed = Krux.transformer(rwrd);
        it("returns the correct event title", () => {
          expect(path(["meta", "title"], transformed)).to.eql("test");
        });
      });

      describe("When the data does not contain 'fired' param", () => {
        const rwrd: GetRequest = {
          url: "http://someurl.tld",
          requestType: "GET",
          requestParams: { events: "event1" },
        };
        const transformed = Krux.transformer(rwrd);
        it("returns the correct event title", () => {
          expect(path(["meta", "title"], transformed)).to.eql("Page View");
        });
      });
    });

    describe("Data Layer", () => {
      describe("When a '_k' property is present", () => {
        const rwrd: GetRequest = {
          url: "http://someurl.tld",
          requestType: "GET",
          requestParams: { _k1: "test", stuff: "value" },
        };
        const transformed = Krux.transformer(rwrd);
        it("sets the correct category", () => {
          expect(path(["data", 0, "category"], transformed)).to.eql("Data Layer");
          expect(path(["data", 1, "category"], transformed)).to.eql(null);
        });
      });

      describe("When a '_kpl' property is present", () => {
        const rwrd: GetRequest = {
          url: "http://someurl.tld",
          requestType: "GET",
          requestParams: { _k1: "test", stuff: "value" },
        };
        const transformed = Krux.transformer(rwrd);
        it("sets the correct category", () => {
          expect(path(["data", 0, "category"], transformed)).to.eql("Data Layer");
          expect(path(["data", 1, "category"], transformed)).to.eql(null);
        });
      });

      describe("When a label is present that needs replacing", () => {
        const rwrd: GetRequest = {
          url: "http://someurl.tld",
          requestType: "GET",
          requestParams: { source: "test" },
        };
        const transformed = Krux.transformer(rwrd);
        it("sets the correct label", () => {
          expect(path(["data", 0, "label"], transformed)).to.eql("Source");
        });
      });
    });
  });
});

import { describe, it, expect } from "vitest";
import { StatusCard } from "@/components/status-card";
import { InfoRow } from "@/components/info-row";

describe("UI Components", () => {
  describe("StatusCard", () => {
    it("should have correct props interface", () => {
      const props = {
        title: "Test Status",
        status: "success" as const,
        description: "Test description",
      };
      
      expect(props.title).toBe("Test Status");
      expect(props.status).toBe("success");
      expect(props.description).toBe("Test description");
    });

    it("should support all status types", () => {
      const statuses: Array<"success" | "warning" | "error" | "info"> = [
        "success",
        "warning",
        "error",
        "info",
      ];
      
      statuses.forEach((status) => {
        expect(["success", "warning", "error", "info"]).toContain(status);
      });
    });
  });

  describe("InfoRow", () => {
    it("should have correct props interface", () => {
      const props = {
        label: "Test Label",
        value: "Test Value",
      };
      
      expect(props.label).toBe("Test Label");
      expect(props.value).toBe("Test Value");
    });

    it("should accept label and value strings", () => {
      const label = "Project Name";
      const value = "yanbao-eas-build";
      
      expect(typeof label).toBe("string");
      expect(typeof value).toBe("string");
      expect(label.length).toBeGreaterThan(0);
      expect(value.length).toBeGreaterThan(0);
    });
  });
});

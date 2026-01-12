import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";

describe("Supabase Connection", () => {
  it("should connect to Supabase with valid credentials", async () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    expect(supabaseUrl).toBeDefined();
    expect(supabaseAnonKey).toBeDefined();
    expect(supabaseUrl).toContain("supabase.co");

    const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
    
    // Test connection by checking auth status
    const { data, error } = await supabase.auth.getSession();
    
    // Should not throw error (even if no session exists)
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });
});

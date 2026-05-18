import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-6fcd97d8/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-6fcd97d8/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, role } = body;

    if (!email || !password || !name || !role) {
      return c.json({ error: "Email, password, name, and role are required" }, 400);
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name,
        role, // 'consumer' or 'farmer'
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Error during sign up for ${email}: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    console.log(`User signed up successfully: ${email} as ${role}`);
    return c.json({ 
      success: true, 
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name,
        role: data.user.user_metadata.role,
      }
    });
  } catch (error) {
    console.log(`Sign up error: ${error}`);
    return c.json({ error: "Internal server error during sign up" }, 500);
  }
});

// Get user profile endpoint
app.get("/make-server-6fcd97d8/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized - No token provided" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log(`Authorization error while getting profile: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    return c.json({
      id: user.id,
      email: user.email,
      name: user.user_metadata.name,
      role: user.user_metadata.role,
    });
  } catch (error) {
    console.log(`Get profile error: ${error}`);
    return c.json({ error: "Internal server error while getting profile" }, 500);
  }
});

Deno.serve(app.fetch);
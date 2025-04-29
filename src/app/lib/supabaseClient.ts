// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ggpzelridqabafjlczaj.supabase.co"; // Reemplaza con tu URL de Supabase
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdncHplbHJpZHFhYmFmamxjemFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MDk5NDIsImV4cCI6MjA1NzI4NTk0Mn0.DuqbIhlJnbz7RXge_KbhBmQqM6jgrdglM9DWOz0CIJ4"; // Reemplaza con tu clave anónima

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

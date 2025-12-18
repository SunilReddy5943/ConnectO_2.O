import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://hgzmbrjmmbvhfxxolunr.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImQ0MjgzNWVlLWEzMDYtNGQ1Ni04YzgwLWQ4YzRlZGNmNWZhOSJ9.eyJwcm9qZWN0SWQiOiJoZ3ptYnJqbW1idmhmeHhvbHVuciIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY1NTE3NjI5LCJleHAiOjIwODA4Nzc2MjksImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.vq8R256xwp_XPHkpsP-ZZESMHHvzcqTDY5JZiyTQ0I0';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };
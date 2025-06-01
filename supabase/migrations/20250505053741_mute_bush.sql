/*
  # Create initial schema for file sharing app

  1. New Tables
    - `sessions`
      - `id` (text, primary key) - unique session identifier
      - `created_at` (timestamptz) - when the session was created
      - `expires_at` (timestamptz) - when the session expires
    - `files`
      - `id` (uuid, primary key)
      - `session_id` (text, foreign key) - references sessions.id
      - `name` (text) - original filename
      - `size` (bigint) - file size in bytes
      - `type` (text) - file MIME type
      - `url` (text) - public URL to the file
      - `created_at` (timestamptz) - when the file was uploaded
  2. Security
    - Enable RLS on both tables
    - Add policies for anonymous access (since we're using session IDs for authorization)
*/

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Create files table
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  size BIGINT NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster lookup of files by session
CREATE INDEX IF NOT EXISTS idx_files_session_id ON files(session_id);

-- Enable Row Level Security
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Create policies for sessions
CREATE POLICY "Allow anonymous read for sessions" 
  ON sessions FOR SELECT 
  TO anon 
  USING (true);

CREATE POLICY "Allow anonymous insert for sessions" 
  ON sessions FOR INSERT 
  TO anon 
  WITH CHECK (true);

-- Create policies for files
CREATE POLICY "Allow anonymous read for files" 
  ON files FOR SELECT 
  TO anon 
  USING (true);

CREATE POLICY "Allow anonymous insert for files" 
  ON files FOR INSERT 
  TO anon 
  WITH CHECK (true);

-- Create storage bucket for file uploads
CREATE POLICY "Allow anonymous read for file_uploads storage"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'file_uploads');

CREATE POLICY "Allow anonymous insert for file_uploads storage"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'file_uploads');
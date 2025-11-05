/*
  # Seed test user for authentication
  
  Test credentials:
  - Email: test@example.com
  - Password: TestPassword123!
*/

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'authenticated',
  'authenticated',
  'test@example.com',
  crypt('TestPassword123!', gen_salt('bf')),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, full_name, phone)
VALUES ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Test User', '+2348000000000')
ON CONFLICT (id) DO NOTHING;

insert into public.profiles (id, full_name, phone)
values ('00000000-0000-0000-0000-000000000000', 'Demo User', '+2348000000000')
on conflict (id) do nothing;

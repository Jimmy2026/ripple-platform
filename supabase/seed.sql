-- ============================================================================
-- SEED DATA FOR RIPPLE PLATFORM DEMO
-- Realistic nonprofit scenario with meaningful history
-- ============================================================================

-- Clear existing data (for development only)
TRUNCATE activity_log, ai_outreach_drafts, ai_reports, interactions, donations, campaigns, donors, users, sites, organizations CASCADE;

-- ============================================================================
-- ORGANIZATION & SITES
-- ============================================================================

INSERT INTO organizations (id, name, slug, industry, mission_statement) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Hope Community Network', 'hope-community', 'Community Development', 'Building stronger communities through education, health, and empowerment programs');

INSERT INTO sites (id, organization_id, name, slug, address_city, address_state) VALUES
  ('22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 'Downtown Center', 'downtown', 'Metro City', 'CA'),
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Westside Hub', 'westside', 'Metro City', 'CA'),
  ('22222222-2222-2222-2222-222222222223', '11111111-1111-1111-1111-111111111111', 'Eastside Commons', 'eastside', 'Metro City', 'CA');

-- ============================================================================
-- USERS (Note: These need to be created via Supabase Auth first)
-- ============================================================================

-- Example users (IDs would come from auth.users table)
-- INSERT INTO users (id, email, full_name, role, organization_id, site_id) VALUES
--   ('33333333-3333-3333-3333-333333333331', 'director@hopecommunity.org', 'Maria Rodriguez', 'executive_director', '11111111-1111-1111-1111-111111111111', NULL),
--   ('33333333-3333-3333-3333-333333333332', 'downtown@hopecommunity.org', 'James Chen', 'site_manager', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221'),
--   ('33333333-3333-3333-3333-333333333333', 'westside@hopecommunity.org', 'Aisha Patel', 'site_manager', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'),
--   ('33333333-3333-3333-3333-333333333334', 'development@hopecommunity.org', 'Robert Kim', 'development_lead', '11111111-1111-1111-1111-111111111111', NULL);

-- ============================================================================
-- CAMPAIGNS
-- ============================================================================

INSERT INTO campaigns (id, organization_id, site_id, name, description, goal_amount, start_date, end_date, is_active) VALUES
  ('44444444-4444-4444-4444-444444444441', '11111111-1111-1111-1111-111111111111', NULL, 'Annual Fund 2025', 'Support core operations and programs', 50000.00, '2025-01-01', '2025-12-31', true),
  ('44444444-4444-4444-4444-444444444442', '11111111-1111-1111-1111-111111111111', NULL, 'Holiday Hope Drive', 'Provide holiday meals and gifts to families', 15000.00, '2024-11-01', '2024-12-31', false),
  ('44444444-4444-4444-4444-444444444443', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 'Downtown Renovation', 'Modernize community center facilities', 75000.00, '2025-03-01', '2025-09-30', true),
  ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', NULL, 'Monthly Sustainers', 'Recurring monthly donations for sustainable funding', 120000.00, '2024-01-01', '2025-12-31', true),
  ('44444444-4444-4444-4444-444444444445', '11111111-1111-1111-1111-111111111111', NULL, 'Emergency Response Fund', 'Quick response to community crises', 25000.00, '2025-01-01', '2025-12-31', true);

-- ============================================================================
-- DONORS (150 diverse donors)
-- ============================================================================

-- Major Donors (10)
INSERT INTO donors (organization_id, site_id, first_name, last_name, email, phone, donor_type, tags, notes) VALUES
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 'Sarah', 'Thompson', 'sarah.thompson@email.com', '555-0101', 'individual', ARRAY['major_donor', 'board_member'], 'Board treasurer, passionate about education'),
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Michael', 'Chen', 'mchen@techcorp.com', '555-0102', 'corporate', ARRAY['major_donor', 'corporate'], 'TechCorp Foundation, annual giving'),
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 'Elizabeth', 'Morrison', 'e.morrison@email.com', '555-0103', 'individual', ARRAY['major_donor', 'legacy'], 'Estate planning donor'),
  ('11111111-1111-1111-1111-111111111111', NULL, 'David', 'Park', 'david.park@email.com', '555-0104', 'individual', ARRAY['major_donor', 'monthly'], 'Monthly $500 sustainer'),
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222223', 'Jennifer', 'Williams', 'jwilliams@foundation.org', '555-0105', 'foundation', ARRAY['major_donor', 'grant_maker'], 'Williams Family Foundation'),
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 'Robert', 'Anderson', 'randerson@email.com', '555-0106', 'individual', ARRAY['major_donor'], 'Long-time supporter, prefers phone contact'),
  ('11111111-1111-1111-1111-111111111111', NULL, 'Patricia', 'Garcia', 'pgarcia@email.com', '555-0107', 'individual', ARRAY['major_donor', 'event_sponsor'], 'Gala sponsor 2024'),
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Thomas', 'Lee', 'thomas.lee@email.com', '555-0108', 'individual', ARRAY['major_donor'], 'Anonymous preference'),
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 'Nancy', 'Martinez', 'nancy.m@email.com', '555-0109', 'individual', ARRAY['major_donor', 'monthly'], '$250/month sustainer'),
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222223', 'Christopher', 'Taylor', 'ctaylor@email.com', '555-0110', 'individual', ARRAY['major_donor'], 'Matching gift employer');

-- Monthly Sustainers (30)
INSERT INTO donors (organization_id, site_id, first_name, last_name, email, donor_type, tags) 
SELECT 
  '11111111-1111-1111-1111-111111111111',
  CASE (random() * 2)::int WHEN 0 THEN '22222222-2222-2222-2222-222222222221' WHEN 1 THEN '22222222-2222-2222-2222-222222222222' ELSE '22222222-2222-2222-2222-222222222223' END,
  'Donor' || i,
  'Sustainer' || i,
  'sustainer' || i || '@email.com',
  'individual',
  ARRAY['monthly', 'sustainer']
FROM generate_series(1, 30) i;

-- Regular Donors (60)
INSERT INTO donors (organization_id, site_id, first_name, last_name, email, donor_type, tags)
SELECT 
  '11111111-1111-1111-1111-111111111111',
  CASE (random() * 3)::int WHEN 0 THEN '22222222-2222-2222-2222-222222222221' WHEN 1 THEN '22222222-2222-2222-2222-222222222222' WHEN 2 THEN '22222222-2222-2222-2222-222222222223' ELSE NULL END,
  'Regular' || i,
  'Donor' || i,
  'regular' || i || '@email.com',
  'individual',
  ARRAY['regular']
FROM generate_series(1, 60) i;

-- One-Time Donors (50)
INSERT INTO donors (organization_id, site_id, first_name, last_name, email, donor_type, tags)
SELECT 
  '11111111-1111-1111-1111-111111111111',
  CASE (random() * 3)::int WHEN 0 THEN '22222222-2222-2222-2222-222222222221' WHEN 1 THEN '22222222-2222-2222-2222-222222222222' WHEN 2 THEN '22222222-2222-2222-2222-222222222223' ELSE NULL END,
  'OneTime' || i,
  'Donor' || i,
  'onetime' || i || '@email.com',
  'individual',
  ARRAY['one_time']
FROM generate_series(1, 50) i;

-- ============================================================================
-- DONATIONS (300 over 12 months with realistic patterns)
-- ============================================================================

-- Major donor donations (larger amounts, quarterly)
INSERT INTO donations (donor_id, campaign_id, site_id, amount, donation_date, payment_method)
SELECT 
  d.id,
  '44444444-4444-4444-4444-444444444441',
  COALESCE(d.site_id, '22222222-2222-2222-2222-222222222221'),
  (random() * 4000 + 1000)::numeric(12,2),
  (CURRENT_DATE - (random() * 365)::int),
  'check'
FROM donors d
WHERE 'major_donor' = ANY(d.tags)
  AND random() < 0.9
LIMIT 40;

-- Monthly sustainer donations (consistent amounts)
INSERT INTO donations (donor_id, campaign_id, site_id, amount, donation_date, payment_method, is_recurring, recurring_frequency)
SELECT 
  d.id,
  '44444444-4444-4444-4444-444444444444',
  COALESCE(d.site_id, '22222222-2222-2222-2222-222222222221'),
  (random() * 200 + 50)::numeric(12,2),
  (CURRENT_DATE - (month_offset * 30)),
  'credit_card',
  true,
  'monthly'
FROM donors d
CROSS JOIN generate_series(0, 11) month_offset
WHERE 'monthly' = ANY(d.tags)
  AND random() < 0.95
LIMIT 150;

-- Holiday donations (Nov-Dec spike)
INSERT INTO donations (donor_id, campaign_id, site_id, amount, donation_date, payment_method)
SELECT 
  d.id,
  '44444444-4444-4444-4444-444444444442',
  COALESCE(d.site_id, '22222222-2222-2222-2222-222222222221'),
  (random() * 500 + 50)::numeric(12,2),
  (DATE '2024-11-01' + (random() * 60)::int),
  CASE (random() * 2)::int WHEN 0 THEN 'credit_card' ELSE 'check' END
FROM donors d
WHERE random() < 0.4
LIMIT 80;

-- Regular donations throughout year
INSERT INTO donations (donor_id, campaign_id, site_id, amount, donation_date, payment_method)
SELECT 
  d.id,
  CASE (random() * 4)::int 
    WHEN 0 THEN '44444444-4444-4444-4444-444444444441'
    WHEN 1 THEN '44444444-4444-4444-4444-444444444443'
    WHEN 2 THEN '44444444-4444-4444-4444-444444444445'
    ELSE NULL
  END,
  COALESCE(d.site_id, '22222222-2222-2222-2222-222222222221'),
  (random() * 200 + 25)::numeric(12,2),
  (CURRENT_DATE - (random() * 365)::int),
  CASE (random() * 3)::int 
    WHEN 0 THEN 'credit_card'
    WHEN 1 THEN 'check'
    ELSE 'cash'
  END
FROM donors d
WHERE 'regular' = ANY(d.tags)
LIMIT 30;

-- Sample interactions would require valid user_ids from auth
-- Commenting out as these need actual authenticated users

-- ============================================================================
-- REFRESH COMPUTED STATS
-- ============================================================================

-- The triggers should auto-update, but just to be sure:
UPDATE donors SET updated_at = NOW();
UPDATE campaigns SET updated_at = NOW();


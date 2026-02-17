-- ============================================================================
-- RIPPLE PLATFORM - INITIAL SCHEMA
-- Multi-site nonprofit donor management with living database patterns
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CUSTOM TYPES
-- ============================================================================

CREATE TYPE user_role AS ENUM (
  'executive_director',
  'site_manager', 
  'development_lead',
  'volunteer_coordinator',
  'volunteer',
  'read_only'
);

CREATE TYPE payment_method AS ENUM (
  'credit_card', 
  'check', 
  'wire', 
  'cash', 
  'other'
);

CREATE TYPE interaction_type AS ENUM (
  'call', 
  'email', 
  'meeting', 
  'note', 
  'task'
);

CREATE TYPE interaction_outcome AS ENUM (
  'positive', 
  'neutral', 
  'negative', 
  'no_response', 
  'follow_up_needed'
);

CREATE TYPE report_type AS ENUM (
  'weekly_executive', 
  'monthly_summary', 
  'campaign_performance', 
  'donor_outreach'
);

-- ============================================================================
-- ORGANIZATIONS & SITES
-- ============================================================================

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  industry VARCHAR(100),
  mission_statement TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  address_street VARCHAR(200),
  address_city VARCHAR(100),
  address_state VARCHAR(50),
  address_postal_code VARCHAR(20),
  address_country VARCHAR(50) DEFAULT 'USA',
  phone VARCHAR(20),
  email VARCHAR(254),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(organization_id, slug)
);

CREATE INDEX idx_sites_org ON sites(organization_id) WHERE deleted_at IS NULL;

-- ============================================================================
-- USERS & PERMISSIONS
-- ============================================================================

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(254) UNIQUE NOT NULL,
  full_name VARCHAR(200) NOT NULL,
  role user_role NOT NULL DEFAULT 'read_only',
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_users_org ON users(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_site ON users(site_id) WHERE deleted_at IS NULL;

-- ============================================================================
-- DONORS & DONATIONS
-- ============================================================================

CREATE TABLE donors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
  
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(254),
  phone VARCHAR(20),
  
  address_street VARCHAR(200),
  address_city VARCHAR(100),
  address_state VARCHAR(50),
  address_postal_code VARCHAR(20),
  address_country VARCHAR(50) DEFAULT 'USA',
  
  donor_type VARCHAR(50) DEFAULT 'individual',
  is_anonymous BOOLEAN DEFAULT FALSE,
  preferred_contact_method VARCHAR(20),
  tags TEXT[],
  
  total_donated DECIMAL(12,2) DEFAULT 0,
  donation_count INTEGER DEFAULT 0,
  first_donation_date DATE,
  last_donation_date DATE,
  average_donation DECIMAL(12,2) DEFAULT 0,
  
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_donors_org ON donors(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_donors_site ON donors(site_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_donors_email ON donors(email) WHERE deleted_at IS NULL AND email IS NOT NULL;
CREATE INDEX idx_donors_tags ON donors USING GIN(tags);
CREATE INDEX idx_donors_search ON donors USING gin(
  to_tsvector('english', first_name || ' ' || last_name || ' ' || COALESCE(email, ''))
);

CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
  
  name VARCHAR(200) NOT NULL,
  description TEXT,
  goal_amount DECIMAL(12,2),
  start_date DATE NOT NULL,
  end_date DATE,
  
  total_raised DECIMAL(12,2) DEFAULT 0,
  donor_count INTEGER DEFAULT 0,
  
  is_active BOOLEAN DEFAULT TRUE,
  
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_campaigns_org ON campaigns(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_campaigns_site ON campaigns(site_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date) WHERE deleted_at IS NULL;

CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  donation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  payment_method payment_method NOT NULL,
  payment_reference VARCHAR(100),
  
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_frequency VARCHAR(20),
  
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_donations_donor ON donations(donor_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_donations_site ON donations(site_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_donations_campaign ON donations(campaign_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_donations_date ON donations(donation_date DESC) WHERE deleted_at IS NULL;

-- ============================================================================
-- INTERACTIONS (Living Database Core)
-- ============================================================================

CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  
  interaction_type interaction_type NOT NULL,
  interaction_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  subject VARCHAR(200),
  summary TEXT NOT NULL,
  outcome interaction_outcome,
  
  follow_up_date DATE,
  follow_up_completed BOOLEAN DEFAULT FALSE,
  
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_interactions_donor ON interactions(donor_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_interactions_user ON interactions(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_interactions_site ON interactions(site_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_interactions_date ON interactions(interaction_date DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_interactions_follow_up ON interactions(follow_up_date) 
  WHERE deleted_at IS NULL AND follow_up_completed = FALSE;

-- ============================================================================
-- AI-GENERATED CONTENT & REPORTS
-- ============================================================================

CREATE TABLE ai_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
  
  report_type report_type NOT NULL,
  title VARCHAR(300) NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  period_start DATE,
  period_end DATE,
  
  generated_by UUID REFERENCES users(id),
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_reports_org ON ai_reports(organization_id);
CREATE INDEX idx_ai_reports_date ON ai_reports(generated_at DESC);

CREATE TABLE ai_outreach_drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  subject VARCHAR(300),
  body TEXT NOT NULL,
  tone VARCHAR(50),
  
  was_sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_outreach_donor ON ai_outreach_drafts(donor_id);
CREATE INDEX idx_outreach_user ON ai_outreach_drafts(user_id);

-- ============================================================================
-- ACTIVITY LOG (Audit Trail)
-- ============================================================================

CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  
  changes JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_log_user ON activity_log(user_id);
CREATE INDEX idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_log_date ON activity_log(created_at DESC);
CREATE INDEX idx_activity_log_org ON activity_log(organization_id);

-- ============================================================================
-- TRIGGERS FOR COMPUTED FIELDS
-- ============================================================================

-- Update donor statistics when donations change
CREATE OR REPLACE FUNCTION update_donor_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE donors
    SET 
      total_donated = COALESCE((
        SELECT SUM(amount) 
        FROM donations 
        WHERE donor_id = OLD.donor_id AND deleted_at IS NULL
      ), 0),
      donation_count = COALESCE((
        SELECT COUNT(*) 
        FROM donations 
        WHERE donor_id = OLD.donor_id AND deleted_at IS NULL
      ), 0),
      first_donation_date = (
        SELECT MIN(donation_date) 
        FROM donations 
        WHERE donor_id = OLD.donor_id AND deleted_at IS NULL
      ),
      last_donation_date = (
        SELECT MAX(donation_date) 
        FROM donations 
        WHERE donor_id = OLD.donor_id AND deleted_at IS NULL
      ),
      average_donation = COALESCE((
        SELECT AVG(amount) 
        FROM donations 
        WHERE donor_id = OLD.donor_id AND deleted_at IS NULL
      ), 0),
      updated_at = NOW()
    WHERE id = OLD.donor_id;
    RETURN OLD;
  ELSE
    UPDATE donors
    SET 
      total_donated = COALESCE((
        SELECT SUM(amount) 
        FROM donations 
        WHERE donor_id = NEW.donor_id AND deleted_at IS NULL
      ), 0),
      donation_count = COALESCE((
        SELECT COUNT(*) 
        FROM donations 
        WHERE donor_id = NEW.donor_id AND deleted_at IS NULL
      ), 0),
      first_donation_date = (
        SELECT MIN(donation_date) 
        FROM donations 
        WHERE donor_id = NEW.donor_id AND deleted_at IS NULL
      ),
      last_donation_date = (
        SELECT MAX(donation_date) 
        FROM donations 
        WHERE donor_id = NEW.donor_id AND deleted_at IS NULL
      ),
      average_donation = COALESCE((
        SELECT AVG(amount) 
        FROM donations 
        WHERE donor_id = NEW.donor_id AND deleted_at IS NULL
      ), 0),
      updated_at = NOW()
    WHERE id = NEW.donor_id;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_donor_stats
AFTER INSERT OR UPDATE OR DELETE ON donations
FOR EACH ROW
EXECUTE FUNCTION update_donor_stats();

-- Update campaign statistics
CREATE OR REPLACE FUNCTION update_campaign_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF OLD.campaign_id IS NOT NULL THEN
      UPDATE campaigns
      SET 
        total_raised = COALESCE((
          SELECT SUM(amount) 
          FROM donations 
          WHERE campaign_id = OLD.campaign_id AND deleted_at IS NULL
        ), 0),
        donor_count = COALESCE((
          SELECT COUNT(DISTINCT donor_id) 
          FROM donations 
          WHERE campaign_id = OLD.campaign_id AND deleted_at IS NULL
        ), 0),
        updated_at = NOW()
      WHERE id = OLD.campaign_id;
    END IF;
    RETURN OLD;
  ELSE
    IF NEW.campaign_id IS NOT NULL THEN
      UPDATE campaigns
      SET 
        total_raised = COALESCE((
          SELECT SUM(amount) 
          FROM donations 
          WHERE campaign_id = NEW.campaign_id AND deleted_at IS NULL
        ), 0),
        donor_count = COALESCE((
          SELECT COUNT(DISTINCT donor_id) 
          FROM donations 
          WHERE campaign_id = NEW.campaign_id AND deleted_at IS NULL
        ), 0),
        updated_at = NOW()
      WHERE id = NEW.campaign_id;
    END IF;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_campaign_stats
AFTER INSERT OR UPDATE OR DELETE ON donations
FOR EACH ROW
EXECUTE FUNCTION update_campaign_stats();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON sites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_donors_updated_at BEFORE UPDATE ON donors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_interactions_updated_at BEFORE UPDATE ON interactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- ROW-LEVEL SECURITY
-- ============================================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_outreach_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Users can view their organization
CREATE POLICY "users_view_own_org" ON organizations
  FOR SELECT USING (
    id IN (SELECT organization_id FROM users WHERE id = auth.uid())
  );

-- Users can view sites in their organization
CREATE POLICY "users_view_org_sites" ON sites
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid())
  );

-- Users can view themselves and colleagues
CREATE POLICY "users_view_colleagues" ON users
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid())
  );

-- Donors: Everyone sees org-wide, site managers filtered to their site
CREATE POLICY "users_view_donors" ON donors
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid())
    AND (
      site_id IN (SELECT site_id FROM users WHERE id = auth.uid())
      OR (SELECT role FROM users WHERE id = auth.uid()) IN ('executive_director', 'development_lead')
      OR (SELECT site_id FROM users WHERE id = auth.uid()) IS NULL
    )
  );

-- Similar policies for other tables
CREATE POLICY "users_view_campaigns" ON campaigns
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "users_view_donations" ON donations
  FOR SELECT USING (
    site_id IN (
      SELECT s.id FROM sites s
      JOIN users u ON u.organization_id = s.organization_id
      WHERE u.id = auth.uid()
    )
  );

CREATE POLICY "users_view_interactions" ON interactions
  FOR SELECT USING (
    site_id IN (
      SELECT s.id FROM sites s
      JOIN users u ON u.organization_id = s.organization_id
      WHERE u.id = auth.uid()
    )
  );

-- Allow inserts/updates based on role
CREATE POLICY "users_insert_donors" ON donors
  FOR INSERT WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) 
    NOT IN ('read_only', 'volunteer')
  );

CREATE POLICY "users_insert_donations" ON donations
  FOR INSERT WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) 
    NOT IN ('read_only', 'volunteer')
  );

CREATE POLICY "users_insert_interactions" ON interactions
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
  );

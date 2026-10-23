CREATE TABLE public.quote_requests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 created_at timestamptz NOT NULL DEFAULT now(),
 name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
 phone text NOT NULL CHECK (char_length(phone) BETWEEN 7 AND 30),
 email text NOT NULL CHECK (char_length(email) <= 255),
 property_location text NOT NULL CHECK (char_length(property_location) BETWEEN 1 AND 200),
 service text NOT NULL CHECK (service IN ('Post-Construction Cleaning','Post-Renovation Cleaning','Property Transition Cleaning (Move-In/Move-Out)','Deep Cleaning','Fumigation Services')),
 property_type text NOT NULL CHECK (property_type IN ('Apartment','House','Office','Commercial property','Other')),
 preferred_date date NOT NULL,
 description text NOT NULL CHECK (char_length(description) BETWEEN 10 AND 3000),
 privacy_consent boolean NOT NULL CHECK (privacy_consent = true),
 submission_key uuid NOT NULL UNIQUE
);
GRANT ALL ON public.quote_requests TO service_role;
REVOKE ALL ON public.quote_requests FROM anon, authenticated;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.quote_requests IS 'Private quote enquiries. Only validated server submissions write; owner reviews in Lovable Cloud. No public read access.';
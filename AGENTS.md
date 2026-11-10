<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Quote requests use a shared Zod schema and a public POST server function with a dynamically imported privileged client; the table has no visitor access, keeping enquiries private.
- Submission UUIDs are unique and reused on retries to prevent duplicate enquiries after interrupted responses.
- Owner emails use Lovable managed sending only after an owned sender domain is configured and verified; never simulate delivery or create email queues.
- Non-authentic portfolio imagery and scenarios must be explicitly labelled illustrative and never represented as completed client work.

- Owner dashboard (/dashboard) reads quote_requests from the browser under RLS; only users with the admin role in user_roles can read/update, and admin is auto-granted by a trigger when the owner business email is confirmed — keeps enquiries private without server-side admin reads.
- Admin quotation builder stores each client's quotation as JSON on the quote request row (RLS admin update) — keeps quotes beside the enquiry with no extra table.

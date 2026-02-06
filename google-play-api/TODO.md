# Google Play API CLI - TODO

## Auth status

Current auth is complex (service account JWT + ADC refresh token). Preferred: simple gcloud-based flow.

### Problem
`gcloud auth print-access-token` doesn't support `androidpublisher` scope — only allows cloud-platform, compute, etc.

### Current workaround
```
gcloud auth application-default login --scopes=https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/androidpublisher
```
This writes `~/.config/gcloud/application_default_credentials.json` which the CLI reads automatically.

**Issue:** Got 403 "caller does not have permission" — likely because `tamashavlik@diabtrend.com` is not owner in Play Console. Only the owner can see Settings > API access and configure service accounts.

### Possible solutions

1. **Get owner to grant API access** — whoever created the Play Console account (developer account ID: 5855468761406973686) needs to go to Settings > API access and link the GCP project / grant permissions.

2. **Use existing service account** — There are already service accounts with Play Console access visible in Users & permissions:
   - `android-publish-real-3@api-5855468761406973686-20075.iam.gserviceaccount.com`
   - `apptweak-reply-to-reviews@api-5855468761406973686-20075.iam.gserviceaccount.com`
   - `revenuecat@api-5855468761406973686-20075.iam.gserviceaccount.com`

   If we can get a JSON key for any of these (from GCP console: https://console.cloud.google.com/iam-admin/serviceaccounts?project=api-5855468761406973686-20075), set `GOOGLE_PLAY_CREDENTIALS=/path/to/key.json` and it should work.

3. **Simplify to just gcloud** — strip out the JWT/service-account code, just shell out to `gcloud auth print-access-token` with the right project. Problem: androidpublisher scope still not supported this way.

### Ideal end state
```bash
# one-time setup
gcloud auth application-default login --scopes=https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/androidpublisher

# use
google-play-api reviews list com.diabtrend
```

## Endpoints implemented
- reviews list / get / reply

## Endpoints to add
- inappproducts (CRUD)
- subscriptions (CRUD)
- orders (get, refund)
- edits (for publishing)
- purchases.products / purchases.subscriptionsv2

# storage Specification

## Purpose
TBD - created by archiving change migrate-to-supabase. Update Purpose after archive.
## Requirements
### Requirement: Design File Upload
The system SHALL support uploading PCB Gerber zip files to the Supabase Storage bucket `pcb-designs`.

#### Scenario: Gerber File Upload Successful
- **WHEN** user uploads a Gerber design file named "my-pcb.zip"
- **THEN** save the file to `pcb-designs` under folder `<cart_id_or_user_id>/my-pcb.zip` and return a pre-signed url or path

### Requirement: Design File Relocation
The system SHALL move uploaded design files from a guest folder to an authenticated user's folder in the storage bucket upon sign-in.

#### Scenario: Gerber File Moved Successfully
- **WHEN** user signs in with a guest folder `guest_123` containing "gerber.zip"
- **THEN** copy "gerber.zip" to the user's permanent folder `user_456` and delete the file in `guest_123`


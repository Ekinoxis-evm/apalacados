## Plan: Complete Digital Asset Categories System

This plan covers all aspects discussed for implementing admin-editable, multi-select digital asset categories, while preserving the existing `category` field for stocks.

### Steps
1. **Database Schema**
   - Add `digital_asset_categories` table (id, name).
   - Add `asset_category_links` join table (asset_id, category_id) for many-to-many relationships with `alpha_assets`.
   - Keep the existing `category` TEXT field in `alpha_assets` for stocks and legacy use.

2. **Backend Logic**
   - Implement CRUD operations for categories.
   - Implement endpoints to link/unlink categories to assets.
   - Ensure assets can have multiple categories via the join table.

3. **Admin UI ([app/admin/alpha/page.tsx](app/admin/alpha/page.tsx))**
   - Allow admins to add/edit/delete categories.
   - Enable multi-select category assignment for each asset.
   - Display and manage categories for assets, while keeping the `category` field for stocks.

4. **Data Handling**
   - When displaying or editing assets, show both the multi-select categories (for crypto, etc.) and the single `category` field (for stocks).

### Further Considerations
- No changes to the `category` field logic for stocks.
- Multi-select categories are for digital assets (crypto, etc.) only.
- The system is scalable and admin-friendly.
/* ==========================================================================
   THE REEL DEAL DECK — blog.js
   --------------------------------------------------------------------------
   Progressive enhancement only, loaded with `defer`. Exactly one job:
   let a reader dismiss the sitewide order bar and have it stay
   dismissed.

   With JS off the bar renders, reads fine, and simply cannot be dismissed —
   which is why the close button ships `hidden` and is revealed here. A dead
   button is worse than no button.

   The dismissal is keyed to the bar's STATE ("shop" / "onsite"), so when the
   hosted store URL appears and the copy changes, a reader who hid the old bar sees the
   new one. Hiding an announcement is not a permanent opt-out of all future
   announcements.
   ========================================================================== */
/* The order-bar dismissal moved to site.js when the bar became sitewide. */

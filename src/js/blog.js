/* ==========================================================================
   THE REEL DEAL DECK — blog.js
   --------------------------------------------------------------------------
   Progressive enhancement only, loaded with `defer`. Exactly one job:
   let a reader dismiss the campaign announcement bar and have it stay
   dismissed.

   With JS off the bar renders, reads fine, and simply cannot be dismissed —
   which is why the close button ships `hidden` and is revealed here. A dead
   button is worse than no button.

   The dismissal is keyed to the campaign STATE ("live" / "after"), so when the
   campaign ends and the copy changes, a reader who hid the old bar sees the
   new one. Hiding an announcement is not a permanent opt-out of all future
   announcements.
   ========================================================================== */
/* The campaign-bar dismissal moved to site.js when the bar became sitewide. */

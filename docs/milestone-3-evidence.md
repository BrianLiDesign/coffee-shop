# Milestone 3 evidence

PR link: https://github.com/BrianLiDesign/coffee-shop/pull/38

## Test cases and what they protect

1. `rejects invalid submission before sending a write request`  
   Protects the form from creating a new offering with incomplete or malformed data, ensuring a bad save never reaches the API.

2. `clears only the corrected field error after a user fixes one input`  
   Protects the user flow for incremental validation: when one field is corrected, only that field's error clears while unrelated validation errors remain visible.

3. `resets the form and special-offer checkbox after a successful save`  
   Protects against stale state after a created offering is accepted, making sure the form returns to its default values and the special-offer toggle resets for the next entry.

## Browser review

The management form was checked at both desktop and mobile widths on `/manage-offerings` and with keyboard-only focus traversal. At 1280×900 the form remained readable and usable; at 390×844 it still rendered without content overlap and kept the save flow accessible. Keyboard checks confirmed focus moved through the special-offer checkbox, name, description, price, category, and Save button in sequence. This confirms the invalid-save guard rails, field-level error updates, and successful reset behavior remain available without a mouse.

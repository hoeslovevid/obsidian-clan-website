# Editing the Admins Section

The list of clan/Discord admins is driven by **`data/admins.js`**. You can edit it in any text editor.

## What to edit

1. **Open `data/admins.js`** in Notepad, VS Code, or any editor.

2. **Each admin is one object** with:
   - **name** – Display name (e.g. in-game or Discord name).
   - **role** – Title (e.g. "Clan Leader", "Discord Admin", "Officer").
   - **image** – Path to their profile picture (e.g. `"images/admins/username.jpg"`).
   - **link** – Optional. Discord profile or other URL. Use `""` if you don’t want a link.

3. **To add an admin:** Copy one of the `{ ... }` blocks, paste it in the list, and change the values.

4. **To remove an admin:** Delete that admin’s entire `{ ... },` block.

5. **Profile pictures:**
   - Put image files in the **`images/admins/`** folder (create it if needed).
   - Use JPG, PNG, or WebP.
   - In `admins.js`, set `image` to that path, e.g. `"images/admins/myname.png"`.

## Example

```js
{
  name: "YourName",
  role: "Clan Leader",
  image: "images/admins/yourname.jpg",
  link: "https://discord.com/users/123456789"
}
```

Save the file and refresh the website to see your changes.

# easy-crypt


## Commands
- use string [ --force<boolean>, --purge<boolean> ]
  - Change the default user
  - if --force, create a new user.
  - if --purge, delete the given user. (password required)
  
- set string [ --salt<string> ]
  - Set a crypt value, 
  - if --salt, use the target file as a salt instead of default user
  
- get string [ --salt<string>, --noclip<boolean>, --purge<boolean>, --output<string> ]
  - Get a crypt value, 
  - if --salt, use the target file as a salt instead of default user,
  - if --noclip, send the value to the clipboard (True by default),
  - if --output, send the value to a target file
  - if --purge, delete the value

- sync string [ --force<boolean>, --purge<boolean> ]
  - Sync data of a given table, or all if '*'
  - if --force, use the given string to set the target
  - if --purge, 

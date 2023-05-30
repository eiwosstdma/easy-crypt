# Easy crypt

## Commands
- use string [ --force<boolean>, --purge<boolean> ]
  - Change the default user
  - if --force, create a new user.
  - if --purge, delete the given user. (password required)
  
- set string [ --salt<string> ]
  - Set a crypt value, 
  - if --salt, use the target file as a salt instead of default user
  
- get string [ --salt<string>, --noclip<boolean>, --clear<boolean>, --output<string>, --purge ]
  - Get a crypt value, 
  - if --salt, use the target file as a salt instead of default user,
  - if --noclip, send the value to the clipboard (True by default),
  - if --output, send the value to a target file
  - if --clear, delete the value
  
- enc string [ --salt<string>, --copy<boolean>  ]
  - Encrypt a given file(path),
  - if --salt, use the target file as a salt instead of default user,
  - if --copy, you have back a non-encrypted copy along with the encrypted file
  
- dec string [ --salt<string>, --clip<boolean>, --clear<boolean>, --output<string> ]
  - if --salt, use the target file as a salt instead of default user,
  - if --clip, send the result to the clipboard instead of file
  - if --clear, delete the value
  - if --output, send the decrypted file to the targeted path

export default function() {
  const lines = [
    '\nEasy crypt is a tiny command line interface tool to easily save your data securely',
    '\nCommands:',
    '  help: Display all commands. [ alias -h ]',
    '   use: Create a user with force flag or change the default user salts and alike. [ alias: -u, flags: -f, -p ]',
    '   set: Encrypt a value that is saved behind a password and with the given label. [ alias: -s, flags: -t ]',
    '   get: Decrypt a value that has been saved under a given label, using a password onto your clipboard. [ alias: -g, flags: -t, -p, -n, -o ]',
    '\nFlags:',
    ' force: Used to create user when using the command use. [ alias: -f ]',
    ' purge: Used to delete a value, user or encrypted. [ alias: -p ]',
    '  salt: Target file path for a custom salt that is not the default user or root. [ alias: -t ]',
    'noclip: If you don\'t want to have the output of a get in your clipboard. [ alias: -n ]',
    'output: If you want the output of a get to be put in a specific non-existing file. [ alias: -o ]',
  ];

  for (const line of lines)
    console.log(line);
}

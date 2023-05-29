export default function() {
  const lines = [
    '\nEasy crypt is a tiny command line interface tool to easily save your data securely',
    '\nCommands:',
    '  help: Display all commands. ex: "tc --help"',
    '   use: Create a user with force flag or change the default user salts and alike. [ --force ] ex: "tc --use <myName>" ',
  ];

  for (const line of lines)
    console.log(line);
}

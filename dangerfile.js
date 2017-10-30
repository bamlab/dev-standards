const fs = require("fs");
const path = require("path");
const { includes, concat } = require("lodash");

const modifiedFiles = danger.git.modified_files;
const newFiles = danger.git.created_files;
const changedFiles = [...modifiedFiles, ...newFiles];

const moFiles = changedFiles.filter(p => includes(p, ".mo.md"));
const standardFiles = changedFiles.filter(p => includes(p, ".s.md"));
const readmeContent = fs.readFileSync("README.MD").toString();
const summaryContent = fs.readFileSync("SUMMARY.MD").toString();

for (let moFile of moFiles) {
  const fileContent = fs.readFileSync(moFile).toString();
  const fileInfos = path.parse(moFile);
  const fileUrl = danger.github.utils.fileLinks([moFile]);

  if (!fileContent.match(/^# \[MO\] /)) fail(`**${fileUrl}**: Title doesn't contain \`[MO]\` tag at the begining`);
  if (!fileContent.match(/## Owner: .+/)) fail(`**${fileUrl}**: MO doesn't have an *Owner*, could it be you?`);
  if (!fileContent.match(/## Prerequisites/))
    warn(`**${fileUrl}**: MO doesn't contain a *Prerequisites* part are you sure your brain is all you need?`);
  if (!fileContent.match(/## Steps/))
    fail(`**${fileUrl}**: MO doesn't have a *Steps* part, how could you call this an MO?`);
  if (!fileContent.match(/## Troubleshooting/)) warn(`**${fileUrl}**: Seems you do not need a *Troubleshoot* part`);
  if (!readmeContent.match(moFile)) warn(`**${fileUrl}**: Does not seem to be included in the root readme`);
}

for (let standardFile of standardFiles) {
  const fileContent = fs.readFileSync(standardFile).toString();
  const fileInfos = path.parse(standardFile);
  const fileUrl = danger.github.utils.fileLinks([standardFile]);

  if (!fileContent.match(/^# \[Standard\] /))
    fail(`**${fileUrl}**: Title doesn't contain \`[Standard]\` tag at the begining`);
  if (!fileContent.match(/## Owner: .+/)) fail(`**${fileUrl}**: Standard doesn't have an *Owner*, could it be you?`);
  if (!fileContent.match(/## Checks/))
    fail(`**${fileUrl}**: Standard doesn't have a *Checks* part, how could you call this an Standard?`);
  if (!fileContent.match(/Bad Examples?/i)) fail(`**${fileUrl}**: You failed to mention a *Bad Examples*`);
  if (!fileContent.match(/Good Examples?/i)) fail(`**${fileUrl}**: You failed to mention a *Good Examples* `);
  if (!readmeContent.match(standardFile)) warn(`**${fileUrl}**: Does not seem to be included in the root readme`);
  if (!summaryContent.match(standardFile)) warn(`**${fileUrl}**: Does not seem to be included in the root summary`);
}

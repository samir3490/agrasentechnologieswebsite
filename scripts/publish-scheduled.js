const fs = require("fs");

const today = new Date().toISOString().split("T")[0];
console.log("Today is " + today);

const scheduledPath = "src/data/scheduled-posts.ts";
const postsPath = "src/data/posts.ts";

let scheduled = fs.readFileSync(scheduledPath, "utf8");
let posts = fs.readFileSync(postsPath, "utf8");

const postBlockRegex = /  \{[\s\S]*?\n  \}/g;
const dateRegex = /date:\s*"(\d{4}-\d{2}-\d{2})"/;

const allBlocks = scheduled.match(postBlockRegex) || [];

if (allBlocks.length === 0) {
  console.log("No scheduled posts found.");
  process.exit(0);
}

const toPublish = [];
const toKeep = [];

for (const block of allBlocks) {
  const dateMatch = block.match(dateRegex);
  if (dateMatch && dateMatch[1] <= today) {
    toPublish.push(block);
    console.log(
      "Publishing: " + (block.match(/title:\s*"([^"]+)"/) || [])[1]
    );
  } else {
    toKeep.push(block);
  }
}

if (toPublish.length === 0) {
  console.log("No posts to publish today");
  process.exit(0);
}

const scheduledHeader = scheduled.match(
  /^[\s\S]*?export const scheduledPosts:\s*BlogPost\[\]\s*=\s*\[/
)[0];
let newScheduledBody;
if (toKeep.length === 0) {
  newScheduledBody = "\n];";
} else {
  newScheduledBody = "\n" + toKeep.join(",\n") + ",\n];";
}
fs.writeFileSync(scheduledPath, scheduledHeader + newScheduledBody + "\n");

const insertionPoint = "export const posts: BlogPost[] = [";
const insertionBlocks = toPublish.map((b) => b + ",").join("\n");
posts = posts.replace(
  insertionPoint,
  insertionPoint + "\n" + insertionBlocks
);
fs.writeFileSync(postsPath, posts);

console.log("Published " + toPublish.length + " post(s)");

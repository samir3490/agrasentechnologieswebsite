import { NextResponse } from "next/server";

const REPO = process.env.GITHUB_REPO || "samir3490/agrasentechnologieswebsite";
const FILE_PATH = "src/data/posts.ts";

function verifyToken(token: string): boolean {
  try {
    const decoded = atob(token);
    const adminPassword = process.env.ADMIN_PASSWORD || "";
    return decoded.startsWith(adminPassword) && adminPassword.length > 0;
  } catch {
    return false;
  }
}

function escapeForTemplateLiteral(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
}

function buildPostEntry(post: {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  image: string;
  content: string;
}): string {
  const today = new Date().toISOString().split("T")[0];
  const safeContent = escapeForTemplateLiteral(post.content);
  const safeTitle = post.title.replace(/"/g, '\\"');
  const safeExcerpt = post.excerpt.replace(/"/g, '\\"');

  return `  {
    slug: "${post.slug}",
    title: "${safeTitle}",
    date: "${today}",
    author: "Samir Agrawal",
    category: "${post.category}",
    excerpt: "${safeExcerpt}",
    image: "${post.image || "/blog/default.jpg"}",
    content: \`${safeContent}\`,
  },\n`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, category, excerpt, image, content, token } = body;

    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 },
      );
    }

    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      return NextResponse.json(
        { error: "Server configuration error: missing GitHub token" },
        { status: 500 },
      );
    }

    const apiUrl = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;
    const headers = {
      Authorization: `Bearer ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    };

    // 1. Fetch the current file
    const getRes = await fetch(apiUrl, { headers });

    if (!getRes.ok) {
      const errText = await getRes.text();
      return NextResponse.json(
        { error: `Failed to fetch posts file: ${errText}` },
        { status: 500 },
      );
    }

    const fileData = await getRes.json();
    const currentContent = Buffer.from(fileData.content, "base64").toString(
      "utf-8",
    );
    const sha = fileData.sha;

    // 2. Find the insertion point — right after the opening `[` of the posts array
    const arrayMatch = currentContent.match(
      /export\s+const\s+posts\s*:\s*BlogPost\[\]\s*=\s*\[/,
    );

    if (!arrayMatch || arrayMatch.index === undefined) {
      return NextResponse.json(
        { error: "Could not find posts array in file" },
        { status: 500 },
      );
    }

    const insertIndex = arrayMatch.index + arrayMatch[0].length;
    const newEntry = buildPostEntry({
      title,
      slug,
      category,
      excerpt,
      image,
      content,
    });

    const updatedContent =
      currentContent.slice(0, insertIndex) +
      "\n" +
      newEntry +
      currentContent.slice(insertIndex);

    // 3. Commit the updated file
    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `blog: add "${title}"`,
        content: Buffer.from(updatedContent).toString("base64"),
        sha,
      }),
    });

    if (!putRes.ok) {
      const errText = await putRes.text();
      return NextResponse.json(
        { error: `Failed to commit: ${errText}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, slug });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

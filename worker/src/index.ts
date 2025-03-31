import { Hono } from "hono";
import { env, getRuntimeKey } from "hono/adapter";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/files/:path{.+}", async (c) => {
  const path = c.req.param("path");

  if (path === "" || path.endsWith("/")) {
    const apiUrl = `https://api.github.com/repos/Lukas1h/filesharing/contents/${path}`;
    console.log(`Bearer ${env(c).GITHUB_TOKEN}`);
    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "lukashahn.art",
        Authorization: `Bearer ${env(c).GITHUB_TOKEN}`,
      },
      method: "GET",
    });
    if (!response.ok) {
      return c.text(await response.text(), 500);
    }

    const contents = await response.json();
    if (Array.isArray(contents)) {
      const listItems = contents
        .map((item) => {
          if (item.type === "file") {
            return `<a href="${`https://github.com/Lukas1h/filesharing/blob/main/${item.path}?raw=true`}">${
              item.name
            }</a>`;
          } else if (item.type === "dir") {
            return `<a href="${`/files/${item.path}/`}">${item.name}/</a>`;
          }
        })
        .join("<br>\n");

      let html = `
      <p>${path}</p>
      <ul>${listItems}</ul>
      `;

      return c.html(listItems);
    } else {
      return c.text("Invalid directory contents.", 500);
    }
  }

  return c.redirect(
    `https://github.com/Lukas1h/filesharing/blob/main/${path}?raw=true`
  );
});

export default app;

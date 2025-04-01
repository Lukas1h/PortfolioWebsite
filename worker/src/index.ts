import { Hono } from "hono";
import { env, getRuntimeKey } from "hono/adapter";

const app = new Hono();

app.get("/", async (c) => {
  const path = "/";
  const apiUrl = `https://api.github.com/repos/${env(c).REPO}/contents/${path}`;
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
          return `<a href="${`https://github.com/${env(c).REPO}/blob/main/${
            item.path
          }?raw=true`}">${item.name}</a>`;
        } else if (item.type === "dir") {
          return `<a href="${`/${item.path}/`}">${item.name}/</a>`;
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
});

app.get("/:path{.+}", async (c) => {
  const path = c.req.param("path");

  if (path === "" || path.endsWith("/")) {
    const apiUrl = `https://api.github.com/repos/${
      env(c).REPO
    }/contents/${path}`;
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
            return `<a href="${`https://github.com/${env(c).REPO}/blob/main/${
              item.path
            }?raw=true`}">${item.name}</a>`;
          } else if (item.type === "dir") {
            return `<a href="${`/${item.path}/`}">${item.name}/</a>`;
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
    `https://github.com/${env(c).REPO}/blob/main/${path}?raw=true`
  );
});

export default app;

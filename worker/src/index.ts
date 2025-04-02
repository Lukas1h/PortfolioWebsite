import { Hono } from "hono";
import { env, getRuntimeKey } from "hono/adapter";

const app = new Hono();

//Hack to get around github cache.
function getUniqueRepo(username) {
  const letters = username
    .split("")
    .map((c, i) => (/[a-zA-Z]/.test(c) ? i : -1))
    .filter((i) => i !== -1);
  const totalCombinations = 1 << letters.length; // 2^number of letters
  const windowSize = 300000 / totalCombinations; // Adjust window size based on total combinations

  const baseTime = Math.floor(Date.now() / windowSize);
  const comboIndex = baseTime % totalCombinations; // Get index in cycle

  let result = username.split("");
  letters.forEach((letterIndex, i) => {
    if (comboIndex & (1 << i)) {
      result[letterIndex] = result[letterIndex].toUpperCase();
    } else {
      result[letterIndex] = result[letterIndex].toLowerCase();
    }
  });

  return result.join("");
}

app.get("/", async (c) => {
  const path = "/";
  const apiUrl = `https://api.github.com/repos/${getUniqueRepo(
    env(c).REPO
  )}/contents/${path}`;
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
          return `<a href="${`/${item.path}`}">${item.name}</a>`;
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
    const apiUrl = `https://api.github.com/repos/${getUniqueRepo(
      env(c).REPO
    )}/contents/${path}`;
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
            return `<a href="${`/${item.path}`}">${item.name}</a>`;
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
    `https://github.com/${getUniqueRepo(
      env(c).REPO
    )}/blob/main/${path}?raw=true`
  );
});

export default app;

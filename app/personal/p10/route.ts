import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

import { blogList } from "@/app/lib/data/blogList";

async function insertFunction() {
  await sql`
    CREATE TABLE IF NOT EXISTS blog (
      title VARCHAR(500) NOT NULL PRIMARY KEY,
      page VARCHAR(255) NOT NULL,
      time VARCHAR(100) NOT NULL,
      url VARCHAR(1200) NOT NULL,
      description TEXT NOT NULL,
      iconName VARCHAR(100) NOT NULL
    )
  `;

  const insertedValues = await Promise.all(
    blogList.map((blog) => {
      return sql`
      INSERT INTO blog (title, page, time, url, description, iconName)
        VALUES (${blog.title}, ${blog.page}, ${blog.time}, ${blog.url}, ${blog.description}, ${blog.iconName})
        ON CONFLICT (title) DO UPDATE SET 
          page = EXCLUDED.page,
          time = EXCLUDED.time,
          url = EXCLUDED.url,
          description = EXCLUDED.description,
          iconName = EXCLUDED.iconName
      `;
    })
  );
  return insertedValues;
}

export async function GET() {
  try {
    const result = await sql.begin((sql) => [insertFunction()]);
    console.log("LINT: SQL is : ", sql, " and result is : ", result);
    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

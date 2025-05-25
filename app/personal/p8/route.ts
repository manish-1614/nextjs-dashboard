import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

import { deedsList } from "@/app/lib/data/deedsList";

async function insertFunction() {
  await sql`
    CREATE TABLE IF NOT EXISTS deeds (
      title VARCHAR(255) NOT NULL PRIMARY KEY,
      imageurl VARCHAR(1200) NOT NULL,
      description TEXT NOT NULL
    )
  `;

  const insertedValues = await Promise.all(
    deedsList.map((deeds: any) => {
      return sql`
      INSERT INTO deeds (title, imageurl, description)
      VALUES (${deeds.title}, ${deeds.imageUrl}, ${deeds.description})
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

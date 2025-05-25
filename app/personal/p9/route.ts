import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

import { certificatesList } from "@/app/lib/data/certificates";

async function insertFunction() {
  await sql`
    CREATE TABLE IF NOT EXISTS certificate (
      title VARCHAR(255) NOT NULL PRIMARY KEY,
      url VARCHAR(1200) NOT NULL,
      thumbnail VARCHAR(1200) NOT NULL
    )
  `;

  const insertedValues = await Promise.all(
    certificatesList.map((certificate: any) => {
      return sql`
      INSERT INTO certificate (title, url, thumbnail)
      VALUES (${certificate.title}, ${certificate.url}, ${certificate.thumbnail})
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

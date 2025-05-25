import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

import { educations } from "@/app/lib/data/education";

async function insertFunction() {
  await sql`
    CREATE TABLE IF NOT EXISTS education (
      name VARCHAR(255) NOT NULL PRIMARY KEY,
      course VARCHAR(255) NOT NULL,
      duration VARCHAR(255) NOT NULL,
      score VARCHAR(255) NOT NULL,
      work TEXT[] NOT NULL
    )
  `;

  const insertedValues = await Promise.all(
    educations.map((education: any) => {
      return sql`
      INSERT INTO education (name, course, duration, score, work)
      VALUES (${education.name}, ${education.course}, ${education.duration}, ${education.score}, ${education.work})
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

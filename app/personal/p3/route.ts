import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

import { workExperiences } from "@/app/lib/data/workExperience";

async function workExperienceFunction() {
  await sql`
        CREATE TABLE IF NOT EXISTS workExperiences (
            title VARCHAR(255) PRIMARY KEY NOT NULL,
            company VARCHAR(255) NOT NULL,
            duration VARCHAR(255) NOT NULL,
            details VARCHAR(1500)[] NOT NULL
        );
    `;

  const insertedWorkExperiences = await Promise.all(
    workExperiences.map((workExperience) => {
      sql`
    INSERT INTO workExperiences (title, company, duration, details) 
    VALUES (${workExperience.title}, ${workExperience.company}, ${workExperience.duration}, ${workExperience.details});
`;
    })
  );
  return insertedWorkExperiences;
}



export async function GET() {
  try {
    const result = await sql.begin((sql) => [
      workExperienceFunction(),
    ]);
    console.log("LINT: SQL is : ", sql, " and result is : ", result);
    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

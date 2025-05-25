import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

import { recognitions } from "@/app/lib/data/recognitions";

async function insertFunction() {
  await sql`
        CREATE TABLE IF NOT EXISTS recognition (
            topic VARCHAR(255) NOT NULL,
            title VARCHAR(400) NOT NULL PRIMARY KEY,
            company VARCHAR(255) NOT NULL,
            time VARCHAR(255) NOT NULL,
            url VARCHAR(500) NOT NULL,
            description VARCHAR(1500) NOT NULL
        );
    `;

  const insertedRecognitions = await Promise.all(
    recognitions.map((recognition) => {
      return sql`
        INSERT INTO recognition (
            topic,
            title,
            company,
            time,
            url,
            description
        )
        VALUES (
            ${recognition.topic},
            ${recognition.title},
            ${recognition.company},
            ${recognition.time},
            ${recognition.url},
            ${recognition.description}
        )
        ON CONFLICT (title) DO NOTHING;
        `;
    })
  );
  return insertedRecognitions;
}



export async function GET() {
  try {
    const result = await sql.begin((sql) => [
      insertFunction(),
    ]);
    console.log("LINT: SQL is : ", sql, " and result is : ", result);
    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

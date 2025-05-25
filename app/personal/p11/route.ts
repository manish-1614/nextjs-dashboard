import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

import { accomplishments } from "@/app/lib/data/accomplishments";
import { affiliatedBadges, badgesList } from "@/app/lib/data/badgesList"

async function insertAccomplishmentsFunction() {
  await sql`
    CREATE TABLE IF NOT EXISTS accomplishment (
      id SERIAL PRIMARY KEY,
      type VARCHAR(100) NOT NULL,
      title VARCHAR(500) NOT NULL,
      author VARCHAR(255),
      url VARCHAR(1000) NOT NULL
    )
  `;

  const insertedValues = await Promise.all(
    accomplishments.map((accomplishment) => {
      return sql`
        INSERT INTO accomplishment (type, title, author, url)
        VALUES (${accomplishment.type}, ${accomplishment.title}, ${accomplishment.author || null}, ${accomplishment.url})
      `;
    })
  );
  return insertedValues;
}

async function insertAffiliatedBadgesFunction() {
  await sql`
    CREATE TABLE IF NOT EXISTS affiliated_badges (
      title VARCHAR(500) NOT NULL PRIMARY KEY,
      url VARCHAR(1000) NOT NULL,
      imageUrl VARCHAR(1000) NOT NULL,
      date VARCHAR(100) NOT NULL
    )
  `;

  const insertedValues = await Promise.all(
    affiliatedBadges.map((badge) => {
      return sql`
        INSERT INTO affiliated_badges (title, url, imageUrl, date)
        VALUES (${badge.title}, ${badge.url}, ${badge.imageUrl}, ${badge.date})
        ON CONFLICT (title) DO UPDATE SET 
          url = EXCLUDED.url,
          imageUrl = EXCLUDED.imageUrl,
          date = EXCLUDED.date
      `;
    })
  );
  return insertedValues;
}

async function insertBadgesListFunction() {
  await sql`
    CREATE TABLE IF NOT EXISTS badges_list (
      title VARCHAR(500) NOT NULL PRIMARY KEY,
      imageUrl VARCHAR(1000) NOT NULL,
      date VARCHAR(100) NOT NULL
    )
  `;

  const insertedValues = await Promise.all(
    badgesList.map((badge) => {
      return sql`
        INSERT INTO badges_list (title, imageUrl, date)
        VALUES (${badge.title}, ${badge.imageUrl}, ${badge.date})
        ON CONFLICT (title) DO UPDATE SET 
          imageUrl = EXCLUDED.imageUrl,
          date = EXCLUDED.date
      `;
    })
  );
  return insertedValues;
}

export async function GET() {
  try {
    const result = await sql.begin(async (sql) => {
      const accomplishmentsResult = await insertAccomplishmentsFunction();
      const affiliatedBadgesResult = await insertAffiliatedBadgesFunction();
      const badgesListResult = await insertBadgesListFunction();
      return [accomplishmentsResult, affiliatedBadgesResult, badgesListResult];
    });
    console.log("Database seeding completed successfully:", result);
    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error("Database seeding error:", error);
    return Response.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

import {ratedSkills, techStackIcons } from "@/app/lib/data/skills"


async function ratedSkillsFunction() {
    await sql`
        CREATE TABLE IF NOT EXISTS ratedSkills (
            name VARCHAR(255) PRIMARY KEY NOT NULL,
            rating DECIMAL(2,1) NOT NULL
        );
    `;

    const insertedRatedSkills = await Promise.all(
        ratedSkills.map(
            (ratedSkill) => sql`
                INSERT INTO ratedSkills (name, rating) VALUES (${ratedSkill.skill}, ${ratedSkill.rating}) ON CONFLICT (name) DO UPDATE SET rating = EXCLUDED.rating;
            `
        )
    );
    return insertedRatedSkills;
}   

async function techStackIconsFunction() {

    
    await sql`
        CREATE TABLE IF NOT EXISTS techStackIcons (
            reacticon VARCHAR(255) PRIMARY KEY NOT NULL
        );
    `;

    const insertedTechStackIcons = await Promise.all(
        techStackIcons.map(
            iconName => sql`
                INSERT INTO techStackIcons (reacticon) VALUES (${iconName}) ON CONFLICT (reacticon) DO NOTHING;
            `
        )
    );
    
    return insertedTechStackIcons;
}

export async function GET() {
  try {
    const result = await sql.begin((sql) => [
        ratedSkillsFunction(),
        techStackIconsFunction()
    ]);
    console.log("LINT: SQL is : ", sql, " and result is : ", result);
    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

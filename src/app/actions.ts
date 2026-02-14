"use server";

export async function getStandings(leagueCode: string) {
  const apiKey = process.env.NEXT_PUBLIC_STANDINGS_KEY;

  if (!apiKey) {
    console.error("API Key is missing in .env.local");
    return null;
  }

  try {
    const response = await fetch(
      `https://api.football-data.org/v4/competitions/${leagueCode}/standings`,
      {
        headers: {
          // THIS IS THE LINE THAT FIXES YOUR ISSUE:
          "X-Auth-Token": apiKey, 
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
        // This will print the exact error from the API to your VS Code terminal
        const errorText = await response.text();
        console.error(`API Error (${response.status}):`, errorText);
        return null;
    }

    const data = await response.json();
    return data.standings.find((s: any) => s.type === 'TOTAL')?.table || [];
    
  } catch (error) {
    console.error("Fetch Error:", error);
    return null;
  }
}
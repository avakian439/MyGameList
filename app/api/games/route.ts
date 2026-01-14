import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import games from "../../dashboard/data/games.json";
import { Game } from "../../../lib/types";
import { getGameDetails } from "../../../lib/rawg-api";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("id");

    if (gameId) {
        // First, check if game exists locally
        const localGame = (games as Record<string, Game>)[gameId];
        if (localGame) {
            return NextResponse.json(localGame);
        }
        
        // If not found locally, fetch from RAWG API
        try {
            const gameFromApi = await getGameDetails(Number(gameId));
            
            // Optionally save to local storage for future use
            const gamesPath = path.join(process.cwd(), "app/dashboard/data/games.json");
            const fileContent = await fs.readFile(gamesPath, "utf-8");
            const currentGames = JSON.parse(fileContent) as Record<string, Game>;
            currentGames[gameId] = gameFromApi;
            await fs.writeFile(gamesPath, JSON.stringify(currentGames, null, 2));
            
            return NextResponse.json(gameFromApi);
        } catch (error) {
            console.error("Error fetching game from RAWG API:", error);
            return NextResponse.json(
                { error: "Game not found" },
                { status: 404 }
            );
        }
    }

    // Return all games
    const allGames = Object.entries(games).map(([_, game]) => game);

    return NextResponse.json({ games: allGames, total: allGames.length });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, ...gameData } = body as { id: number } & Partial<Game>;

        if (!id || !gameData.name) {
            return NextResponse.json(
                { error: "id and name are required" },
                { status: 400 }
            );
        }

        // Read current games data
        const gamesPath = path.join(process.cwd(), "app/dashboard/data/games.json");
        const fileContent = await fs.readFile(gamesPath, "utf-8");
        const currentGames = JSON.parse(fileContent) as Record<string, Game>;

        // Check if game already exists
        if (currentGames[id]) {
            return NextResponse.json(
                { error: "Game with this ID already exists. Use PUT to update." },
                { status: 409 }
            );
        }

        // Add new game with proper structure
        const newGame: Game = {
            id,
            name: gameData.name,
            ...gameData
        };

        currentGames[id] = newGame;

        // Write updated data back to file
        await fs.writeFile(gamesPath, JSON.stringify(currentGames, null, 2));

        return NextResponse.json({
            success: true,
            message: "Game added successfully",
            game: newGame
        });

    } catch (error) {
        console.error("Error adding game:", error);
        return NextResponse.json(
            { error: "Failed to add game" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updateData } = body as { id: number } & Partial<Game>;

        if (!id) {
            return NextResponse.json(
                { error: "id is required" },
                { status: 400 }
            );
        }

        // Read current games data
        const gamesPath = path.join(process.cwd(), "app/dashboard/data/games.json");
        const fileContent = await fs.readFile(gamesPath, "utf-8");
        const currentGames = JSON.parse(fileContent) as Record<string, Game>;

        // Check if game exists
        if (!currentGames[id]) {
            return NextResponse.json(
                { error: "Game not found" },
                { status: 404 }
            );
        }

        // Update game with proper type checking
        currentGames[id] = {
            ...currentGames[id],
            ...updateData
        };

        // Write updated data back to file
        await fs.writeFile(gamesPath, JSON.stringify(currentGames, null, 2));

        return NextResponse.json({
            success: true,
            message: "Game updated successfully",
            game: currentGames[id]
        });

    } catch (error) {
        console.error("Error updating game:", error);
        return NextResponse.json(
            { error: "Failed to update game" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "id is required" },
                { status: 400 }
            );
        }

        // Read current games data
        const gamesPath = path.join(process.cwd(), "app/dashboard/data/games.json");
        const fileContent = await fs.readFile(gamesPath, "utf-8");
        const currentGames = JSON.parse(fileContent) as Record<string, Game>;

        // Check if game exists
        if (!currentGames[id]) {
            return NextResponse.json(
                { error: "Game not found" },
                { status: 404 }
            );
        }

        // Delete game
        delete currentGames[id];

        // Write updated data back to file
        await fs.writeFile(gamesPath, JSON.stringify(currentGames, null, 2));

        return NextResponse.json({
            success: true,
            message: "Game deleted successfully",
            id
        });

    } catch (error) {
        console.error("Error deleting game:", error);
        return NextResponse.json(
            { error: "Failed to delete game" },
            { status: 500 }
        );
    }
}

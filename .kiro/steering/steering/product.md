# Product Overview

PixelFactory is an AI-powered pixel art generator for game developers. Users can generate pixel art characters, animations, sprite sheets, tilesets, and character variations using AI technology.

## Core Features

- Single image generation with custom prompts
- 8-direction character rotation (N, NE, E, SE, S, SW, W, NW)
- Animation generation with configurable frame counts
- Tileset creation with seamless tiling options
- Character variations with different styles
- Game jam packages (bundled asset generation)
- Export formats: PNG, GIF, sprite sheets

## Tech Integration

- Authentication via Clerk
- Database via Supabase (users, images, prompts, generations, API keys)
- AI generation via PixelLab API
- Prompt translation via Google Gemini API
- Analytics via Vercel Analytics

## Credit System

Users consume credits for generation:
- Single image: 1 credit
- 8-direction rotation: 3 credits
- Animation: 5 credits
- Tileset: 2 credits
- Character variations: 4 credits

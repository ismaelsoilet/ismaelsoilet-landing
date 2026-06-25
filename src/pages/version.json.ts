import type { APIRoute } from 'astro';
import pkg from '../../package.json';

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ version: pkg.version }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache, must-revalidate'
    }
  });
};

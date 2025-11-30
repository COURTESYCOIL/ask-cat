const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDocument = YAML.parse(`
openapi: 3.0.0
info:
  title: Ask Cat API
  version: 1.0.0
  description: API for the Ask Cat application, including user progress, authentication, and Discord interactions.
servers:
  - url: https://ask-cat.vercel.app
    description: Production server
paths:
  /api/progress:
    get:
      summary: Get User Progress
      description: Retrieves the interaction count and unlocked achievements for a user.
      parameters:
        - in: query
          name: userId
          schema:
            type: string
          required: true
          description: The ID of the user whose progress is to be retrieved.
        - in: header
          name: x-bot-api-key
          schema:
            type: string
          description: API key for bot authentication. Required if authenticating as a bot.
        - in: cookie
          name: auth-token
          schema:
            type: string
          description: JWT token for website authentication. Required if authenticating as a website user.
      responses:
        '200':
          description: User progress retrieved successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  interactionCount:
                    type: integer
                    description: The number of interactions the user has had.
                  unlockedAchievements:
                    type: object
                    description: A map of unlocked achievements.
        '401':
          description: Not authenticated.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
        '403':
          description: Forbidden: Invalid bot secret.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
        '500':
          description: Internal server error.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
    post:
      summary: Save User Progress
      description: Updates the interaction count and unlocked achievements for a user.
      parameters:
        - in: query
          name: userId
          schema:
            type: string
          required: true
          description: The ID of the user whose progress is to be saved.
        - in: header
          name: x-bot-api-key
          schema:
            type: string
          description: API key for bot authentication. Required if authenticating as a bot.
        - in: cookie
          name: auth-token
          schema:
            type: string
          description: JWT token for website authentication. Required if authenticating as a website user.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                interactionCount:
                  type: integer
                  description: The new interaction count for the user.
                unlockedAchievements:
                  type: object
                  description: The new map of unlocked achievements for the user.
              example:
                interactionCount: 10
                unlockedAchievements:
                  first_login: true
      responses:
        '200':
          description: Progress saved successfully.
          content:
            text/plain:
              schema:
                type: string
                example: "Progress saved."
        '401':
          description: Not authenticated.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
        '403':
          description: Forbidden: Invalid bot secret.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
        '500':
          description: Internal server error.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
  /api/me:
    get:
      summary: Get Current User Information
      description: Retrieves information about the currently authenticated user based on their JWT token.
      parameters:
        - in: cookie
          name: auth-token
          schema:
            type: string
          required: true
          description: JWT token for website authentication.
      responses:
        '200':
          description: User information retrieved successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: string
                    description: The user's ID.
                  username:
                    type: string
                    description: The user's username.
        '401':
          description: Not authenticated or Invalid token.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
  /api/auth/callback:
    get:
      summary: Discord OAuth2 Callback
      description: Handles the Discord OAuth2 callback, exchanges the authorization code for an access token, fetches user data, upserts user progress in Supabase, sets an authentication cookie, and redirects the user.
      parameters:
        - in: query
          name: code
          schema:
            type: string
          required: true
          description: The authorization code received from Discord after user authentication.
      responses:
        '302':
          description: Redirects to the homepage (/) upon successful authentication. An 'auth-token' cookie is set.
          headers:
            Set-Cookie:
              schema:
                type: string
                example: auth-token=your_jwt_token_here; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800
        '400':
          description: Bad Request - No authorization code provided.
          content:
            text/plain:
              schema:
                type: string
                example: No code provided.
        '500':
          description: Internal Server Error - Occurs due to missing environment variables, failure to fetch tokens/user data from Discord, or other unhandled errors during the OAuth flow.
          content:
            text/plain:
              schema:
                type: string
                example: An error occurred during authentication.
  /api/interactions:
    post:
      summary: Handle Discord Interactions
      description: Receives and processes interactions from Discord, such as PINGs and slash commands.
      parameters:
        - in: header
          name: x-signature-ed25519
          schema:
            type: string
          required: true
          description: The signature of the request, used for verification.
        - in: header
          name: x-signature-timestamp
          schema:
            type: string
          required: true
          description: The timestamp of the request, used for verification.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              description: The Discord interaction object.
              example:
                id: "123456789012345678"
                application_id: "987654321098765432"
                type: 1 # PING
                token: "a_discord_interaction_token"
                version: 1
      responses:
        '200':
          description: Interaction processed successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  type:
                    type: integer
                    description: The type of response (e.g., 1 for PONG, 4 for ChannelMessageWithSource).
                  data:
                    type: object
                    description: Data associated with the response (e.g., message content).
        '401':
          description: Bad request signature.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
        '404':
          description: Unknown interaction type.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
        '500':
          description: Internal Server Error - Missing environment variables or other server-side issues.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
`);

module.exports = swaggerUi.serve, swaggerUi.setup(swaggerDocument);

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins"

// import { Resend } from 'resend';

const client = new MongoClient(process.env.BETTER_AUTH_DB_URL);
const db = client.db("equipmentRentalDB");

// const resend = new Resend(process.env.BETTER_AUTH_RESEND_API_KEY);

export const auth = betterAuth({
  emailAndPassword: { 
    enabled: true,
  },
  socialProviders: {
      google: { 
          clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID, 
          clientSecret: process.env.BETTER_AUTH_GOOGLE_CLIENT_SECRET, 
      }, 
      github: { 
          clientId: process.env.BETTER_AUTH_GITHUB_CLIENT_ID, 
          clientSecret: process.env.BETTER_AUTH_GITHUB_CLIENT_SECRET, 
      }
  },
  database: mongodbAdapter(db, {
    client,
  }),
  plugins: [
      jwt(), 
  ],
	session: {
		cookieCache: {
			enabled: true, // Enable caching session in cookie (default: `false`)	
			maxAge: 300, // 5 minutes
			strategy: "jwt"
		}
	},
});
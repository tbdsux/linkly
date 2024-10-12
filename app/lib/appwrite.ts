import { Account, Client, Databases } from "appwrite";
import { getPublicEnv } from "~/components/public-env";

const client = new Client();
client.setEndpoint(getPublicEnv("APPWRITE_DOMAIN"));
client.setProject("670833ee0020222d8f68");

const account = new Account(client);
const databases = new Databases(client);

export { account, client as appwriteClient, databases };

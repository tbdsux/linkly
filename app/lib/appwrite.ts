import { Account, Client, Databases } from "appwrite";

const client = new Client();
client.setProject("670833ee0020222d8f68");

const account = new Account(client);
const databases = new Databases(client);

export { account, client as appwriteClient, databases };
